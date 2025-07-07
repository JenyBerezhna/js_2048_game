'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  game.start();

  const scoreEl = document.querySelector('.game-score');
  const statusEl = document.querySelector('.status');

  // Assign unique IDs to grid cells
  document.querySelectorAll('.field-row').forEach((row, rowIndex) => {
    row.querySelectorAll('.field-cell').forEach((cell, colIndex) => {
      cell.setAttribute('id', `cell-${rowIndex}-${colIndex}`);
    });
  });

  const updateBoard = () => {
    const board = game.getState();

    board.forEach((row, rowIndex) => {
      row.forEach((val, colIndex) => {
        const cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);

        cell.className = `field-cell ${val === 0 ? 'hidden' : `field-cell--${val}`}`;
        cell.textContent = val === 0 ? '' : val;
      });
    });
  };

  const updateStatus = () => {
    scoreEl.textContent = `Score: ${game.getScore()}`;
    statusEl.textContent = `Status: ${game.getStatus()}`;
  };

  const keyToDirection = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  document.addEventListener('keydown', (e) => {
    const direction = keyToDirection[e.code];

    if (direction && game.getStatus() === 'playing') {
      game.handleMove(direction);
      updateBoard();
      updateStatus();
    }
  });

  document.querySelectorAll('.start, .restart').forEach((btn) => {
    btn.addEventListener('click', () => {
      game.restart();
      updateBoard();
      updateStatus();
    });
  });

  updateBoard();
  updateStatus();
});
