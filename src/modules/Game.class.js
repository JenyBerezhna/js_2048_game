'use strict';

const { shiftAndMerge } = require('./mergeLogic.js');

class Game {
  constructor(initialState) {
    this.size = 4;
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;

    if (
      Array.isArray(initialState) &&
      initialState.length === this.size &&
      initialState.every(
        (row) => Array.isArray(row) && row.length === this.size,
      )
    ) {
      this.board = initialState.map((row) => [...row]);
      this.status = this.getStatus();
    }

    // eslint-disable-next-line no-console
    console.log('Game initialized:', this.board);
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    if (this.hasWon || this.board.flat().includes(2048)) {
      this.hasWon = true;

      return 'win';
    }

    if (!this.canMove()) {
      return 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;
    this.spawnTile();
    this.spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  moveLeft() {
    this.handleMove('left');
  }

  moveRight() {
    this.handleMove('right');
  }

  moveUp() {
    this.handleMove('up');
  }

  moveDown() {
    this.handleMove('down');
  }

  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.board);
    const { board: newBoard, totalScore } = shiftAndMerge(
      this.board,
      direction,
    );

    if (prev !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.score += totalScore;
      this.spawnTile();
    }

    this.status = this.getStatus();
  }

  canMove() {
    return ['up', 'down', 'left', 'right'].some((dir) => {
      const { board: moved } = shiftAndMerge(this.board, dir);

      return JSON.stringify(moved) !== JSON.stringify(this.board);
    });
  }

  spawnTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
