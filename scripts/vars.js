var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var wrapperBlock = document.getElementsByClassName("wrapper")[0];
var creditsBlock = document.getElementsByClassName("credits")[0];
var achivesBlock = document.getElementsByClassName("achives")[0];
var pauseBlock = document.getElementsByClassName("pause")[0];
var pauseButton = document.getElementsByClassName("pauseButton")[0];
var gameOverBlock = document.getElementsByClassName("gameOver")[0];
var mainMenuBlock = document.getElementsByClassName("mainMenu")[0];
var controlBlock = document.getElementsByClassName("controlBlock")[0];
var scoreBlock = document.getElementsByClassName("score")[0];
var overlay = document.getElementsByClassName("overlay")[0];
var highScoreBlock = document.getElementsByClassName("HighScoreBlock")[0];
var GameOverScoreBlock = document.getElementsByClassName("score")[1];
var HIandRecord = document.getElementsByClassName("HIandRecord")[0];
var soundBtn = document.getElementsByClassName("soundBtn")[0];
var achivesBlocks = document.getElementsByClassName("achiveBlock")
var rightButtonsBlock = document.getElementsByClassName('rightButtonsBlock')[0]
var leftButtonsBlock = document.getElementsByClassName('leftButtonsBlock')[0]
var loaderBlock = document.getElementsByClassName('loader')[0]



var speed;
var bgRatio;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var slideing = 0;
var jumping = false;
var jumpCount = 0;
var jumpLength = 50;
var jumpHeight = 0;
var overIndex = 1;
var fpsInterval, startTime, now, then, elapsed;
var frameCount = 0;
var frameNumber = 1;
var pageMuted = false
var stopGame = false;
var score = 0;
var pause = false
var gameOver = false

const toggleHide = (block) => block.classList.toggle('hide')