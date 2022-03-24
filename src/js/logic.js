var canvas = document.getElementById("game")
var context = canvas.getContext("2d")
var bullet = new Image()
bullet.src = "src/img/bullet.jpg"
var ship = new Image()
ship.src = "src/img/player.png"
var monster = new Image()
monster.src = "src/img/enemy.png"
var magicBall = new Image()
magicBall.src = "src/img/bulletEnemy.png"

const colums = 32;
const row = 24;
const boxes = 25;
let arena;
var score = 0;
let id;
let game = true

let player = { 
    pos : {x: 15,
            y: 19},
    health : 100
}

let newMatrix = [[1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 36],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [37, 0, 38, 0, 39, 0, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 45]
                ]


let enemy = {
    matrix : [[1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 36],
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [37, 0, 38, 0, 39, 0, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 45]
            ],
    pos : {
        x : 7,
        y : 1
    },
    fire : false,
    sideLF : "left",
    sideUD : "down"
}

let bulletPlayer = []
let bulletEnemy = []

context.scale(boxes, boxes);

function drawEnemy(){
    for(let i = 0; i < enemy.matrix.length; i++){
        for(let j = 0; j < enemy.matrix[i].length; j++){
            if(enemy.matrix[i][j] >= 1){
                context.drawImage(monster,j + enemy.pos.x, i + enemy.pos.y, 1, 1)
            }
        }
    }
}

function initArena(){
    enemyFire();
    arena = Array.from(
        {length: row}, () => Array(colums).fill(0)
    );
}

function drawArena(){
    for(let i = 0; i < arena.length;i++){
        for(let j = 0; j < arena[i].length; j++){
            if(arena[i][j] === 0){
                context.fillStyle='black';
                context.fillRect(j, i, 1, 1);
            }
        }
    }
}

function drawCosmoShip(x,y){
    context.drawImage(ship, x, y, 3, 3);
}

function loopEnemyMatrix(x,y,index,staticY){
    for(let i = 0; i < enemy.matrix.length; i++){
        for(let j = 0; j < enemy.matrix[i].length; j++){
            if(x === j && y === i && enemy.matrix[i][j] >= 1){
                enemy.matrix[i][j] = 0
                score+=1
                bulletPlayer.splice(index,1)
            }
        }
    }
    if(staticY < 0){
        bulletPlayer.splice(index,1)
    }
}

function isShoot(){
    for(let i = 0; i < bulletPlayer.length; i++){
        context.drawImage(bullet, bulletPlayer[i].x, bulletPlayer[i].y, 1, 1);
        bulletPlayer[i].y -= 0.5

        loopEnemyMatrix(Math.floor(bulletPlayer[i].x - enemy.pos.x), Math.floor(bulletPlayer[i].y - enemy.pos.y),i,bulletPlayer[i].y)
    }
}


document.addEventListener("keydown", (event) => {
    if(event.keyCode === 37 && player.pos.x !== 0){
        player.pos.x--
    }
    else if(event.keyCode === 39 && player.pos.x !== 29){
        player.pos.x++
    }
    else if(event.keyCode === 32 && game === true){
        bulletPlayer.push({
            x: player.pos.x + 1,
            y: player.pos.y
        })
        isShoot()
    }
})

function randomEnemy(){
    return Math.ceil(Math.random()*44)
 }
 
function enemyFire(){
    return setInterval(() => {
    let rand = randomEnemy()
    for(let i = 0; i < enemy.matrix.length; i++){
        for(let j = 0; j < enemy.matrix[i].length; j++){
            if(enemy.matrix[i][j] === rand){
                bulletEnemy.push({
                    x: enemy.pos.x + j,
                    y: enemy.pos.y + i
                })
            }
        }
    }
    },700)
}

function loopPlayer(x,y,index,staticY){
    if(x >= player.pos.x && x + 1 <= player.pos.x + 2 && y >= player.pos.y && y + 1 <= player.pos.y + 2){
        player.health -= 25
        bulletEnemy.splice(index,1)
    }

    if(staticY > 24){
        bulletEnemy.splice(index,1)
    }
}


function isShootEnemy() {
    for(let i = 0; i < bulletEnemy.length; i++){
        context.drawImage(magicBall, bulletEnemy[i].x, bulletEnemy[i].y, 1, 1);
        bulletEnemy[i].y += 0.4
        
        loopPlayer(Math.floor(bulletEnemy[i].x), Math.floor(bulletEnemy[i].y),i, bulletEnemy[i].y)
    }
}

function addNewEnemy() {
    if(enemy.matrix.flat().find(item => item > 0) === undefined){
        enemy.matrix = [...newMatrix]
    }
}

function gameOver() {
    if(player.health <= 0){
        game = false
        drawArena();
        context.fillStyle = "white"
        context.font='4px Verdana';
        context.fillText("Game Over!", 4, 12);
        context.font='2.5px Verdana';
        context.fillText(`Score:${score}`, 12, 15);
        cancelAnimationFrame(id)
    }
}

function enemyMoving(){
    //horisontal
    if(enemy.sideLF == "right"){
        enemy.pos.x+= 0.1
        if(Math.ceil(enemy.pos.x + 17) == colums){
            enemy.sideLF = "left"
        }
    }
    else if(enemy.sideLF == "left"){
        enemy.pos.x-= 0.1
        if(Math.floor(enemy.pos.x) == 0){
            enemy.sideLF = "right"
        }
    }
    //vertical
    if(enemy.sideUD == "down"){
        enemy.pos.y += 0.01
        if(Math.ceil(enemy.pos.y + 9) == 16)
            enemy.sideUD = "up"
    }
    else if(enemy.sideUD == "up"){
        enemy.pos.y -= 0.01
        if(Math.floor(enemy.pos.y) == 0){
            enemy.sideUD = "down"
        }
    }
}

function isUpdate(){
    drawArena();
    addNewEnemy();
    isShoot();
    isShootEnemy();
    enemyMoving();
    drawEnemy();
    drawCosmoShip(player.pos.x, player.pos.y);
    context.fillStyle = "white"
    context.font='1px Verdana';
    context.fillText(`Score: ${score}`, 1, 23.5);
    context.fillText(`Health: ${player.health}`,25, 23.5)
    gameOver();
    id = requestAnimationFrame(isUpdate)
}

initArena();

