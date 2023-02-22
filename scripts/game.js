
window.addEventListener("resize", Resize);
Resize();
updateAchives();

/*localStorage.clear('HI');
localStorage.clear('slides');

localStorage.clear('deaths');

localStorage.clear('jumps');*/
function muteMe(audio) {
	if (pageMuted){
		audio.muted = false;
	} else{
		audio.muted = true;
	}
    
}
function mutePage() {
	soundBtn.classList.toggle('soundBtnOff');
	if (pageMuted){
		[].forEach.call(audioArr, function(elem) { muteMe(elem); });
		pageMuted = false
	} else{
		[].forEach.call(audioArr, function(elem) { muteMe(elem); });
		pageMuted = true
	}
}



highScoreBlock.innerText =  highScore;
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
		if (this.x < 0) {
			bg.x = this.x + (canvas.height * bgRatio) - speed
		}
	}
}
class GameObject {
	constructor(image, x, y, isPlayer, isDrone = false, goToLeft = false) {
		this.x = x;
		this.y = y;
		this.slideing = false;
		this.dead = false;
		this.deadDrone = false
		this.isPlayer = isPlayer
		this.isDrone = isDrone
		this.goToLeft = goToLeft
		this.image = image
		this.speed = speed

		this.topBarrier = false
		this.levitateCount = 0
		this.sizeCoef = 1;
		this.levitateHeight = 0;
		this.isLevitate = false

	}
	Update() {
		var barrierWidth = (canvas.height / 4.5) * (this.image.width / this.image.height)

		if (!this.isPlayer) {
			if (this.isDrone) {
				if (this.goToLeft) {
					this.x -= 1.2 * this.speed
				} else {
					this.x += 0.9 * this.speed
				}
			} else {
				if (this.isLevitate) {
					this.levitateCount += 0.025
					this.levitateHeight = (canvas.height / 50) * Math.sin(Math.PI * this.levitateCount);
					this.y += this.levitateHeight
				}
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
	Collide(object) {
		var barrierWidth = (canvas.height / 3)
		var barrierHight = (canvas.height / 3) / (object.image.naturalWidth / object.image.naturalHeight)

		var playerWidth = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);
		var playerHeight = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);

		var hit = false;

		if (object.topBarrier) {
			if (this.x + playerWidth / 2.5 > object.x && this.x < object.x + barrierWidth * object.sizeCoef / 1.5) {
				if (this.y - jumpHeight + playerHeight / 1.2 > object.y) {
					var actualPlayerHigh = this.slideing ?  this.y + playerHeight / 2.2: this.y
					if (actualPlayerHigh * 1.1 - jumpHeight < object.y + barrierHight * object.sizeCoef) {
						hit = true;
					}
				}

			}
		} else {
			if (this.x + playerWidth / 1.5 > object.x && this.x < object.x + barrierWidth / 1.5) {
				if (this.y - jumpHeight + playerHeight > object.y * 1.1) {
					hit = true;
				}
			}
		}
		return hit;
	}
}



var player = new GameObject(runSprites[0], 50,
	canvas.height - (wrapperBlock.offsetHeight / 2.2), true)

var objects = [];
function animate(object, spritesArr) {
	frameNumber += 1
	if (frameNumber > spritesArr.length - 1) {
		frameNumber = 1
	}
	object.image = spritesArr[frameNumber]

}

var playerAnimate = setInterval(() => {
	animate(player, runSprites)
}, 75)

function Move() {
	if (rightPressed && player.x + canvas.width / 10 < canvas.width) //вправо
	{
		player.x += speed;
	}
	else if (leftPressed && player.x > 0) //влево
	{
		player.x -= speed;
	}
	if (jumping) { //прыжок
		jumpCount += 1.2 + (score / 1800);
		jumpHeight = (canvas.height / 110) * jumpLength * Math.sin(Math.PI * jumpCount / jumpLength);

	}
	if (jumpCount > jumpLength) { //приземление после прыжка
		jumpCount = 0;
		jumping = false;
		jumpHeight = 0;
		numberOfJumps = Number(numberOfJumps) + 1;
		localStorage.setItem('jumps', numberOfJumps)
		clearInterval(playerAnimate)
		playerAnimate = setInterval(() => {
			animate(player, runSprites)
		}, 75)
	}
}

var bg = [
	new Bg(bgSprites[0], 0, 0.1),
	new Bg(bgSprites[0], canvas.height * bgRatio, 0.1),

	new Bg(bgSprites[1], 0, 0.2),
	new Bg(bgSprites[1], canvas.height * bgRatio, 0.2),

	new Bg(bgSprites[2], 0, 0.3),
	new Bg(bgSprites[2], canvas.height * bgRatio, 0.3),

	new Bg(bgSprites[6], 0, 0.4),
	new Bg(bgSprites[6], canvas.height * bgRatio, 0.4),

	new Bg(bgSprites[3], 0, 0.6),
	new Bg(bgSprites[3], canvas.height * bgRatio, 0.6),

	new Bg(bgSprites[4], 0, 1),
	new Bg(bgSprites[4], canvas.height * bgRatio, 1),

	new Bg(bgSprites[5], 0, 1.2),
	new Bg(bgSprites[5], canvas.height * bgRatio, 1.2)
]

var fg = [
  new Bg(fgSprites[0], 0, 0.3),
	new Bg(fgSprites[0], canvas.height * bgRatio, 0.3)
  
]

function jumpBegin(){
	if (!player.slideing){
		clearInterval(playerAnimate)
	playerAnimate = setInterval(() => {
		animate(player, jumpSprites)
	}, 100 + score / 10)
	jumping = true;
	}
	jumpSound.play();
}
function slideBegin(){
	if (!jumping){
		player.slideing = true;
		slideing += 1
		if (slideing == 1) {
			clearInterval(playerAnimate)
			player.image = slideSprites[0]
			setTimeout(() => {
				player.image = slideSprites[1]
			}, 20)
			playerAnimate = setInterval(() => {
        player.image = slideSprites[2]
				animate(player, slideSprites.slice(3, 6))
			}, 100)
		}
	}
}

function slideEnd(){
	if (!jumping){
		player.slideing = false;
	clearInterval(playerAnimate)
	slideing = 0
	player.image = slideSprites[1]
	setTimeout(() => {
		player.image = slideSprites[0]
	},20)
	playerAnimate = setInterval(() => {
		animate(player, runSprites)
	}, 75)
	numberOfslides = Number(numberOfslides) + 1;
	localStorage.setItem('slides', numberOfslides)
	}
}

function keyRightHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68) { //right
		rightPressed = true;
	}
	if (e.keyCode == 37 || e.keyCode == 65) { //left
		leftPressed = true;
	}
	if (e.keyCode == 87 || e.keyCode == 38) { //jump
		jumpBegin()
	}
	if (e.keyCode == 83 || e.keyCode == 40) { //slide
		slideBegin()
	}
	
	if (e.keyCode == 27 && !gameOver) { //pause
		PauseToggle()
	}

}

