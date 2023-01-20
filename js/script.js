const canvas = document.getElementById("my-canvas")
const ctx = canvas.getContext('2d')

const logo = document.getElementById("logo")

const bgImage = new Image()
bgImage.src = "../images/bg.png"

const fabyImage = new Image()
fabyImage.src = "../images/flappy.png"

const faby = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  speedX: 0,
  speedY: 0,
  gravity: 0,
  gravitySpeed: 0,
  update: function () {

  },
  newPosition: function () {

  }
}

// width
// height
// speedX
// speedY
// gravity
// gravitySpeed
// And the functions update and newPos to keep updating its position in every update.

function startGame() {

  console.log("Starting")

  logo.style.visibility = "hidden"
  logo.style.height = "0px"
  canvas.width = "1200"
  canvas.height = "600"
  canvas.style.visibility = "visible"

  ctx.drawImage(bgImage, 0, 0, 1200, 600)

  ctx.drawImage(fabyImage, 400, 200, 75, 50)

}


window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };


};