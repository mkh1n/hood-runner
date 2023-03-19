window.addEventListener("resize", Resize);
Resize();
updateAchives();
updateUpgrades()


function muteMe(audio) {
  if (pageMuted) {
    audio.mute(false);
  } else {
    audio.mute(true);
  }

}

function mutePage() {
  soundBtn.classList.toggle('soundBtnOff');
  if (pageMuted) {
    [].forEach.call(audioArr, function (elem) { muteMe(elem); });
    pageMuted = false
    localStorage.setItem('pageMuted', '')
  } else {
    [].forEach.call(audioArr, function (elem) { muteMe(elem); });
    pageMuted = true
    localStorage.setItem('pageMuted', 'true')
  }
}
function autoMute(){
  soundBtn.classList.toggle('soundBtnOff');
  soundOff()

}

function soundOn() {
    [].forEach.call(audioArr, function (elem) { elem.mute(false); });
}
function soundOff() {
  [].forEach.call(audioArr, function (elem) { elem.mute(true); });
}


highScoreBlock.innerText = highScore;
mainCoinBlock.innerText = myCoins;


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
  constructor(image, x, y, isPlayer) {

    this.x = x;
    this.y = y;
    this.slideing = false;
    this.dead = false;
    this.isPlayer = isPlayer
    this.image = image
    this.speed = speed

    this.isShield = false;
    this.isBooster = false;
    this.randDist = RandomInteger(-speed * 2, speed * 2);
    this.shieldTimer = 0;
    this.shield = false;
    this.boost = false;
    this.boostTimer = 0;

    this.topBarrier = false
    this.levitateCount = 0
    this.sizeCoef = 1;
    this.levitateHeight = 0;
    this.isLevitate = false

  }
  Update() {
    var barrierWidth = (canvas.height / 5) * (this.image.width / this.image.height)

    if (!this.isPlayer) {
      if (this.isLevitate) {
        this.levitateCount += 0.025
        this.levitateHeight = (canvas.height / 50) * Math.sin(Math.PI * this.levitateCount);
        this.y += this.levitateHeight
      }

      if (((!this.topBarrier && this.x < - 1.5 * barrierWidth) || (this.topBarrier && this.x < - 5 * barrierWidth) || this.y < -500) && !this.kicked || 
      (this.kicked && this.x <= -5*canvas.width) || (this.kicked && this.y <= -5*canvas.height)) {
        this.dead = true;
      }
      if (this.kicked) {
        this.x -= this.randDist
        this.y -= speed * 2

      } else {
        this.x -= speed
      }

    }
  }
  Collide(object) {
    var playerWidth = (canvas.height / 5) * (player.image.naturalWidth / player.image.naturalHeight);
var playerHeight = (canvas.height / 5) * (player.image.naturalWidth / player.image.naturalHeight);
    var barrierWidth = (canvas.height / 3.5)
    var barrierHight = (canvas.height / 3.5) / (object.image.naturalWidth / object.image.naturalHeight)
    var hit = false;

    if (object.topBarrier) {
      if (this.x + playerWidth / 2.5 > object.x && this.x < object.x + barrierWidth * object.sizeCoef / 1.2) {
        if (this.y - jumpHeight + playerHeight / 1.2 > object.y) {
          var actualPlayerHigh = this.slideing ? this.y + playerHeight / 2.2 : this.y
          if (actualPlayerHigh * 1.1 - jumpHeight < object.y + barrierHight * object.sizeCoef) {
            if (player.shield) {
              object.kicked = true;
            } else {
              hit = true;
            }
          }
        }

      }
    } else {
      if (this.x + playerWidth / 1.5 > object.x && this.x < object.x + barrierWidth / 1.5) {
        if (this.y - jumpHeight + playerHeight > object.y * 1.1 && this.y - jumpHeight < object.y + barrierHight * object.sizeCoef) {
          if (player.shield) {
            if (object.isCoin) {
              
              if(!object.kicked){
                coins += 1;
              }
              object.kicked = true;              
            }else{
              object.kicked = true;

            }
          } else {
            if (object.isShield) {
              player.shield = true;
              activeTime = shieldLevel * 82;

              object.image = new Image
            }
            if (object.isBooster) {
              player.boost = true;
              activeTime = boosterLevel * 82;
              object.image = new Image
            }
            if (object.isCoin) {
              if(!object.kicked){
                coins += 1;
              }
              object.kicked = true;
              console.log(coins)
              
            }
            if (!object.isBooster && !object.isShield && !object.isCoin)
              hit = true;
          }
        }
      }
    }
    return hit;
  }
}



