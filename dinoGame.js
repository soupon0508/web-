const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imageNames = ['bird', 'cactus', 'dino'];

const jumpAudio = new Audio('audio/ニュッ2.mp3')

const gameBGM = new Audio('audio/情動カタルシス.mp3')

let howManyTime = 0;


// グローバルな game オブジェクト
const game = {
  counter: 0,
  enemys: [],
  ground: [],
  enemyCountdown: 0,
  image: {},
  isGameOver: true,
  score: 0,
  timer: null,
};

// 複数画像読み込み
let imageLoadCounter = 0;
for (const imageName of imageNames) {
  const imagePath = `image/${imageName}.png`;
  game.image[imageName] = new Image();
  game.image[imageName].src = imagePath;
  game.image[imageName].onload = () => {
    imageLoadCounter += 1;
    if (imageLoadCounter === imageNames.length) {
      console.log('画像のアップロードが完了しました。');

      ctx.fillStyle = 'black';
      ctx.font = 'bold 100px serif';
      ctx.fillText(`Press Enter`, 150, 200);

    }
  }
}

function init() {
  game.counter = 0;
  game.enemys = [];
  game.ground = [];
  game.enemyCountdown = 0;
  game.isGameOver = false;
  game.score = 0;
  createDino();
  game.timer = setInterval(ticker, 30);
}

function ticker() {
  // 画面クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (game.counter % 10 === 0) {
    createGround();
  }

  /*
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - 5, canvas.width, 20);
*/

  // 敵キャラの作成
  createEnemys();

  //キャラクタの移動
  moveDino();// 恐竜の移動
  moveEnemys();// 敵キャラの移動
  moveGround();

// 描画
  drawGround();
  drawDino();// 恐竜の描画
  drawEnemys();// 敵キャラの描画
  drawScore();
  // あたり判定
  hitCheck();

  // カウンタの更新
  game.score += 1;
  game.counter = (game.counter + 1) % 1000000;
  game.enemyCountdown -= 1;
}

function startCuctusEnemyCountdown() {
  game.CuctusEnemyCountdown = 0;
}

function startBirdEnemyCountdown() {
  game.BirdEnemyCountdown = 0;
}

function createDino() {
  game.dino = {
    x: game.image.dino.width / 2,
    y: canvas.height - game.image.dino.height / 2,
    moveY: 0,
    width: game.image.dino.width,
    height: game.image.dino.height,
    image: game.image.dino,
  }
}

function createCactus(createX) {
  game.enemys.push({
    x: createX,
    y: canvas.height - game.image.cactus.height / 2,
    width: game.image.cactus.width,
    height: game.image.cactus.height,
    moveX: -10,
    image: game.image.cactus,
  });
}

function createBird() {
  const birdY = Math.random() * (300 - game.image.bird.height) + 150;
  game.enemys.push({
    x: canvas.width + game.image.bird.width / 2,
    y: birdY,
    width: game.image.bird.width,
    height: game.image.bird.height,
    moveX: -15,
    image: game.image.bird,
  });
}

function createEnemys() {
  if (game.enemyCountdown === 0) {
    game.enemyCountdown = 60 - Math.floor(game.score / 100);
    if (game.enemyCountdown <= 30) game.enemyCountdown = 30;
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        createCactus(canvas.width + game.image.cactus.width / 2);
        break;
      case 1:
        createCactus(canvas.width + game.image.cactus.width / 2);
        createCactus(canvas.width + game.image.cactus.width * 3 / 2);
        break;
      case 2:
        createBird();
        break;
    }
  }
}

function createGround() {
  game.ground = [];
  for (let i = 0; i <= canvas.width; i += 200) {
    game.ground.push({
      x: i,
      y: canvas.height,
      width: 200,
      moveX: -20,
    });
  }
}

function moveDino() {
  game.dino.y += game.dino.moveY;
  if (game.dino.y >= canvas.height - game.dino.height / 2) {
    game.dino.y = canvas.height - game.dino.height / 2;
    game.dino.moveY = 0;
  } else {
    game.dino.moveY += 3;
  }
}

function moveEnemys() {
  for (const enemy of game.enemys) {
    enemy.x += enemy.moveX;
  }
  // 画面外に出たキャラを配列から削除
  game.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
}

function moveGround() {
  for (const ground of game.ground) {
    ground.x += ground.moveX;
  }
}

function drawDino() {
  ctx.drawImage(
    game.image.dino,
    game.dino.x - game.dino.width / 2,
    game.dino.y - game.dino.height / 2,
  );
}

function drawEnemys() {
  for (const enemy of game.enemys) {
    ctx.drawImage(
      enemy.image,
      enemy.x - enemy.width / 2,
      enemy.y - enemy.height / 2,
    );
  }
}

function drawGround() {
  ctx.fillStyle = 'sienna'
  for (const ground of game.ground) {
    ctx.fillRect(ground.x, ground.y - 5, ground.width, 5);
    ctx.fillRect(ground.x + 20, ground.y -10, ground.width - 40, 5);
    ctx.fillRect(ground.x + 50, ground.y - 15, ground.width - 100, 5);
  }
}

function drawScore() {
  ctx.fillStyle = 'black'
  ctx.font = '24px serif';
  ctx.fillText(`score: ${game.score}`, 0, 30)
}

function hitCheck() {
  for (const enemy of game.enemys) {
    if (
      Math.abs(game.dino.x - enemy.x) < game.dino.width * 0.8 / 2 + enemy.width * 0.9 / 2 &&
      Math.abs(game.dino.y - enemy.y) < game.dino.height * 0.8 / 2 + enemy.height * 0.9 / 2
    ) {
      game.isGameOver = true;

      gameOverSound();

      ctx.font = 'bold 90px serif';
      ctx.fillStyle = 'black';
      ctx.fillText(`Game Over ${howManyTime}回目`, 50, 220);
      gameBGM.pause();
      gameBGM.currentTime = 0;
      clearInterval(game.timer);
    }
  }
}

document.onkeydown = (e) => {
  if (e.code === 'Space' && game.dino.moveY === 0) {
    game.dino.moveY = -41;
    jumpAudio.currentTime = 0;
    jumpAudio.play();
  }
  if (e.code === 'Enter' && game.isGameOver) {
    init();
    playBGM();
    howManyTime += 1;
  }
};

canvas.addEventListener(
  'mousedown',
  () => {
    if (game.isGameOver) {
      init();
      playBGM();
      howManyTime += 1;
    } else if (game.dino.moveY === 0) {
      game.dino.moveY = -41;
      jumpAudio.currentTime = 0;
      jumpAudio.play();
    }
  }
);

function gameOverSound() {
  const gameOverBGM = new Audio('audio/チーン1.mp3')
  gameOverBGM.currentTime = 0;
  gameOverBGM.volume = 0.45;
  gameOverBGM.play();
}


function playBGM() {
  gameBGM.play();
  gameBGM.volume = 0.1;
}

gameBGM.loop = true;