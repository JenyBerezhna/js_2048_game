'use strict';

const { shiftAndMerge } = require('./mergeLogic.js');

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;

    if (this.isValidBoard(initialState)) {
      this.board = initialState.map((row) => [...row]);
      this.status = this.getStatus();
    } else {
      this.board = this.createEmptyBoard();
    }

    // eslint-disable-next-line no-console
    console.log('Game initialized:', this.board);
  }

  /**
   * Creates an empty board (4x4 filled with zeros)
   */
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  /**
   * Validates a board structure and values
   */
  isValidBoard(board) {
    return (
      Array.isArray(board) &&
      board.length === this.size &&
      board.every(
        (row) =>
          Array.isArray(row) &&
          row.length === this.size &&
          row.every((cell) => Number.isInteger(cell) && cell >= 0),
      )
    );
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

    return this.status === 'idle' ? 'playing' : this.status;
  }

  /**
   * Starts a new game.
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
   * Restarts the game.
   */
  restart() {
    this.start();
  }

  /**
   * Handles a move in a given direction
   */
  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board;
    const { board: newBoard, totalScore } = shiftAndMerge(prevBoard, direction);

    if (!this.boardsEqual(prevBoard, newBoard)) {
      this.board = newBoard;
      this.score += totalScore;
      this.spawnTile();
    }

    this.status = this.getStatus();
  }

  /**
   * Moves in each direction
   */
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

  /**
   * Checks if any move is possible
   */
  canMove() {
    return ['up', 'down', 'left', 'right'].some((dir) => {
      const { board: moved } = shiftAndMerge(this.board, dir);

      return !this.boardsEqual(this.board, moved);
    });
  }

  /**
   * Spawns a new tile (2 or 4) at a random empty position
   */
  spawnTile() {
    if (this.status !== 'playing') {
      return;
    }

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

  /**
   * Checks if two boards are equal
   */
  boardsEqual(b1, b2) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (b1[r][c] !== b2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
