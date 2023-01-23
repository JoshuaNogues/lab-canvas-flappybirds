const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

const logo = document.getElementById("logo");

const bgImage = new Image();
bgImage.src = "../images/bg.png";

const fabyImage = new Image();
fabyImage.src = "../images/flappy.png";

const topPipeImage = new Image();
topPipeImage.src = "../images/obstacle_top.png";

const bottomPipeImage = new Image();
bottomPipeImage.src = "../images/obstacle_bottom.png";

let pipesIntervalId;
let animationLoopId;
let gravityLoopId;

let score = 0;
let gameOn = false;

const faby = {
  x: 400,
  y: 200,
  width: 75,
  height: 50,
  speedX: 0,
  speedY: 0,
  gravity: 0.1,
  gravitySpeed: 1,
  update: function () {
    this.gravitySpeed = this.gravitySpeed + this.gravity;
  },
  newPosition: function () {
    if (this.y <= 0) {
      this.y = 2;
      this.gravitySpeed *= -0.5;
    } else if (this.y + this.height / 2 > canvas.height) {
      gameOver();
    } else {
      this.y = this.y + this.gravitySpeed;
    }
  },
};

class Pipe {
  constructor() {
    this.sharedX = 1200;

    this.spaceBetween = 200;

    this.bottomPipeX = this.sharedX;
    this.bottomPipeY = this.spaceBetween + Math.round(Math.random() * 400);

    this.topPipeX = this.sharedX;
    this.topPipeY = this.bottomPipeY - this.spaceBetween - 793;

    this.spaceBetweenWidth = 138;

    this.scored = false;
  }

  update() {
    this.sharedX = this.sharedX - 2;
  }

  draw() {
    ctx.drawImage(bottomPipeImage, this.sharedX, this.bottomPipeY);
    ctx.drawImage(topPipeImage, this.sharedX, this.topPipeY);
  }

  spaceBetweenTop() {
    return this.bottomPipeY - this.spaceBetween;
  }

  spaceBetweenBottom() {
    return this.bottomPipeY;
  }

  spaceBetweenLeft() {
    return this.sharedX;
  }

  spaceBetweenRight() {
    return this.sharedX + this.spaceBetweenWidth;
  }
}

let pipesArray = [];

function generatePipes() {
  pipesIntervalId = setInterval(() => {
    pipesArray.push(new Pipe());
  }, 3750);
}

function gameOver() {
  ctx.clearRect(0, 0, 1200, 600);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1200, 600);

  if (score > 6) {
    ctx.fillStyle = "white";
    ctx.font = "40px serif";
    ctx.fillText(`Your score is ${score}.  You've won!`, 400, 350);
  } else {
    ctx.fillStyle = "white";
    ctx.font = "40px serif";
    ctx.fillText(`Your score is ${score}.  You've lost.`, 400, 350);
  }

  gameOn = false;
  pipesArray = [];
  faby.x = 400;
  faby.y = 200;
  faby.gravitySpeed = 1;

  clearInterval(pipesIntervalId);
  clearInterval(animationLoopId);
  clearInterval(gravityLoopId);
}

function checkCollision(obstacle) {
  if (
    faby.x + faby.width > obstacle.sharedX &&
    obstacle.sharedX + obstacle.spaceBetweenWidth > faby.x &&
    faby.y > obstacle.spaceBetweenTop() &&
    faby.y + faby.height < obstacle.spaceBetweenBottom() &&
    obstacle.spaceBetweenLeft() < faby.x + faby.width &&
    obstacle.spaceBetweenRight() > faby.x &&
    faby.y <= obstacle.spaceBetweenTop() + 4
  ) {
    faby.y += 15;
    faby.gravitySpeed *= -0.8;
  }

  if (
    faby.x + faby.width > obstacle.sharedX &&
    obstacle.sharedX + obstacle.spaceBetweenWidth > faby.x &&
    faby.y > obstacle.spaceBetweenTop() &&
    faby.y + faby.height < obstacle.spaceBetweenBottom() &&
    obstacle.spaceBetweenLeft() < faby.x + faby.width &&
    obstacle.spaceBetweenRight() > faby.x &&
    faby.y + faby.height >= obstacle.spaceBetweenBottom() - 4
  ) {
    faby.y -= 15;
    faby.gravitySpeed *= -0.8;
  }

  if (
    faby.x + faby.width - 10 > obstacle.sharedX &&
    obstacle.sharedX + obstacle.spaceBetweenWidth > faby.x + 10 &&
    !(
      faby.y > obstacle.spaceBetweenTop() &&
      faby.y + faby.height < obstacle.spaceBetweenBottom() &&
      obstacle.spaceBetweenLeft() < faby.x + faby.width &&
      obstacle.spaceBetweenRight() > faby.x
    )
  ) {
    gameOver();
  }
}

function checkScore(obstacle) {
  if (
    faby.x > obstacle.sharedX + obstacle.spaceBetweenWidth &&
    obstacle.scored === false
  ) {
    score++;
    obstacle.scored = true;
  }
}

function showScore() {
  ctx.fillStyle = "black";
  ctx.fillRect(10, 10, 130, 50);

  ctx.fillStyle = "white";
  ctx.font = "24px serif";
  ctx.fillText(`Score: ${score}`, 35, 43);
}

function animationLoop() {
  animationLoopId = setInterval(() => {
    if (score >= 7) {
      gameOver();
    }

    ctx.clearRect(0, 0, 1200, 600);

    ctx.drawImage(bgImage, 0, 0, 1200, 600);

    faby.newPosition();

    ctx.drawImage(fabyImage, faby.x, faby.y, faby.width, faby.height);

    showScore();

    for (let i = 0; i < pipesArray.length; i++) {
      if (pipesArray[i].sharedX < -138) {
        pipesArray.splice(i, 1);
      }

      pipesArray[i].update();
      pipesArray[i].draw();

      checkScore(pipesArray[i]);
      checkCollision(pipesArray[i]);
    }
  }, 16);
}

function gravityLoop() {
  gravityLoopId = setInterval(() => {
    faby.update();
  }, 50);
}

function startGame() {
  gameOn = true;

  logo.style.visibility = "hidden";
  logo.style.height = "0px";
  canvas.width = "1200";
  canvas.height = "600";
  canvas.style.visibility = "visible";

  animationLoop();
  generatePipes();
  gravityLoop();
}

window.onload = function () {
  document.getElementById("start-button").onclick = function (e) {
    if (e.keyCode == 32) {
      e.preventDefault();
      return false;
    } else if (gameOn === false) {
      startGame();
    }
  };

  document.getElementById("start-button").addEventListener("keydown", (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 32:
        faby.gravitySpeed = faby.gravitySpeed - 0.3;
        break;
    }
  });
};