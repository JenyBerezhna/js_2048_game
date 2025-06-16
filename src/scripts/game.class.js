class Game {
  constructor(size = 4) {
    this.size = size;
    this.score = 0;
    this.gameOver = false;
    this.start();
  }

  start() {
    this.board = this.createEmptyBoard();
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.score = 0;
    this.gameOver = false;
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.board.flat().includes(2048)) {
      return 'won';
    }

    if (!this.canMove()) {
      return 'lost';
    }

    return 'running';
  }

  makeMove(direction) {
    const previousState = JSON.stringify(this.board);

    this.shiftAndMergeTiles(direction);

    const newState = JSON.stringify(this.board);

    if (previousState !== newState) {
      this.spawnTile();
    }
  }

  moveLeft() {
    this.makeMove('left');
  }
  moveRight() {
    this.makeMove('right');
  }
  moveUp() {
    this.makeMove('up');
  }
  moveDown() {
    this.makeMove('down');
  }

  shiftAndMergeTiles(direction) {
    let rotated = this.board;

    if (direction === 'up') {
      rotated = this.transpose(rotated);
    }

    if (direction === 'down') {
      rotated = this.transpose(rotated).map((row) => row.reverse());
    }

    if (direction === 'right') {
      rotated = rotated.map((row) => row.reverse());
    }

    rotated = rotated.map((row) => this.mergeRow(row));

    if (direction === 'down') {
      rotated = rotated.map((row) => row.reverse());
    }

    if (direction === 'right') {
      rotated = rotated.map((row) => row.reverse());
    }

    if (direction === 'up') {
      rotated = this.transpose(rotated);
    }

    this.board = rotated;
  }

  mergeRow(row) {
    const newRow = row.filter((val) => val !== 0);
    const merged = new Array(this.size).fill(false);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1] && !merged[i]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
        merged[i] = true;
      }
    }

    const result = newRow.filter((val) => val !== 0);

    return result.concat(Array(this.size - result.length).fill(0));
  }

  transpose(matrix) {
    return matrix[0].map((_, col) => matrix.map((row) => row[col]));
  }

  canMove() {
    const directions = ['up', 'down', 'left', 'right'];

    for (const dir of directions) {
      const temp = new Game(this.size);

      temp.board = JSON.parse(JSON.stringify(this.board));
      temp.score = this.score;
      temp.shiftAndMergeTiles(dir);

      if (JSON.stringify(temp.board) !== JSON.stringify(this.board)) {
        return true;
      }
    }

    return false;
  }

  spawnTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length > 0) {
      const [row, col] = empty[Math.floor(Math.random() * empty.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }
}

export default Game;
