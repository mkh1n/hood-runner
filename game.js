var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var wrapperBlock = document.getElementsByClassName("wrapper")[0];
var creditsBlock = document.getElementsByClassName("credits")[0];
var pauseBlock = document.getElementsByClassName("pause")[0];
var pauseButton = document.getElementsByClassName("pauseButton")[0];
var gameOverBlock = document.getElementsByClassName("gameOver")[0];
var mainMenuBlock = document.getElementsByClassName("mainMenu")[0];
var scoreBlock = document.getElementsByClassName("score")[0];
var GameOverScoreBlock = document.getElementsByClassName("score")[1];

window.onload	
window.addEventListener("resize", Resize);

var speed = innerWidth / 130 ;

var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var jumpCount = 0;
var jumpLength = 50;
var jumpHeight = 0;

var frameNumber = 1;
const run = 'assets/sprites/run/'
const jump = 'assets/sprites/jump/'
const idle = 'assets/sprites/idle/'

var stopGame = false;
var score = 0;
var pause = false
var gameOver = false

Resize();

class Bg {
	constructor(image, x, layer) {
		this.x = x;
		this.y = 0;
		this.layer = layer;
		this.image = new Image();

		this.image.src = image;

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });
	}

	Update(bg) {
		this.x -= speed * this.layer ;

		if (this.x < - (canvas.height * 3.7643207856))
		{
			this.x = bg.x + (canvas.height * 3.7643207856) - speed
		}
	}
}

class GameObject {
	constructor(image, x, y, isPlayer) {
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = image
		this.heighCoeff = 0.96;
		this.dead = false;
		this.isPlayer = isPlayer

		var obj = this;
		this.image.addEventListener("load", function () { obj.loaded = true; });
	}
	Update() {
		var barrierWidth = (canvas.height / 4.5) * (this.image.width / this.image.height)
		if (!this.isPlayer) {
			this.x -= speed;
			if (this.x < 0 - barrierWidth) {
				this.dead = true;
			}
		}
	}
	Collide(object){	
		var barrierWidth = (canvas.width / 6.5)  * object.heighCoeff
		var barrierHight = (canvas.width / 6.5) / (object.image.width / object.image.height)* object.heighCoeff
		var playerWidth = (canvas.height / 4) * (player.image.width / player.image.height);
		var playerHeight = (canvas.height / 4) * (player.image.width / player.image.height);

		var hit = false;
			
		if(this.x + playerWidth / 1.5 > object.x && this.x < object.x + barrierWidth / 1.5 )
		{
			if(object.y - jumpHeight + playerHeight > object.y + barrierHight  )
			{
				hit = true;
			}
		}

		return hit;
	}
}



var player = new GameObject('assets/sprites/run/1.png', 50,  canvas.height , true)

var objects = []


function animate(object, path, length) {
	frameNumber += 1
	if (frameNumber > length - 1) {
		frameNumber = 1
	}
	object.image.src = path + frameNumber + '.png'
	
}

var runAnimate = setInterval(() => {
	animate(player, run, 8)
}, 75)

function Move() {
	if (rightPressed && player.x + canvas.width/ 10 < canvas.width) //вправо
	{
		player.x += speed;
	}
	else if (leftPressed &&  player.x> 0) //влево
	{
		player.x -= speed;
	}
	if (jumpPressed) { 
		jumpCount += 1.2 + (score / 1800) ;
		jumpHeight = (canvas.height / 100)* jumpLength * Math.sin(Math.PI * jumpCount / jumpLength);
	}
	if (jumpCount > jumpLength) {
		jumpCount = 0;
		jumpPressed = false;
		jumpHeight = 0;

		clearInterval(runAnimate)
		runAnimate = setInterval(() => {
			animate(player, run, 8)
		}, 75)
		
	}

}

var bg = [
	new Bg("assets/bg/1.png", 0, 0.1),
	new Bg("assets/bg/1.png", canvas.height * 3.7643207856, 0.1),
	
	new Bg("assets/bg/2.png", 0, 0.4),
	new Bg("assets/bg/2.png", canvas.height * 3.7643207856, 0.4),

	new Bg("assets/bg/3.png", 0, 0.8),
	new Bg("assets/bg/3.png", canvas.height * 3.7643207856, 0.8),

	new Bg("assets/bg/4.png", 0, 1),
	new Bg("assets/bg/4.png", canvas.height * 3.7643207856, 1),
]


function keyRightHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68) { //rightkey
		rightPressed = true;
	}
	if (e.keyCode == 37 || e.keyCode == 65) { //leftkey
		leftPressed = true;
	}
	if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
		clearInterval(runAnimate)
		runAnimate = setInterval(() => {
			animate(player, jump, 4)
		}, 65)
		
		jumpPressed = true;
	}
	if (e.keyCode == 27) { //esc
		PauseToggle()
	}

}

function keyLeftHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68){
		rightPressed = false;
	}
	if (e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = false;
	}
	}

