const gameStart = document.querySelector('.game-start');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gameArea = document.querySelector('.game-area');
const gamePoints = document.querySelector('.points');
const finalScore = document.querySelector('.game-over-score');

const keys = {};
const player = {
    x: 150,
    y: 100,
    width: 0,
    height: 0,
    lastFireball: 0
};
const game = {
    speed: 2,
    movingMultiplier: 4,
    fireballMultiplier: 5,
    fireInterval: 500,
    cloudInterval: 2000,
    bugInterval: 500,
    bugKillBonus: 2000
};
const scene = {
    score: 0,
    lastCloudSpawn: 0,
    lastBug: 0,
    isActiveGame: true
};

gameStart.addEventListener('click', onGameStart);
function onGameStart() {
    gameStart.classList.add('hide');

    const wizard = document.createElement('div');
    wizard.classList.add('wizard');
    wizard.style.top = '200px';
    wizard.style.left = '200px';
    gameArea.appendChild(wizard);

    player.width = wizard.offsetWidth;
    player.height = wizard.offsetHeight;
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';

    window.requestAnimationFrame(gameActions);
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


function gameActions(timestamp) {
    const wizard = document.querySelector('.wizard');
    let isInAir = (player.y + player.height) <= gameArea.offsetHeight;
    let clouds = document.querySelectorAll('.cloud');
    let fireballs = document.querySelectorAll('.fire-ball');
    let bugs = document.querySelectorAll('.bug');

    if (timestamp - scene.lastCloudSpawn > game.cloudInterval + 20000 * Math.random()) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 200;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px';
        gameArea.appendChild(cloud);
        scene.lastCloudSpawn = timestamp;
    }

    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';
        if (cloud.x + clouds.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        }
    });

    if (isInAir) {
        player.y += game.speed;
    }

    if (keys.Space && timestamp - player.lastFireball > game.fireInterval) {
        wizard.classList.add('wizard-fire');
        addFireball(player);
        player.lastFireball = timestamp;
    } else {
        wizard.classList.remove('wizard-fire');
    }

    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier - game.speed * 6;
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowDown && player.y + player.height < gameArea.offsetHeight) {
        player.y += game.speed * game.movingMultiplier;
    }

    if (keys.ArrowLeft && player.x > 0) {   
        player.x -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }
    scene.score++;
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';
    gamePoints.textContent = scene.score;

    fireballs.forEach(fireball => {
        fireball.x += game.speed * game.fireballMultiplier;
        fireball.style.left = fireball.x + 'px';

        if (fireball.x + fireball.offsetWidth > gameArea.offsetWidth) {
            fireball.parentElement.removeChild(fireball);
        }
    });

    if (timestamp - scene.lastBug > game.bugInterval + 5000 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');
        bug.x = gameArea.offsetWidth - 60;
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px';
        gameArea.appendChild(bug);
        scene.lastBug = timestamp;
    }

    bugs.forEach(bug => {
        bug.x -= game.speed * 3;
        bug.style.left = bug.x + 'px';
        if (bug.x + bugs.offsetWidth <= 0) {
            bug.parentElement.removeChild(bug);
        }
    });

    bugs.forEach(bug => {
        if (isCollision(wizard, bug)) {
            isGameOver();
        }
        fireballs.forEach(fireball => {
            if (isCollision(fireball, bug)) {
                scene.score += game.bugKillBonus;
                bug.parentElement.removeChild(bug);
                fireball.parentElement.removeChild(fireball);
            }
        })
    });
    if (scene.isActiveGame) {
        window.requestAnimationFrame(gameActions);
    }
}

function addFireball() {
    const fireball = document.createElement('div');

    fireball.classList.add('fire-ball');
    fireball.style.top = (player.y + player.height / 3 - 5) + 'px';
    fireball.x = player.x + player.width;
    fireball.style.left = fireball.x + 'px';
    gameArea.appendChild(fireball);
}

function isCollision(firstElement, secondElement) {
    let first = firstElement.getBoundingClientRect();
    let second = secondElement.getBoundingClientRect();
    return !(first.top > second.bottom ||
        first.bottom < second.top ||
        first.right < second.left ||
        first.left > second.right);
}

function isGameOver() {
    scene.isActiveGame = false;
    gameOver.classList.remove('hide');
    gameOver.innerHTML = "😭 " + "GAME OVER" + " 😭" + `Your final score is: ${scene.score}`;
    gameStart.classList.remove('hide');
    gameStart.style.top = "500px";
    gameScore.style.bottom = "250px";
}

function onKeyDown(e) {
    keys[e.code] = true;
}

function onKeyUp(e) {
    keys[e.code] = false;
}
