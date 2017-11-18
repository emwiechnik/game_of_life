var root = {
    gameScreenGrid: undefined,
    game: undefined
}

function Creature() {
    this.isAlive = true;
    this.dieNextTime = false;
    this.comeToLifeNextTime = false;

    this.die = function () {
        this.dieNextTime = true;
    }
    this.comeToLife = function () {
        this.comeToLifeNextTime = true;
    }
    this.doWhatYouNeedToDo = function() {
        if (this.dieNextTime) {
            this.isAlive = false;
        } else if (this.comeToLifeNextTime) {
            this.isAlive = true;
        } 
        this.dieNextTime = this.comeToLifeNextTime = false;
    }
}

function GameScreenGrid(settings) {
    screen = document.getElementById('game-screen');

    var private = {
        canvas: screen.getContext('2d'),
        settings: settings
    }

    this.draw = function (row, col, creature) {
        aliveColor = private.settings.aliveColor;
        deadColor = private.settings.deadColor;
        cellSize = private.settings.cellSize;
        color = creature.isAlive ? aliveColor : deadColor;
        private.canvas.fillStyle = color;
        private.canvas.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
}

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 30);
        };
})();

function GameOrchestrator(gameScreenGrid, settings) {
    var initializeCreatures = function (count) {
        n = Math.floor(Math.sqrt(count));

        arr = new Array(n);

        for (i = 0; i < n; ++i) {
            arr[i] = new Array(n);
        }

        for (x = 0; x < n; ++x) {
            for (y = 0; y < n; ++y) {
                arr[x][y] = new Creature();
                
                if (Math.random() > 0.1) {
                     arr[x][y].isAlive = false;
                }
            }
        }

        return arr;
    }

    var private = {
        creatures2dArray: initializeCreatures(settings.creaturesCount),
        gameScreenGrid: gameScreenGrid
    }

    display = function () {
        n = private.creatures2dArray.length;
        for (x = 0; x < n; ++x) {
            for (y = 0; y < n; ++y) {
                private.gameScreenGrid.draw(y, x, private.creatures2dArray[x][y]);
            }
        }
    }

    goToNextIteration = function () {
        n = private.creatures2dArray.length;
        for (x = 0; x < n; ++x) {
            for (y = 0; y < n; ++y) {
                private.creatures2dArray[x][y].doWhatYouNeedToDo();
            }
        }
    }

    countNeighbours = function (x, y) {
        count = 0;
        n = private.creatures2dArray.length;
        xMin = Math.max(0, x - 1);
        xMax = Math.min(n-1, x + 1);
        yMin = Math.max(0, y - 1);
        yMax = Math.min(n-1, y + 1);

        for (i = xMin; i <= xMax; ++i) {
            for (j = yMin; j <= yMax; ++j) {
                if (i == x && j == y) continue;
                count += private.creatures2dArray[i][j].isAlive ? 1 : 0;
            }
        }

        return count;
    }

    applyRules = function () {
        for (x = 0; x < n; ++x) {
            for (y = 0; y < n; ++y) {
                nCount = countNeighbours(x, y);
                
                // applying rules
                if (private.creatures2dArray[x][y].isAlive) {
                    if (nCount < 2 || nCount > 3) {
                        private.creatures2dArray[x][y].die();
                    }
                }

                if (private.creatures2dArray[x][y].isAlive === false) {
                    if (nCount === 3) {
                        private.creatures2dArray[x][y].comeToLife();
                    }
                }
            }
        }
    }

    evolve = function () {
        if (private.running) {
            applyRules();
            display();
            goToNextIteration();
            requestAnimFrame(evolve);
        }
    }

    this.run = function () {
        private.running = true;
        evolve();
    }

    this.stop = function () {
        private.running = false;
    }
}

function getSettingValue(id) {
    el = document.getElementById(id);
    return el.value;
}

function start() {
    {
        root.gameScreenGrid = new GameScreenGrid({ cellSize: 5, aliveColor: 'blue', deadColor: 'white' });
        root.game = new GameOrchestrator(root.gameScreenGrid, { creaturesCount: getSettingValue('creatures-count') });
        root.game.run();
    }
}

function apply() {
    root.game.stop();
    start();
}
