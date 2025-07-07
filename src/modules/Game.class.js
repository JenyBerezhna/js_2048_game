'use strict';

import { shiftAndMerge } from './mergeLogic.js';

export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.hasWon = false;
    this.previousBoard = null;
    this.previousScore = null;

    if (Array.isArray(initialState)) {
      this.board = initialState.map((row) => [...row]);
      this.status = this.getStatus();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.hasWon || this.board.flat().includes(2048)) {
      this.hasWon = true;

      return 'Winner! Congrats! You did it!';
    }

    if (!this.canMove()) {
      return 'You lose! Restart the game?';
    }

    return this.status === 'idle' ? 'idle' : 'playing';
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.start();
  }

  undo() {
    if (!this.previousBoard) {
      return;
    }
    this.board = JSON.parse(this.previousBoard);
    this.score = this.previousScore;
  }

  handleMove(direction) {
    const prev = JSON.stringify(this.board);
    const { board: newBoard, totalScore } = shiftAndMerge(
      this.board,
      direction,
    );

    if (prev !== JSON.stringify(newBoard)) {
      this.previousBoard = prev;
      this.previousScore = this.score;
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

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}
