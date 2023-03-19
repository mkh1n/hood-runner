let ysdk;


function showFullAdd() {
  ysdk.adv.showFullscreenAdv({
    callbacks: {
      onClose: function (wasShown) {
        // some action after close
      },
      onError: function (error) {
        // some action on error
      }
    }
  })
}

function showRevawardVideo(getReward) {
  ysdk.adv.showRewardedVideo({
    callbacks: {
      onOpen: () => {
        
      },
      onRewarded: () => {
        
      },
      onClose: () => {
        getReward()
      },
      onError: (e) => {
        console.log('Error while open video ad:', e);
      }
    }
  })
}

const addCoins = () => {
  myCoins = Number(myCoins) + 100;
  localStorage.setItem('myCoins', myCoins)
  storeCoinsText.innerText = Number(myCoins);
  mainCoinBlock.innerText = Number(myCoins);

  coinSound.play()
}

const saveMe = () => {
  player.rise = true;
  gameOver = false;
  stopGame = false;
  player.dead = false;
  toggleHide(gameOverBlock)
  toggleHide(pauseButton)
  toggleHide(scoreBlock)
  toggleHide(coinsBlock)
  player.shield = true
  activeTime = 1;
  Start();
  canvas.focus()
  bgMusic.play()
}

function gameInit() {
  YaGames
    .init()
    .then(_sdk => {
      ysdk = _sdk;
      ysdk.features.LoadingAPI?.ready(); // Показываем SDK, что игра загрузилась и можно начинать играть
    })
    .catch(console.error)
}