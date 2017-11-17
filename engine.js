function Creature() {
    this.isAlive = true;
    this.die = function() {
        this.isAlive = false;
    }
}

function GameScreenGrid(settings) {
    screen = document.getElementById('game-screen');

    var private = {
        canvas : screen.getContext('2d'),
        settings : settings
    }
    
    this.draw = function(row, col, creature) {
        aliveColor = private.settings.aliveColor;
        deadColor = private.settings.deadColor;
        cellSize = private.settings.cellSize;
        color = creature.isAlive ? aliveColor : deadColor;
        private.canvas.fillStyle = color;
        private.canvas.fillRect(col * cellSize, row * cellSize, col * cellSize + cellSize, row * cellSize + cellSize);
    }
}

function GameOrchestrator(gameScreenGrid, settings) {
    var initializeCreatures = function(count) {
        n = Math.floor(Math.sqrt(count));

        arr = new Array(n);
        
        for(i = 0; i < n; ++i) {
            arr[i] = new Array(n);
        }
        
        for(x = 0; x < n; ++x) {
            for(y = 0; y < n; ++y) {
                arr[x][y] = new Creature();
                // for now just random setup
                if (Math.random() > 0.5) {
                    arr[x][y].isAlive = false;
                }
            }
        }
        
        return arr;
    }

    var private = {
        creatures2dArray : initializeCreatures(settings.creaturesCount),
        gameScreenGrid : gameScreenGrid
    }

    this.display = function() {
        n = private.creatures2dArray.length;
        for(x = 0; x < n; ++x) {
            for(y = 0; y < n; ++y) {
                private.gameScreenGrid.draw(y, x, private.creatures2dArray[x][y]);
            }
        }
    }
}

function getSettingValue(id) {
    el = document.getElementById(id);
    return el.value;
}

function start() {
    {
        var gameScreenGrid = new GameScreenGrid({ cellSize : 20, aliveColor : 'blue', deadColor : 'white' });
        var game = new GameOrchestrator(gameScreenGrid, { creaturesCount : getSettingValue('creatures-count') });
        game.display();
    }
}