function PlayButtonActivate(){
	ResetGlobalVariables()
	document.addEventListener("keydown", keyRightHandler, false);
	document.addEventListener("keyup", keyLeftHandler, false);
	mainMenuBlock.classList.toggle('hide')
	pauseButton.classList.toggle('hide')
	scoreBlock.classList.toggle('hide')
	Start()
}
function ShowCredits(){
	creditsBlock.classList.toggle('hide')
}
function Start() {
	stopGame = false;
	Update();
	if (stopGame === false) {
			frame = requestAnimationFrame(Start);
	}
}

function Stop() {
	if(frame) {
		cancelAnimationFrame(frame);
		stopGame = true;
 }
}
function PauseToggle() {
	stopGame ? Start() : Stop()
	pause = pauseBlock.classList.contains('hide')  ? true : false
	pauseBlock.classList.toggle('hide')
}
function ResetGlobalVariables(){
	objects = [];
	player.x = 50;
	gameOver = false;
	pause = false;
	player.dead = false;
	ratio = innerHeight / innerWidth
	speed =  innerWidth / 130
	player.y = canvas.height - (wrapperBlock.offsetHeight / 3.2)
	score = 0;
	document.removeEventListener("keydown", keyRightHandler, false);
	document.removeEventListener("keyup", keyLeftHandler, false);
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
}
function GameOver(){
	GameOverScoreBlock.innerText = 'Score: '+ score.toFixed(0)
	document.removeEventListener("keydown", keyRightHandler, false);
	scoreBlock.classList.toggle('hide')
	pauseButton.classList.toggle('hide')
	gameOverBlock.classList.toggle('hide')
	player.dead = false;
	Stop()
}

function Replay(){
	if (gameOver){
		gameOverBlock.classList.toggle('hide')
		pauseButton.classList.toggle('hide')
		scoreBlock.classList.toggle('hide')
	}
	if (pause){
		pauseBlock.classList.toggle('hide')
	}
	ResetGlobalVariables();
	document.addEventListener("keydown", keyRightHandler, false);
	document.addEventListener("keyup", keyLeftHandler, false);
	Start()
}
function GoToHome(){
	if(pause){
		pauseButton.classList.toggle('hide')
		scoreBlock.classList.toggle('hide')
		pauseBlock.classList.toggle('hide')
	}
	if (gameOver){
		gameOverBlock.classList.toggle('hide')
	}
	ResetGlobalVariables();
	mainMenuBlock.classList.toggle('hide')
}
function UpdateBg(index){
	bg[index].Update(bg[index+1])
	bg[index+1].Update(bg[index])
}

function showScore() {
	score += 0.12
	scoreBlock.innerText = "score: " + score.toFixed(0)
}
function Update() {
	for (let i = 0; i < bg.length - 1; i += 2){
		UpdateBg(i)
	} 

	if (RandomInteger(0, 10000) > 9800) {
		if (objects.length == 0 || objects.at(-1).x < canvas.width - 100 ){

			objects.push(new GameObject('assets/sprites/barriers/barrier1.png', 4 * canvas.width / 3 , 0, false));
			
				var randomBarrier = RandomInteger(1, 4)
				switch(randomBarrier){
					case 1:
						objects.at(-1).image.src =  'assets/sprites/barriers/barrier1.png'
						objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 4.5)
						break;
					case 2:
						objects.at(-1).image.src ='assets/sprites/barriers/barrier2.png'
						objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 4.5)
						break;
					case 3:
						objects.at(-1).image.src ='assets/sprites/barriers/barrier3.png'
						objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 4.5)
						break;
					case 4:
					objects.at(-1).image.src ='assets/sprites/barriers/barrier4.png'
					objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 5)
					break;
				}
		}
	}
	var isDead = false; 

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}
	if(isDead)
	{
		objects.shift();
	}

	var hit = false;
	
	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if(hit)
		{
			player.dead = true
		}
	}

	player.Update();

	if(player.dead){
		gameOver = true		
		GameOver()
	}
	speed += 0.001
	Draw();
	Move();
	showScore()
}

function Draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); 

	for (var i = 0; i < bg.length; i += 1) {
		ctx.drawImage(
				bg[i].image, 
				0,
				0,
				bg[i].image.width, 
				bg[i].image.height, 
				bg[i].x,
				bg[i].y, 
				canvas.height * (bg[i].image.width / bg[i].image.height),
				canvas.height
			);
	}
	for (var i = 0; i < objects.length; i++) {
		DrawObject(objects[i])
	}

	DrawObject(player)

}
function DrawObject(object)
{
	var barrierWidth = (canvas.width / 6.5)  * object.heighCoeff
	var barrierHight = (canvas.width / 6.5) / (object.image.width / object.image.height)* object.heighCoeff

	var playerWidth = (canvas.height / 4) * (player.image.width / player.image.height);
	var playerHeight = (canvas.height / 4) * (player.image.width / player.image.height);

	ctx.drawImage
	(
		object.image, 
		object.x, 
		object.isPlayer ? object.y - jumpHeight : object.y,

		object.isPlayer ? playerWidth : barrierWidth,

		object.isPlayer ? playerHeight : barrierHight,
	);
}


function Resize() {
	canvas.width = wrapperBlock.offsetWidth;
	canvas.height = wrapperBlock.offsetHeight
}


function RandomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}