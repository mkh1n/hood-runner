
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var wrapperBlock = document.getElementsByClassName("wrapper")[0];
var creditsBlock = document.getElementsByClassName("credits")[0];
var pauseBlock = document.getElementsByClassName("pause")[0];
var pauseButton = document.getElementsByClassName("pauseButton")[0];
var gameOverBlock = document.getElementsByClassName("gameOver")[0];
var mainMenuBlock = document.getElementsByClassName("mainMenu")[0];
var scoreBlock = document.getElementsByClassName("score")[0];
var overlay = document.getElementsByClassName("overlay")[0];
var GameOverScoreBlock = document.getElementsByClassName("score")[1];

window.addEventListener("resize", Resize);

var speed = 9;
var bgRatio = 0;

var leftPressed = false;
var rightPressed = false;
var rolling = 0;
var jumpPressed = false;
var jumpCount = 0;
var jumpLength = 50;
var jumpHeight = 0;
var overIndex = 1;
var loader = new PxLoader(); 

var frameNumber = 1;

const runSprites = [];
for (let i = 1; i < 9; i += 1){
	runSprites.push(loader.addImage('assets/sprites/run/'+ i +'.png'));
}
const rollSprites = [];
for (let i = 1; i < 4; i += 1){
	rollSprites.push(loader.addImage('assets/sprites/roll/'+ i +'.png'));
}
const jumpSprites = [];
for (let i = 1; i < 5; i += 1){
	jumpSprites.push(loader.addImage('assets/sprites/jump/'+ i +'.png'));
}
const barriersSprites = [];
for (let i = 1; i < 6; i += 1){
	barriersSprites.push(loader.addImage('assets/sprites/barriers/'+ i +'.png'));
}
const dronesSprites = [];
const leftDronesSprites = [];
for (let i = 1; i < 8; i += 1){
	dronesSprites.push(loader.addImage('assets/drones/'+ i +'.png'));
	leftDronesSprites.push(loader.addImage('assets/drones/'+ 'l' + i +'.png'));
}
const bgSprites = [];
for (let i = 1; i < 8; i += 1){
	bgSprites.push(loader.addImage('assets/bg/'+ i +'.png'));
}


loader.start(); 

loader.addCompletionListener(() => {
	mainMenuBlock.classList.toggle('hide')
	bgRatio =  bgSprites[0].naturalWidth / bgSprites[0].naturalHeight
})

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
		this.image = image;
		var obj = this;
		this.image.addEventListener("load", function () { obj.loaded = true; });
	}
	Update(bg) {
		this.x -= speed * this.layer;
		if (this.x < 0)
		{
			bg.x = this.x + (canvas.height * bgRatio) - speed
		}
	}
}
class GameObject {
	constructor(image, x, y, isPlayer, isDrone = false, goToLeft = false) {
		this.x = x;
		this.y = y;
		this.dead = false;
		this.deadDrone = false
		this.isPlayer = isPlayer
		this.isDrone = isDrone
		this.goToLeft = goToLeft
		this.image = image
		this.speed = speed
		this.topBarrier = false
	}
	Update() {
		var barrierWidth = (canvas.height / 4.5) * (this.image.width / this.image.height)

		if (!this.isPlayer) {
			if (this.isDrone) {
				if (this.goToLeft){
					this.x -= 1.2 * this.speed 
				} else{
					this.x += 0.9 * this.speed 
				}
			} else{
				this.x -= speed
			}
			if ((!this.topBarrier && this.x < - barrierWidth) || (this.topBarrier && this.x < - 5 * barrierWidth)) {
				this.dead = true;
			}
			if (this.isDrone && ((this.goToLeft && this.x < -canvas.width) || (!this.goToLeft && (this.x > canvas.width)))) {
				this.deadDrone = true;
			}
		}
	}
	Collide(object){	
		var barrierWidth = (canvas.height / 3.2)
		var barrierHight = (canvas.height / 3.2) / (object.image.naturalWidth / object.image.naturalHeight)

		var playerWidth = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);
		var playerHeight = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);

		var hit = false;

		if (object.topBarrier){
			if(this.x + playerWidth / 2.5 > object.x && this.x < object.x + barrierWidth / 2.5 ){
				if (rolling < 1){
					hit = true
				}
		}
		} else{
			if(this.x + playerWidth / 1.5 > object.x && this.x < object.x + barrierWidth / 1.5 ){
				if(object.y - jumpHeight + playerHeight > object.y + barrierHight){
					hit = true;
				}
			}
		}
		return hit;
	}
}



