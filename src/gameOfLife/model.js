import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants.js";

export class Model {
  constructor() {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.observers = [];
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        let stateGridBuffer = JSON.parse(JSON.stringify(this.state));
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            let alive = this.isCellAlive(i,j);
            if(alive) {
              if(nbAlive !== 2 && nbAlive !== 3) {
                stateGridBuffer[j][i] = CELL_STATES.DEAD;
              }
            } else {
              if(nbAlive === 3) {
                stateGridBuffer[j][i] = CELL_STATES.ALIVE;
              }
            }
          }
        }
        this.state = stateGridBuffer;
        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(!(i ===0 && j ===0)) {
          if(this.isCellAlive(x+i, y+j)) {
            number++;
          }
        }
      }
    }
    return number;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] === observer) {
        this.observers.slice(i, 1);
      }
    }
  }

  // notify method
  updated() {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i](this);
    }
  }
}
