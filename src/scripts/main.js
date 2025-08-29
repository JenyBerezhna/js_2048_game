'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const scoreEl = document.querySelector('.game-score');
  const statusEl = document.querySelector('.status');
  const startBtn = document.querySelector('.start');
  const restartBtn = document.querySelector('.restart');

  // Assign IDs to grid cells
  document.querySelectorAll('.field-row').forEach((row, rowIndex) => {
    row.querySelectorAll('.field-cell').forEach((cell, colIndex) => {
      cell.id = `cell-${rowIndex}-${colIndex}`;
    });
  });

  let gameEnded = false;

  /**
   * Updates the board UI based on the game state
   */
  const updateBoard = () => {
    const board = game.getState();

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = document.getElementById(`cell-${r}-${c}`);
        const val = board[r][c];

        const newClass = `field-cell ${
          val === 0 ? 'empty' : `field-cell--${val}`
        }`;

        if (
          cell.className !== newClass ||
          cell.textContent !== String(val || '')
        ) {
          cell.className = newClass;
          cell.textContent = val || '';
        }
      }
    }
  };

  /**
   * Updates the score and status text
   */
  const updateStatus = () => {
    scoreEl.textContent = `Score: ${game.getScore()}`;
    statusEl.textContent = `Status: ${game.getStatus()}`;
  };

  /**
   * Ends the game visually (alerts only once)
   */
  const checkEndGame = () => {
    const stat = game.getStatus();

    if (!gameEnded && (stat === 'win' || stat === 'lose')) {
      gameEnded = true;
      alert(stat === 'win' ? 'You Win!' : 'Game Over!');
    }
  };

  /**
   * Handles a move if game is active
   */
  const processMove = (direction) => {
    if (game.getStatus() === 'idle') {
      game.start();
    }

    if (game.getStatus() === 'playing') {
      game.handleMove(direction);
      updateBoard();
      updateStatus();
      checkEndGame();
    }
  };

  // Keyboard input handling
  const keyToDirection = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  document.addEventListener('keydown', (e) => {
    const direction = keyToDirection[e.code];

    if (direction) {
      e.preventDefault();
      processMove(direction);
    }
  });

  startBtn.addEventListener('click', () => {
    game.start();
    gameEnded = false;
    updateBoard();
    updateStatus();
  });

  restartBtn.addEventListener('click', () => {
    game.restart();
    gameEnded = false;
    updateBoard();
    updateStatus();
  });

  // Auto-start game when page loads
  game.start();
  updateBoard();
  updateStatus();
});
