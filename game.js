const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}
let bombPositions = [];

window.addEventListener('load', setCanvaSize);
window.addEventListener('resize', setCanvaSize);

function setCanvaSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize / 10) - 1;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    // console.log({ canvasSize, elementsSize });

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));

    showLives();

    bombPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowsCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {

            const emoji = emojis[col];
            const positionX = elementsSize * (colIndex + 1);
            const positionY = elementsSize * (rowIndex + 1);
            // EL CODIGO DE ABAJO fue el que se cambio para que asi al mover 
            //el mono se borrara en su posicion anterior
            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = positionX;
                    playerPosition.y = positionY;
                    console.log({ playerPosition });
                }
            } else if (col == 'I') {
                giftPosition.x = positionX;
                giftPosition.y = positionY;
            } else if (col == 'X') {
                bombPositions.push({
                    x: positionX,
                    y: positionY,
                });
            }

            game.fillText(emoji, positionX, positionY);
        });
    });
    movePlayer();
}
//Esto de ABAJO es lo mismo de ARRIBA 
//     for (let row = 1; row <= 10; row++) {
//         for (let col = 1; col <= 10; col++) {
//             game.fillText(emojis[mapRowsCols[row -1][col -1]], 
//                 elementsSize * col, elementsSize * row);
//         }
//     }
function movePlayer() {
    const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColision = giftColisionX && giftColisionY;

    if (giftColision) {
        levelWin();
    }

    const bombCollision = bombPositions.find(bomb => {
        const bombCollisionX = bomb.x.toFixed(3) == playerPosition.x.toFixed(3);
        const bombCollisionY = bomb.y.toFixed(3) == playerPosition.y.toFixed(3);
        return bombCollisionX && bombCollisionY;
    });

    if (bombCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'],
        playerPosition.x, playerPosition.y);
}
function levelWin() {
    console.log("Subiste de nivel");
    level++;
    startGame();
}
function levelFail() {
    lives--;
   

    if (lives <= 0) {
        level = 0;
        lives = 3; 
        timeStart = undefined;
    } 
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log("terminaste el juego");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
        if (recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML= 'superaste el record';
        } else {
            pResult.innerHTML= 'No superaste el record :(';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML= 'Primera vez? SUPER! trata de superar tu record';
    }
    console.log({recordTime, playerTime});
}
function showLives(){
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
    // arriba fue solucion de comentarios y abajo del curso
    // const heartsArray =Array(lives).fill(emojis['HEART']);
    // spanLives.innerHTML= "";

    // heartsArray.forEach(heart => 
    //      spanLives.append(heart));
}
function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}
   
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == "ArrowUp") moveUp();
    else if (event.key == "ArrowLeft") moveLeft();
    else if (event.key == "ArrowRight") moveRight();
    else if (event.key == "ArrowDown") moveDown();
}

function moveUp() {
    console.log('me quiero mover hacia arriba');
    // entre 2
    if ((playerPosition.y - elementsSize) < elementsSize / 2) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('me quiero mover hacia izq');
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function moveRight() {
    console.log('me quiero mover hacia der');
    // mas 1
    if ((playerPosition.x + elementsSize) > canvasSize + 1) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}
function moveDown() {
    console.log('me quiero mover hacia abajo');
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }


}