function keyLeftHandler(e) {
	if (e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = false;
	}
	if (e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = false;
	}
	if (e.keyCode == 83 || e.keyCode == 40) {
		slideEnd()
	}
	if (e.keyCode == 32 && gameOver == true) {
		Replay()
	}

}
function updateAchives(){
	const achives = {
		0: highScore > 99,
		1: highScore > 281,
		2: highScore > 349,
		3: highScore > 499,
		4: highScore > 999,
		5: numberOfDeaths > 7,
		6: numberOfDeaths > 26,
		7: numberOfDeaths > 41,
		8: numberOfDeaths > 99,
		9: numberOfJumps > 500,
		10: numberOfslides > 300,
	}
	var unlockCount = 0
	for (var i = 0; i < achivesBlocks.length - 1; i+=1){
		if (achives[i]){
			achivesBlocks[i].classList.remove("lock")
			unlockCount += 1
		}
	}
	if (unlockCount == achivesBlocks.length - 1){
		achivesBlocks[achivesBlocks.length - 1].classList.remove('lock')
	}
	document.getElementById('numberOfJumpsBlock').innerHTML = 'Jumps: '+numberOfJumps
	document.getElementById('numberOfDeathsBlock').innerHTML = 'Deaths: '+numberOfDeaths
	document.getElementById('numberOfslidesBlock').innerHTML = 'Slides: '+numberOfslides

}
function PlayButtonActivate() {
	ResetGlobalVariables()
	document.addEventListener("keydown", keyRightHandler, false);
	document.addEventListener("keyup", keyLeftHandler, false);
	toggleHide(mainMenuBlock)
	toggleHide(pauseButton)
	toggleHide(scoreBlock)
	controlBlock.style.opacity = 1;
	setTimeout(() => controlBlock.style.opacity = 0, 2000)
	Start()
}