var player = new GameObject(runSprites[0], 50,  canvas.height , true)

var objects = [];
var drones = [];

function animate(object, spritesArr) {
	frameNumber += 1
	if (frameNumber > spritesArr.length - 1) {
		frameNumber = 1
	}
	object.image = spritesArr[frameNumber]
	
}

var runAnimate = setInterval(() => {
	animate(player, runSprites)
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
		jumpCount += 	1.2 + (score / 1800) ;
		jumpHeight = (canvas.height / 110)* jumpLength * Math.sin(Math.PI * jumpCount / jumpLength);

	}
	if (jumpCount > jumpLength) {
		jumpCount = 0;
		jumpPressed = false;
		jumpHeight = 0;

		clearInterval(runAnimate)
		runAnimate = setInterval(() => {
			animate(player, runSprites)
		}, 75)
	}
}

var bg = [
	new Bg(bgSprites[0], 0, 0.1),
	new Bg(bgSprites[0], canvas.height * bgRatio, 0.1),
	
	new Bg(bgSprites[1], 0, 0.4),
	new Bg(bgSprites[1], canvas.height * bgRatio, 0.4),

	new Bg(bgSprites[2], 0, 0.6),
	new Bg(bgSprites[2], canvas.height * bgRatio, 0.6),

	new Bg(bgSprites[3], 0, 0.85),
	new Bg(bgSprites[3], canvas.height * bgRatio, 0.85),

	new Bg(bgSprites[4], 0, 1),
	new Bg(bgSprites[4], canvas.height * bgRatio, 1),

	new Bg(bgSprites[5], 0, 0.95),
	new Bg(bgSprites[5], canvas.height * bgRatio, 0.95),

	new Bg(bgSprites[6], 0, 0.91),
	new Bg(bgSprites[6], canvas.height * bgRatio, 0.91),

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
			animate(player, jumpSprites)
		}, 65)
		
		jumpPressed = true;
	} 
	if  ((e.keyCode == 83 || e.keyCode == 40) & !jumpPressed){
		clearInterval(runAnimate)
		rolling += 1
		if (rolling == 1){
			player.image = rollSprites[0]
			setTimeout(()=>{
				player.image = rollSprites[1]
				setTimeout(()=>{
					player.image = rollSprites[2]
				}, 55)
			}, 55)
		} else{
			player.image = rollSprites[2]
	}
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
	if (e.keyCode == 83 || e.keyCode == 40){
		clearInterval(runAnimate)
		rolling = 0
		player.image = rollSprites[1]
		setTimeout(()=>{
			player.image = rollSprites[0]
			setTimeout(()=>{
				runAnimate = setInterval(() => {
					animate(player, runSprites)}, 75)
			}, 0)
		}, 55)

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
	scoreBlock.classList.toggle('hide')
	pauseButton.classList.toggle('hide')
}
function ResetGlobalVariables(){
	objects = [];
	drones = []
	player.x = 50;
	gameOver = false;
	pause = false;
	player.dead = false;
	speed = canvas.width / 130;
	overIndex = 1
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
		pauseButton.classList.toggle('hide')
		scoreBlock.classList.toggle('hide')
	}
	ResetGlobalVariables();
	document.addEventListener("keydown", keyRightHandler, false);
	document.addEventListener("keyup", keyLeftHandler, false);
	Start()
}
function GoToHome(){
	if(pause){
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
	if(score > 500){
		ctx.imageSmoothingQuality = "medium"
	}
	else if(score > 800){
		ctx.imageSmoothingQuality = "high"
	}
	for (let i = 0; i < bg.length - 1; i += 2){
		UpdateBg(i)
	} 

	if (RandomInteger(0, 10000) > 9800) {
		if (objects.length == 0 || objects.at(-1).x < canvas.width - 100 ){
			objects.push(new GameObject(barriersSprites[0], 4 * canvas.width / 3 ,canvas.height - (wrapperBlock.offsetHeight / 4.5) , false));
				var randomBarrier = RandomInteger(1, 5)
				switch(randomBarrier){
					case 1:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						break;
					case 2:
						objects.at(-1).image  = barriersSprites[randomBarrier - 1]
						break;
					case 3:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						break;
					case 4:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 5)
						break;
					case 5:
						objects.at(-1).image = barriersSprites[5 - 1]
						objects.at(-1).topBarrier = true
						objects.at(-1).y =  canvas.height - (canvas.height / 3.2) / (objects.at(-1).image.naturalWidth / objects.at(-1).image.naturalHeight)
						break;
				}
		}
	}
	if (RandomInteger(0, 10000) < 300) {
		var leftSideDrone = RandomInteger(1, 2)
		var condition = leftSideDrone == 1 ? (drones.length == 0 || drones.at(-1).x < canvas.width / 3)
		: (drones.length == 0 || drones.at(-1).x > canvas.width / 3)
		if (condition){
			drones.push(new GameObject(barriersSprites[0], 4 * canvas.width / 3 , wrapperBlock.offsetHeight / 20, false, true, false));
			var randomDrone = RandomInteger(1, 7)
			drones.at(-1).speed += (Math.random())
			if (leftSideDrone == 1){
				drones.at(-1).goToLeft = true;
				drones.at(-1).x = canvas.width
				drones.at(-1).image = leftDronesSprites[randomDrone - 1]
			} else{
				drones.at(-1).x = -canvas.width / 5
				drones.at(-1).image = dronesSprites[randomDrone - 1]

			}
			
	}
	}
	var droneIsDead = false;

	for(var i = 0; i < drones.length; i++)
	{
		drones[i].Update();

		if(drones[i].deadDrone)
		{
			droneIsDead = true;
		}
	}
	if(droneIsDead)
	{
		drones.shift();
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
	
	if (score.toFixed(0) % 100 == 0 && score.toFixed(0) != 0){
		
		if (overIndex == 9){
			overIndex = 1
		}
		overlay.style.opacity = 0
		overlay.style.backgroundImage = "url(" + 'assets/bg/overlay' + Number(overIndex) + '.png)'
		setTimeout(()=>overlay.style.opacity = 0.15)
		
		overIndex += 1
	}

	speed += 0.001
	
	Draw();
	Move();
	showScore()
}


function Draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); 
	for (var i = 0; i < 6; i += 1) {
		ctx.drawImage(
				bg[i].image, 
				0,
				0,
				bg[i].image.naturalWidth,
				bg[i].image.naturalHeight,
				bg[i].x,
				bg[i].y, 
				canvas.height * bgRatio,
				canvas.height
			);
	}
	for (var i = 0; i < drones.length; i++) {
		DrawObject(drones[i])
	}
	for (var i = 6; i < bg.length; i += 1) {
		ctx.drawImage(
				bg[i].image, 
				0,
				0,
				bg[i].image.naturalWidth,
				bg[i].image.naturalHeight,
				bg[i].x,
				bg[i].y, 
				canvas.height * bgRatio,
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
	var barrierWidth = (canvas.height / 3.2)
	var barrierHight = (canvas.height / 3.2) / (object.image.naturalWidth / object.image.naturalHeight)

	var playerWidth = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);
	var playerHeight = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);

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