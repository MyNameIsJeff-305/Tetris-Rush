import './style.css'

import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS } from './consts'

//1. Initialize canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext('2d');
const audio = new Audio('./tetris.mp3')
audio.volume = 0.5;

let score = 0;
const $score = document.querySelector('span')

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

//3. board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0));
}

//4. player
const piece = {
  position: { x: 6, y: 0 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

//9. Random Pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ]
]


//2. game loop
// function update() {
// draw();
// window.requestAnimationFrame(update)
// }


//8. Auto Drop
let dropCounter = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0;

    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }
  draw();
  window.requestAnimationFrame(update);

}


function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow';
        context.fillRect(x, y, 1, 1);
      }
    })
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'red';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    })
  });
  $score.innerText = score;
}

function rotate() {
  const numRows = piece.shape.length;
  const numCols = piece.shape[0].length;
  const previousShape = piece.shape;
  let rotatedPiece = [];

  for (let col = numCols - 1; col >= 0; col--) {
    let newRow = [];
    for (let row = 0; row < numRows; row++) {
      newRow.push(piece.shape[row][col]);
    }
    rotatedPiece.push(newRow);
  }

  if (checkCollision)
    piece.shape = previousShape
  else
    piece.shape = rotatedPiece;
}

document.addEventListener('keydown', event => {
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }
  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece();
      removeRows();
    }
  }
  if (event.key === EVENT_MOVEMENTS.UP) {
    const numRows = piece.shape.length;
    const numCols = piece.shape[0].length;
    let rotatedPiece = [];

    for (let col = numCols - 1; col >= 0; col--) {
      let newRow = [];
      for (let row = 0; row < numRows; row++) {
        newRow.push(piece.shape[row][col]);
      }
      rotatedPiece.push(newRow);
    }

    const previousShape = piece.shape;
    piece.shape = rotatedPiece;
    if (checkCollision()) {
      piece.shape = previousShape
      console.log("ENTERING IF");
    }
  }
})

function checkCollision() {

  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  });

  //get Random Piece
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  piece.position.x = 6;
  piece.position.y = 0

  //10. gameover
  if (checkCollision()) {
    window.alert('Game Over!! Sorry');
    board.forEach((row) => row.fill(0))
  }
}

function removeRows() {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y);
    }
  });
  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
  });
  rowsToRemove.length === 0 ? score += 4 : score += 10 * rowsToRemove.length
}

const $button = document.querySelector('button');
const $p = document.querySelector('p');

$button.addEventListener('click', () => {
  update();

  $button.remove()
  $p.remove();

  const audio = new Audio('./tetris.mp3')
  audio.volume = 0.5;
  audio.play();
})