function PauseToggle() {
	stopGame ? Start() : Stop()
	pause = pauseBlock.classList.contains('hide') ? true : false
	toggleHide(pauseBlock)
	toggleHide(scoreBlock)
	toggleHide(pauseButton)
}
function ResetGlobalVariables() {
	objects = [];
	player.x = 0.1 * canvas.width;
	gameOver = false;
	pause = false;
	player.dead = false;
	speed = canvas.clientWidth / 120;
	player.y = canvas.height - (wrapperBlock.offsetHeight / 2.2)
	score = 0;
	leftPressed = false;
	rightPressed = false;
	document.removeEventListener("keydown", keyRightHandler, false);
	document.removeEventListener("keyup", keyLeftHandler, false);
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
}
function GameOver() {
	bgMusic.pause();
	bgMusic.currentTime = 0;
	Stop()
	gameOverSound.play()
	setTimeout(()=>{
		player.image = deathSprites[0];
		Draw()
		setTimeout(()=>{
			player.image = deathSprites[1]
			Draw()
			setTimeout(()=>{
				player.image = deathSprites[2]
				Draw()
				setTimeout(()=>{
					player.image = deathSprites[3]
					Draw()
					setTimeout(()=>{
						GameOverScoreBlock.innerText = 'Score: ' + score.toFixed(0)
					
					toggleHide(scoreBlock)
					toggleHide(pauseButton)
					toggleHide(gameOverBlock)
					player.dead = false;
					if (score > highScore){
						HIandRecord.innerHTML = 'new record!'
						highScore = Number(score.toFixed(0));
						localStorage.setItem('HI',  score.toFixed(0))
					} else{
						HIandRecord.innerText =  'HI: ' +highScore;
					}
					highScoreBlock.innerText =  highScore;
					updateAchives()
					}, 80)
					
							
				}, 50)
			}, 50)
		}, 50)

	}, 50)
	
	
	
}

function Replay() {
	if (gameOver) {
		bgMusic.play()
		toggleHide(gameOverBlock)
		toggleHide(pauseButton)
		toggleHide(scoreBlock)
	}
	if (pause) {
		toggleHide(pauseBlock)
		toggleHide(pauseButton)
		toggleHide(scoreBlock)
	}
	ResetGlobalVariables();
	document.addEventListener("keydown", keyRightHandler, false);
	document.addEventListener("keyup", keyLeftHandler, false);
	Start()
}
function GoToHome() {
	if (pause) {
		toggleHide(pauseBlock)
	}
	if (gameOver) {
		toggleHide(gameOverBlock)
	}
	bgMusic.pause();
	bgMusic.currentTime = 0;
	ResetGlobalVariables();
	updateAchives()
	toggleHide(mainMenuBlock)
}
function UpdateBg(index, arr = bg) {
	arr[index].Update(arr[index + 1])
	arr[index + 1].Update(arr[index])
}

