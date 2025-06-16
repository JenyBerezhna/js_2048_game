'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

updateBoard();
updateStatus();

const keyToMethod = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowUp: 'moveUp',
  ArrowDown: 'moveDown',
};

document.addEventListener('keydown', (e) => {
  if (keyToMethod[e.key]) {
    game[keyToMethod[e.key]]();
    updateBoard();
    updateStatus();
  }
});

document.querySelectorAll('.start, .restart').forEach((button) => {
  button.addEventListener('click', () => {
    game.restart();
    updateBoard();
    updateStatus();
  });
});

function updateBoard() {
  const board = game.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);

      cell.className = 'field-cell';

      if (cellValue > 0) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      } else {
        cell.textContent = '';
        cell.classList.add('hidden');
      }
    });
  });
}

function updateStatus() {
  document.getElementById('score').textContent = `Score: ${game.getScore()}`;
  document.getElementById('status').textContent = `Status: ${game.getStatus()}`;
}