var player = new GameObject(runSprites[0], 0.2 * canvas.width, canvas.height - (wrapperBlock.offsetHeight / 2.5), true)


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
    jumpCount += speed / (canvas.height / 75);
    jumpHeight = (canvas.height / 125) * jumpLength * Math.sin(Math.PI * jumpCount / jumpLength);

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

const bg = [
  new Bg(bgSprites[0], 0, 0.1),
  new Bg(bgSprites[0], canvas.height * bgRatio, 0.1),

  new Bg(bgSprites[1], 0, 0.15),
  new Bg(bgSprites[1], canvas.height * bgRatio, 0.15),

  new Bg(bgSprites[2], 0, 0.25),
  new Bg(bgSprites[2], canvas.height * bgRatio, 0.25),

  new Bg(bgSprites[3], 0, 0.3),
  new Bg(bgSprites[3], canvas.height * bgRatio, 0.3),

  new Bg(bgSprites[7], 0, 0.4),
  new Bg(bgSprites[7], canvas.height * bgRatio, 0.4),

  new Bg(bgSprites[4], 0, 0.6),
  new Bg(bgSprites[4], canvas.height * bgRatio, 0.6),

  new Bg(bgSprites[5], 0, 1),
  new Bg(bgSprites[5], canvas.height * bgRatio, 1),

  new Bg(bgSprites[6], 0, 1.2),
  new Bg(bgSprites[6], canvas.height * bgRatio, 1.2)
]

const fg = [
  new Bg(fgSprites[0], 0, 0.3),
  new Bg(fgSprites[0], canvas.height * bgRatio, 0.3),
  new Bg(fgSprites[1], 0, 1),
  new Bg(fgSprites[1], canvas.height * bgRatio, 1)

]

const CollectObjects = [
  new GameObject(CollectSprites[0], 0, 0, false)
]

