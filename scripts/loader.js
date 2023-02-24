var loader = new PxLoader();

var highScore;
localStorage.getItem('HI') > 0 ? highScore = localStorage.getItem('HI') : highScore = 0;

var numberOfJumps;
localStorage.getItem('jumps') > 0 ? numberOfJumps = localStorage.getItem('jumps') : numberOfJumps = 0;

var numberOfDeaths;
localStorage.getItem('deaths') > 0 ? numberOfDeaths = localStorage.getItem('deaths') : numberOfDeaths = 0;

var numberOfslides;
localStorage.getItem('slides') > 0 ? numberOfslides = localStorage.getItem('slides') : numberOfslides = 0;

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
for (let i = 1; i < 8; i += 1) {
	bgSprites.push(loader.addImage('assets/bg/' + i + '.png'));
}
const fgSprites = [];
for (let i = 1; i < 2; i += 1) {
	fgSprites.push(loader.addImage('assets/fg/' + i + '.png'));
}
const CollectSprites  = [];
CollectSprites.push(loader.addImage('assets/sprites/collect/shield.png'))
CollectSprites.push(loader.addImage('assets/sprites/collect/shieldIcon.png'))
CollectSprites.push(loader.addImage('assets/sprites/collect/boosterIcon.png'))




var jumpSound = new Audio();
jumpSound.src ='assets/audio/jump.wav';

var slideSound = new Audio();
slideSound.src = 'assets/audio/slide.mp3';

var clickSound = new Audio();
clickSound.src = 'assets/audio/click.mp3';

var gameOverSound = new Audio();
gameOverSound.src = 'assets/audio/gameOver.wav'

var bgMusic = new Audio();
bgMusic.src = 'assets/audio/bgMusic.mp3';
	bgMusic.volume = 0.3
	bgMusic.loop = true;

const audioArr = [jumpSound, slideSound, clickSound, gameOverSound, bgMusic]

function play(audio){
	audio.play()
}
loader.start();
function begin() {
  
}
loader.addCompletionListener(() => {
  window.addEventListener('load', function () {
    if (( 'ontouchstart' in window ) ||
    ( navigator.maxTouchPoints > 0 ) ||
    ( navigator.msMaxTouchPoints > 0 )){
      rightButtonsBlock.classList.remove('hide')
      leftButtonsBlock.classList.remove('hide')
    }

    toggleHide(mainMenuBlock)
    toggleHide(loaderBlock)
    toggleHide(controlBlock)
    bgRatio = bgSprites[0].naturalWidth / bgSprites[0].naturalHeight;
  })
})