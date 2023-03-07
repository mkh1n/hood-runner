var loader = new PxLoader();

var highScore;
localStorage.getItem('HI') > 0 ? highScore = localStorage.getItem('HI') : highScore = 0;

var myCoins;
localStorage.getItem('myCoins') > 0 ? myCoins = localStorage.getItem('myCoins') : myCoins = 0;

var numberOfJumps;
localStorage.getItem('jumps') > 0 ? numberOfJumps = localStorage.getItem('jumps') : numberOfJumps = 0;

var numberOfDeaths;
localStorage.getItem('deaths') > 0 ? numberOfDeaths = localStorage.getItem('deaths') : numberOfDeaths = 0;

var numberOfslides;
localStorage.getItem('slides') > 0 ? numberOfslides = localStorage.getItem('slides') : numberOfslides = 0;

var shieldLevel;
localStorage.getItem('shieldLevel') > 1 ? shieldLevel = localStorage.getItem('shieldLevel') : shieldLevel = 1;

var boosterLevel;
localStorage.getItem('boosterLevel') > 1 ? boosterLevel = localStorage.getItem('boosterLevel') : boosterLevel = 1;

var pageMuted;
if (typeof localStorage.getItem('pageMuted') === 'undefined' || localStorage.getItem('pageMuted') === null){
  localStorage.setItem('pageMuted', '')
  pageMuted = false
} else{
  pageMuted = Boolean(localStorage.getItem('pageMuted'))
}
const runSprites = [];
for (let i = 1; i < 9; i += 1) {
	runSprites.push(loader.addImage('assets/sprites/run/' + i + '.png'));
}
const slideSprites = [];
for (let i = 1; i < 7; i += 1) {
	slideSprites.push(loader.addImage('assets/sprites/slide/' + i + '.png'));
}
const jumpSprites = [];
for (let i = 1; i < 7; i += 1) {
	jumpSprites.push(loader.addImage('assets/sprites/jump/' + i + '.png'));
}
const deathSprites = [];
for (let i = 1; i < 5; i += 1) {
	deathSprites.push(loader.addImage('assets/sprites/death/' + i + '.png'));
}
const barriersSprites = [];
for (let i = 1; i < 8; i += 1) {
	barriersSprites.push(loader.addImage('assets/sprites/barriers/' + i + '.png'));
}
const bgSprites = [];
for (let i = 1; i < 9; i += 1) {
	bgSprites.push(loader.addImage('assets/bg/' + i + '.png'));
}
const fgSprites = [];
for (let i = 1; i < 3; i += 1) {
	fgSprites.push(loader.addImage('assets/fg/' + i + '.png'));
}
const CollectSprites  = [];
CollectSprites.push(loader.addImage('assets/sprites/collect/shield.png'));
CollectSprites.push(loader.addImage('assets/sprites/collect/shieldIcon.png'));
CollectSprites.push(loader.addImage('assets/sprites/collect/boosterIcon.png'));
CollectSprites.push(loader.addImage('assets/sprites/collect/coin.png'))

var clickSound = new Audio();
clickSound.src = 'assets/audio/click.mp3';
clickSound.volume = 0.4

var gameOverSound = new Audio();
gameOverSound.src = 'assets/audio/gameOver.wav'

var storeSound = new Audio();
storeSound.src = 'assets/audio/store.mp3'
storeSound.volume = 0.1

var coinSound = new Audio();
coinSound.src = 'assets/audio/coin.mp3'
coinSound.volume = 0.6

var notEnough = new Audio();
notEnough.src = 'assets/audio/notEnough.mp3'
notEnough.volume = 0.6


var bgMusic = new Audio();
bgMusic.src = 'assets/audio/bgMusic.mp3';
bgMusic.volume = 0.05
bgMusic.loop = true;

const audioArr = [clickSound, gameOverSound, bgMusic, coinSound, storeSound, notEnough]

function play(audio){
	audio.play()
}
loader.start();

if ('mediaSession' in navigator) {
}
loader.addCompletionListener(() => {
  window.addEventListener('load', function () {
    navigator.mediaSession.metadata = new MediaMetadata({});
    var aud = new Audio("assets/audio/silence.mp3");
    aud.loop = true;
    aud.play()

    if (pageMuted){
      autoMute()
    }
    if (( 'ontouchstart' in window ) ||
    ( navigator.maxTouchPoints > 0 ) ||
    ( navigator.msMaxTouchPoints > 0 )){
      rightButtonsBlock.classList.remove('hide')
      leftButtonsBlock.classList.remove('hide')
    }
    for (var i; i < mainBgBlocks.length; i += 1){
      mainBgBlocks[i].style.backgroundImage = 'stuff/bg.png'
    }
    for (var i; i < smallBtnBlocks.length; i += 1){
      smallBtnBlocks[i].style.backgroundImage = 'stuff/bg.png'
    }    toggleHide(mainMenuBlock)
    toggleHide(loaderBlock)
    toggleHide(controlBlock)
    bgRatio = bgSprites[0].naturalWidth / bgSprites[0].naturalHeight;
    gameInit()
  }) 
})