function jumpBegin() {
  if (!player.slideing) {
    clearInterval(playerAnimate)
    playerAnimate = setInterval(() => {
      animate(player, jumpSprites)
    }, 100 + score / 10)
    jumping = true;
  }
}
function slideBegin() {
  if (!jumping) {
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

function slideEnd() {
  if (!jumping) {
    player.slideing = false;
    clearInterval(playerAnimate)
    slideing = 0
    player.image = slideSprites[1]
    setTimeout(() => {
      player.image = slideSprites[0]
    }, 20)
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
function updateAchives() {
  const achives = {
    0: highScore >= 100,
    1: highScore >= 300,
    2: highScore >= 500,
    3: highScore >= 700,
    4: highScore >= 1000,
    5: numberOfDeaths >= 8,
    6: numberOfDeaths >= 27,
    7: numberOfDeaths >= 42,
    8: numberOfDeaths >= 100,
    9: numberOfJumps >= 500,
    10: numberOfslides >= 300,
    11: shieldLevel >= 4,
    12: boosterLevel >= 4,
    13: myCoins >= 1000
  }
  var unlockCount = 0
  for (var i = 0; i < achivesBlocks.length - 1; i += 1) {
    if (achives[i]) {
      achivesBlocks[i].classList.remove("lock")
      unlockCount += 1
    }
  }
  if (unlockCount == achivesBlocks.length - 1) {
    achivesBlocks[achivesBlocks.length - 1].classList.remove('lock')
  }
  document.getElementById('numberOfJumpsBlock').innerHTML = 'Jumps: ' + numberOfJumps
  document.getElementById('numberOfDeathsBlock').innerHTML = 'Deaths: ' + numberOfDeaths
  document.getElementById('numberOfslidesBlock').innerHTML = 'Slides: ' + numberOfslides

}

function updateUpgrades(){
  for (let i = 0; i < shieldLevel; i+=1){
    shieldLevels[i].classList.add('activeLevel')
  }
  for (let i = 0; i < boosterLevel; i+=1){
    boosterLevels[i].classList.add('activeLevel')
  }
  if (shieldLevel < 4){
    shieldCost.innerHTML = shieldLevel * 150;
  }else{
    shieldCost.innerHTML = 'MAX'
    document.getElementsByClassName('upgradeCoinImg')[0].classList.add('hide')

  }
  if (boosterLevel < 4){
    boosterCost.innerHTML = boosterLevel * 150;
  }else{
    boosterCost.innerHTML = 'MAX'
    document.getElementsByClassName('upgradeCoinImg')[1].classList.add('hide')
  }
}
//localStorage.clear()
//localStorage.setItem('myCoins', 10000);
function payForLife(){
  if (+myCoins >= 100){
    myCoins = +myCoins - 100;
    localStorage.setItem('myCoins', myCoins);
    coinSound.play()
    saveMe()
  }else{
    notEnough.play()
  }
}
function Upgrade(boost){
  if (boost == 'shield'){
    if (+shieldCost.innerText <= +myCoins && +shieldLevel < 4){
      myCoins = +myCoins - +shieldCost.innerText;
      shieldLevel = +shieldLevel + 1
      localStorage.setItem('shieldLevel', shieldLevel);
      localStorage.setItem('myCoins', myCoins);
      storeCoinsText.innerText = +myCoins;
      mainCoinBlock.innerText = localStorage.getItem('myCoins');
      coinSound.play()
      updateUpgrades()
    }else{
      notEnough.play()
    }
  }else{
    if (+boosterCost.innerText <= +myCoins && +boosterLevel < 4){
      myCoins = +myCoins - +boosterCost.innerText;
      boosterLevel = +boosterLevel + 1
      localStorage.setItem('boosterLevel', boosterLevel);
      localStorage.setItem('myCoins', myCoins);
      storeCoinsText.innerText = +myCoins;
      mainCoinBlock.innerText = localStorage.getItem('myCoins');
      coinSound.play()
      updateUpgrades()
    }else{
      notEnough.play()
    }
  }
}

function PlayButtonActivate() {
  ResetGlobalVariables()
  
  document.addEventListener("keydown", keyRightHandler, false);
  document.addEventListener("keyup", keyLeftHandler, false);
  toggleHide(mainMenuBlock)
  toggleHide(pauseButton)
  toggleHide(scoreBlock)
  toggleHide(coinsBlock)
  saveMeBlock.classList.remove('hide')

  controlBlock.style.opacity = 1;
  setTimeout(() => controlBlock.style.opacity = 0, 2000)
  Start()
}

function PauseToggle() {
  stopGame ? Start() : Stop()
  pause = pauseBlock.classList.contains('hide') ? true : false
  toggleHide(pauseBlock)
  toggleHide(scoreBlock)
  toggleHide(coinsBlock)
  toggleHide(pauseButton)
}
function ResetGlobalVariables() {
  objects = [];
  coins = 0;
  player.x = 0.2 * canvas.width;
  gameOver = false;
  pause = false;
  player.rise = false
  player.shield = false;
  player.boostTimer = 0;
  player.boost = false;
  player.dead = false;
  speed = canvas.clientWidth / 115;
  player.y = canvas.height - (wrapperBlock.offsetHeight / 2.5)
  score = 0;
  leftPressed = false;
  rightPressed = false;
  document.removeEventListener("keydown", keyRightHandler, false);
  document.removeEventListener("keyup", keyLeftHandler, false);


}
function GameOver() {
  player.shieldTimer = 0;
  player.boostTimer = 0;
  bgMusic.pause();
  bgMusic.currentTime = 0;
  Stop()
  gameOverSound.play()
  setTimeout(() => {
    player.image = deathSprites[0];
    Draw()
    setTimeout(() => {
      player.image = deathSprites[1]
      Draw()
      setTimeout(() => {
        player.image = deathSprites[2]
        Draw()
        setTimeout(() => {
          player.image = deathSprites[3]
          Draw()
          setTimeout(() => {
            GameOverScoreBlock.innerText = 'Score: ' + score.toFixed(0)
            toggleHide(scoreBlock)
            toggleHide(coinsBlock)
            toggleHide(pauseButton)
            toggleHide(gameOverBlock)
            gameOverCoinsBlock.innerText = Number(localStorage.getItem('myCoins')) + Number(coins);
            player.dead = false;
            showFullAdd()
            if (score > highScore) {
              HIandRecord.innerHTML = 'new record!'
              highScore = Number(score.toFixed(0));
              localStorage.setItem('HI', score.toFixed(0))
            } else {
              HIandRecord.innerText = 'HighScore: ' + highScore;
            }
            if (player.rise){
              saveMeBlock.classList.add('hide')
            }
            updateAchives();
          }, 80)
        }, 50)
      }, 50)
    }, 50)

  }, 50)



}

function Replay() {
  if (gameOver) {
    localStorage.setItem('myCoins', Number(localStorage.getItem('myCoins')) + Number(coins))
    mainCoinBlock.innerText = localStorage.getItem('myCoins');
    bgMusic.play()
    toggleHide(gameOverBlock)
    toggleHide(pauseButton)
    toggleHide(scoreBlock)
    toggleHide(coinsBlock)
    saveMeBlock.classList.remove('hide')


  }
  if (pause) {
    toggleHide(pauseBlock)
    toggleHide(pauseButton)
    toggleHide(scoreBlock)
    toggleHide(coinsBlock)

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
    localStorage.setItem('myCoins', Number(localStorage.getItem('myCoins')) + Number(coins))
    mainCoinBlock.innerText = localStorage.getItem('myCoins');
    toggleHide(gameOverBlock)
    
  }
  
  bgMusic.pause();
  bgMusic.currentTime = 0;
  highScoreBlock.innerText = highScore;
  ResetGlobalVariables();
  updateAchives()
  updateUpgrades()
  toggleHide(mainMenuBlock)
}
function UpdateBg(index, arr = bg) {
  arr[index].Update(arr[index + 1])
  arr[index + 1].Update(arr[index])
}

function showScoreAndCoins() {
  score += 0.12
  scoreBlock.innerText = '0'.repeat(4 - String(score.toFixed(0).length)) + String(score.toFixed(0));
  coinsText.innerText = '0'.repeat(3 - String(coins).length) + coins
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
function pushRandomCoin(pos, newCoin = true) {
  let x;
  let y;
  if (RandomInteger(1, 4) >= 2) {
    if (RandomInteger(0, 1) == 1){
      x = 4 * canvas.width / 3;
      y = pos == 'top' ? canvas.height - (wrapperBlock.offsetHeight / 1.4) : canvas.height - (wrapperBlock.offsetHeight / 3.1)

    }else{
      x = 4 * canvas.width / 2;
      y = canvas.height - (wrapperBlock.offsetHeight / 3.1);
    }
    if (newCoin){
      objects.push(new GameObject(barriersSprites[0], x , y, false));
    }
    objects.at(-1).image = CollectSprites[3]
    objects.at(-1).isCoin = true;
    objects.at(-1).sizeCoef = 0.3;
  }
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

    if (RandomInteger(0, speed * 1.1) > speed) {
      if (objects.length == 0 || objects.at(-1).x < canvas.width - 100) {
        objects.push(new GameObject(barriersSprites[0], 4 * canvas.width / 3.1, canvas.height - (wrapperBlock.offsetHeight / 2.7), false));
        var randomBarrier = RandomInteger(1, 8)
        switch (randomBarrier) {
          case 1:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            pushRandomCoin('top')
            break;
          case 2:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            pushRandomCoin('top')
            break;
          case 3:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            pushRandomCoin('top')
            break;
          case 4:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 2.35)
            pushRandomCoin('top')
            break;
          case 5:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            objects.at(-1).topBarrier = true
            objects.at(-1).y = canvas.height - (canvas.height / 2.58) / (objects.at(-1).image.naturalWidth / objects.at(-1).image.naturalHeight);
            pushRandomCoin('bottom')
            break;
          case 6:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            pushRandomCoin('top')
            break;
          case 7:
            objects.at(-1).image = barriersSprites[randomBarrier - 1]
            objects.at(-1).isLevitate = true
            objects.at(-1).topBarrier = true
            objects.at(-1).sizeCoef = 1.7;
            objects.at(-1).y = canvas.height - (wrapperBlock.offsetHeight / 1.11)
            pushRandomCoin('bottom')
            break;
          case 8:
            if (!objects.at(-1).isBooster && !player.boost && !objects.at(-1).isShield && !player.shield) {
              if (RandomInteger(0, 100) > 70) {
                objects.at(-1).image = CollectSprites[1]
                objects.at(-1).isShield = true
                objects.at(-1).sizeCoef = 0.5;
                objects.at(-1).y = (RandomInteger(0, 1) == 1) ? canvas.height - (wrapperBlock.offsetHeight / 2.5) : canvas.height - (wrapperBlock.offsetHeight / 1.3)
              }
              if (RandomInteger(0, 100) > 70) {
                objects.at(-1).image = CollectSprites[2]
                objects.at(-1).isBooster = true
                objects.at(-1).sizeCoef = 0.5;
                objects.at(-1).y = (RandomInteger(0, 1) == 1) ? canvas.height - (wrapperBlock.offsetHeight / 2.5) : canvas.height - (wrapperBlock.offsetHeight / 1.3)
              }
              break;
            }
        }
      }
    }


    for (let i = 0; i < fg.length - 1; i += 2) {
      UpdateBg(i, fg)
    }



    var isDead = false;

    for (var i = 0; i < objects.length; i++) {
      objects[i].Update(i);

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
    showScoreAndCoins()
  }
}


function Draw() {
  ctx.imageSmoothingQuality = 'high'
  ctx.imageSmoothingEnabled = true
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
  ctx.imageSmoothingEnabled = false
  DrawObject(player)
  if (player.boost) {
    if (player.boostTimer == 0) {
      clearInterval(playerAnimate)
      playerAnimate = setInterval(() => {
        animate(player, runSprites)
      }, 30)
      player.boostTimer += 1
      player.shield = true;
      normalSpeed = speed
      speed = speed * 5
    }
  }
  for (var i = 0; i < (player.boost ? fg.length : fg.length - 2); i += 1) {
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



  if (player.shield) {
    CollectObjects[0].x = player.x;
    CollectObjects[0].y = player.y - jumpHeight
    player.shieldTimer += 1
    if (player.boost) {
      score += 0.12
    }
    if (player.shieldTimer == activeTime) {
      setTimeout(() => {
        CollectObjects[0].image = new Image()
        DrawObject(CollectObjects[0])
        if (player.boost) {
          clearInterval(playerAnimate)
          playerAnimate = setInterval(() => {
            animate(player, runSprites)
          }, 75)
          player.boost = false;
          speed = normalSpeed
          player.boostTimer = 0;

        }
        setTimeout(() => {
          CollectObjects[0].image = CollectSprites[0]
          DrawObject(CollectObjects[0])
          setTimeout(() => {
            CollectObjects[0].image = new Image()
            DrawObject(CollectObjects[0])
            setTimeout(() => {
              CollectObjects[0].image = CollectSprites[0]
              DrawObject(CollectObjects[0])
              setTimeout(() => {
                CollectObjects[0].image = new Image()
                DrawObject(CollectObjects[0])
                setTimeout(() => {
                  CollectObjects[0].image = CollectSprites[0]
                  DrawObject(CollectObjects[0])
                  setTimeout(() => {
                    CollectObjects[0].image = new Image()
                    DrawObject(CollectObjects[0])
                    setTimeout(() => {
                      CollectObjects[0].image = CollectSprites[0]
                      DrawObject(CollectObjects[0])
                      setTimeout(() => {
                        CollectObjects[0].image = new Image()
                        DrawObject(CollectObjects[0])
                        setTimeout(() => {
                          CollectObjects[0].image = CollectSprites[0]
                          DrawObject(CollectObjects[0])
                          setTimeout(() => {
                            CollectObjects[0].image = new Image()
                            DrawObject(CollectObjects[0])
                            setTimeout(() => {
                              CollectObjects[0].image = CollectSprites[0]
                              DrawObject(CollectObjects[0])
                              player.shield = false;
                              player.shieldTimer = 0;
                              setTimeout(() => {
                                CollectObjects[0].image = new Image()
                                DrawObject(CollectObjects[0])
                                setTimeout(() => {
                                  CollectObjects[0].image = CollectSprites[0]
                                  DrawObject(CollectObjects[0])
                                  setTimeout(() => {
                                    CollectObjects[0].image = new Image()
                                    DrawObject(CollectObjects[0])
                                    setTimeout(() => {
                                      CollectObjects[0].image = CollectSprites[0]
                                      DrawObject(CollectObjects[0])
                                      setTimeout(() => {
                                        CollectObjects[0].image = new Image()
                                        DrawObject(CollectObjects[0])
                                        setTimeout(() => {
                                          CollectObjects[0].image = CollectSprites[0]
                                          DrawObject(CollectObjects[0])
                                          setTimeout(() => {
                                            CollectObjects[0].image = new Image()
                                            DrawObject(CollectObjects[0])
                                            setTimeout(() => {
                                              CollectObjects[0].image = CollectSprites[0]
                                              DrawObject(CollectObjects[0])
                                              setTimeout(() => {
                                                CollectObjects[0].image = new Image()
                                                DrawObject(CollectObjects[0])
                                                setTimeout(() => {
                                                  CollectObjects[0].image = CollectSprites[0]
                                                  DrawObject(CollectObjects[0])
                                                  setTimeout(() => {
                                                    CollectObjects[0].image = new Image()
                                                    DrawObject(CollectObjects[0])
                                                    setTimeout(() => {
                                                      CollectObjects[0].image = CollectSprites[0]
                                                      DrawObject(CollectObjects[0])
                                                      setTimeout(() => {
                                                        CollectObjects[0].image = new Image()
                                                        DrawObject(CollectObjects[0])
                                                        setTimeout(() => {
                                                          CollectObjects[0].image = CollectSprites[0]
                                                          DrawObject(CollectObjects[0])
                                                          setTimeout(() => {
                                                            CollectObjects[0].image = new Image()
                                                            DrawObject(CollectObjects[0])
                                                            setTimeout(() => {
                                                              CollectObjects[0].image = CollectSprites[0]
                                                              DrawObject(CollectObjects[0])
                                                              setTimeout(() => {
                                                                CollectObjects[0].image = new Image()
                                                                DrawObject(CollectObjects[0])
                                                                setTimeout(() => {
                                                                  CollectObjects[0].image = CollectSprites[0]
                                                                  DrawObject(CollectObjects[0])
                                                                  setTimeout(() => {
                                                                    CollectObjects[0].image = new Image()
                                                                    DrawObject(CollectObjects[0])
                                                                    setTimeout(() => {
                                                                      CollectObjects[0].image = CollectSprites[0]
                                                                      DrawObject(CollectObjects[0])
                                                                      setTimeout(() => {
                                                                        CollectObjects[0].image = new Image()
                                                                        DrawObject(CollectObjects[0])
                                                                        setTimeout(() => {
                                                                          CollectObjects[0].image = CollectSprites[0]
                                                                          DrawObject(CollectObjects[0])
                                                                          setTimeout(() => {
                                                                            CollectObjects[0].image = new Image()
                                                                            DrawObject(CollectObjects[0])
                                                                            setTimeout(() => {
                                                                              CollectObjects[0].image = CollectSprites[0]
                                                                              DrawObject(CollectObjects[0])
                                                                              setTimeout(() => {
                                                                                CollectObjects[0].image = new Image()
                                                                                DrawObject(CollectObjects[0])
                                                                                setTimeout(() => {
                                                                                  CollectObjects[0].image = CollectSprites[0]
                                                                                  DrawObject(CollectObjects[0])
                                                                                  setTimeout(() => {
                                                                                    CollectObjects[0].image = new Image()
                                                                                    DrawObject(CollectObjects[0])
                                                                                    setTimeout(() => {
                                                                                      CollectObjects[0].image = CollectSprites[0]
                                                                                      DrawObject(CollectObjects[0])
                                                                                      player.shield = false;
                                                                                      player.shieldTimer = 0;
                                                                                    }, 50)
                                                                                  }, 50)
                                                                                }, 50)
                                                                              }, 50)
                                                                            }, 50)
                                                                          }, 50)
                                                                        }, 50)
                                                                      }, 50)
                                                                    }, 50)
                                                                  }, 50)
                                                                }, 50)
                                                              }, 50)
                                                            }, 50)
                                                          }, 50)
                                                        }, 50)
                                                      }, 50)
                                                    }, 50)
                                                  }, 50)
                                                }, 50)
                                              }, 50)
                                            }, 50)
                                          }, 50)
                                        }, 50)
                                      }, 50)
                                    }, 50)
                                  }, 50)
                                }, 50)
                              }, 50)
                            }, 50)
                          }, 50)
                        }, 50)
                      }, 50)
                    }, 50)
                  }, 50)
                }, 50)
              }, 50)
            }, 50)
          }, 50)
        }, 50)
      }, 50)
    } else {
      DrawObject(CollectObjects[0])
    }
  }

}
function DrawObject(object) {
  var playerWidth = (canvas.height / 5) * (player.image.naturalWidth / player.image.naturalHeight);
  var playerHeight = (canvas.height / 5) * (player.image.naturalWidth / player.image.naturalHeight);
  var barrierWidth = (canvas.height / 3.5)
  var barrierHight = (canvas.height / 3.5) / (object.image.naturalWidth / object.image.naturalHeight)
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

window.onfocus = function()
{
  if (!pageMuted){
    soundOn()
  }
}
window.onblur = function()
{
  soundOff()
} 