function showScore() {
	score += 0.12
	scoreBlock.innerText = "Score: " + score.toFixed(0)
}

function Start() {
	stopGame = false;
    fpsInterval = 1000 / 60;
    then = Date.now();
    startTime = then;
    Update();
}

function Stop() {
		stopGame = true;
}
function Update() {

	if (stopGame) {
        return;
    }

	frame = requestAnimationFrame(Update);

	now = Date.now();
    elapsed = now - then;

	if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

		for (let i = 0; i < bg.length - 1; i += 2) {
			UpdateBg(i)
		}


		if (RandomInteger(0, 10000) > 9600) {
			if (objects.length == 0 || objects.at(-1).x < canvas.width - 100) {
				objects.push(new GameObject(barriersSprites[0], 4 * canvas.width / 3, canvas.height - (wrapperBlock.offsetHeight / 2.5), false));
				var randomBarrier = RandomInteger(1, 7)
				switch (randomBarrier) {
					case 1:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						break;
					case 2:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						break;
					case 3:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						break;
					case 4:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
            objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 2.2)
						break;
					case 5:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						objects.at(-1).topBarrier = true
						objects.at(-1).y = canvas.height - (canvas.height / 2.25) / (objects.at(-1).image.naturalWidth / objects.at(-1).image.naturalHeight)
						break;
          case 6:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            
            break;
					case 7:
						objects.at(-1).image = barriersSprites[randomBarrier - 1]
						objects.at(-1).isLevitate = true
						objects.at(-1).topBarrier = true
						objects.at(-1).sizeCoef = 1.65;
						objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 1.11)
						break;
				}
			}
		}

    for (let i = 0; i < fg.length - 1; i += 2) {
			UpdateBg(i, fg)
		}
    
		

		var isDead = false;

		for (var i = 0; i < objects.length; i++) {
			objects[i].Update();

			if (objects[i].dead) {
				isDead = true;
			}
		}

		if (isDead) {
			objects.shift();
		}

		var hit = false;

		for (var i = 0; i < objects.length; i++) {
			hit = player.Collide(objects[i]);

			if (hit) {
				player.dead = true
			}
		}

		player.Update();

		if (player.dead) {
			numberOfDeaths = Number(numberOfDeaths) + 1;
			localStorage.setItem('deaths', numberOfDeaths)
			gameOver = true
			GameOver()
		}
		speed += 0.001

		Draw();
		Move();
		showScore()
	}
}


function Draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < bg.length; i += 1) {
    bg[i].image.addEventListener("load", 
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
		));
	}
	for (var i = 0; i < objects.length; i++) {
		DrawObject(objects[i])
	}
  for (var i = 0; i < fg.length; i += 1) {
    fg[i].image.addEventListener("load", 
		ctx.drawImage(
			fg[i].image,
			0,
			0,
			fg[i].image.naturalWidth,
			fg[i].image.naturalHeight,
			fg[i].x,
			fg[i].y,
			canvas.height * bgRatio,
			canvas.height
		));
  }
	DrawObject(player)

}
function DrawObject(object) {
	var barrierWidth = (canvas.height / 3)
	var barrierHight = (canvas.height / 3) / (object.image.naturalWidth / object.image.naturalHeight)

	var playerWidth = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);
	var playerHeight = (canvas.height / 4) * (player.image.naturalWidth / player.image.naturalHeight);
  object.image.addEventListener("load", 
	ctx.drawImage
		(
			object.image,
			object.x,
			object.isPlayer ? object.y - jumpHeight : object.y,
			object.isPlayer ? playerWidth : barrierWidth * object.sizeCoef,
			object.isPlayer ? playerHeight : barrierHight * object.sizeCoef,
		))
}


function Resize() {
	canvas.width = wrapperBlock.offsetWidth;
	canvas.height = wrapperBlock.offsetHeight
}


function RandomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}