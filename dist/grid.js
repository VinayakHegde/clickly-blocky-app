'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLOURS = ['red', 'green', 'blue', 'yellow'];
var MAX_X = 10;
var MAX_Y = 10;
var WHITE = 'white';

var Block = function () {
    function Block(x, y) {
        _classCallCheck(this, Block);

        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        this.clickable = true;
    }

    // sets the colour to the block


    _createClass(Block, [{
        key: 'setColour',
        value: function setColour(colour) {
            this.colour = colour;
        }

        // sets the clickable property to the block

    }, {
        key: 'setClickable',
        value: function setClickable(clickable) {
            this.clickable = clickable;
        }
    }]);

    return Block;
}();

var BlockGrid = function () {
    function BlockGrid() {
        _classCallCheck(this, BlockGrid);

        this.grid = [];
        this.sameColourBlocks = [];
        this.score = 0;

        for (var x = 0; x < MAX_X; x++) {
            var col = [];
            for (var y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    _createClass(BlockGrid, [{
        key: 'redrawBlock',
        value: function redrawBlock(blockEl, block) {
            var x = block.x,
                y = block.y,
                colour = block.colour;

            var id = 'block_' + x + 'x' + y;

            blockEl.id = id;
            blockEl.className = block.clickable ? 'block clickable' : 'block';
            blockEl.style.background = block.colour;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var grid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('#gridEl');

            var el = grid.cloneNode(false);
            grid.parentNode.replaceChild(el, grid);
            for (var x = 0; x < MAX_X; x++) {
                var id = 'col_' + x;
                var colEl = document.createElement('div');
                colEl.className = 'col';
                colEl.id = id;
                el.appendChild(colEl);

                var _loop = function _loop(y) {
                    var block = _this.grid[x][y];
                    var blockEl = document.createElement('div');

                    if (block.clickable) {
                        blockEl.addEventListener('click', function (evt) {
                            return _this.blockClicked(evt, block);
                        });
                    }

                    colEl.appendChild(blockEl);
                    _this.redrawBlock(blockEl, block);
                };

                for (var y = MAX_Y - 1; y >= 0; y--) {
                    _loop(y);
                }
            }
            this.renderScoreboard();
            return this;
        }
    }, {
        key: 'blockClicked',
        value: function blockClicked(e, block) {
            var _this2 = this;

            // what happens on each block click before you re-render?
            // what happens to each column of blocks?

            // male the element as active       
            e.target.className = e.target.className + ' active';
            this.sameColourBlocks = [];
            this.getSameColourNeighbours(block);

            if (this.sameColourBlocks.length > 0) {
                for (var i = 0; i < this.sameColourBlocks.length; i++) {
                    // clear the block
                    this.clearBlock(this.grid[this.sameColourBlocks[i].x][this.sameColourBlocks[i].y]);
                }
            }

            // reorder the columns in a way that any white block in the middle should bubbleup the stack
            this.reorderColumn();

            // delay for 0.1 second to redraw- so that we can see block clicked animation.
            setTimeout(function () {
                _this2.render();
            }, 100);
        }
    }, {
        key: 'clearBlock',
        value: function clearBlock(block) {
            block.setColour(WHITE);
            block.setClickable(false);
        }
    }, {
        key: 'reorderColumn',
        value: function reorderColumn() {
            var colours = [];

            // loop through each column and reorder the colour - 
            for (var x = 0; x < MAX_X; x++) {
                colours = this.grid[x].map(function (blk) {
                    return blk.colour;
                }).filter(function (colour) {
                    return colour != WHITE;
                });

                while (colours.length < MAX_Y) {
                    colours.push(WHITE);
                }
                for (var y = 0; y < MAX_Y; y++) {
                    this.grid[x][y].setColour(colours[y]);
                    this.grid[x][y].setClickable(colours[y] != WHITE);
                }
            }
        }
    }, {
        key: 'getNeighbours',
        value: function getNeighbours(block) {
            if (!block) return new Array();
            // how do you get all neighbours of a given block given its coordinates
            var blocks = new Array(),
                xCo = block.x,
                yCo = block.y;

            // return true if the block is a one of the corner block
            function isCornerBlock() {
                return (xCo == 0 || xCo == MAX_X - 1) && (yCo == 0 || yCo == MAX_Y - 1);
            }

            // return true if the block is a one of the edge block
            function isEdgeBlock() {
                return xCo == 0 || xCo == MAX_X - 1 || yCo == 0 || yCo == MAX_Y - 1;
            }

            if (isCornerBlock()) {
                // should return 2 neighbour blocks
                if (xCo == 0 && yCo == 0) {
                    // bottom left corner
                    blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                    blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                } else if (xCo == 0 && yCo == MAX_Y - 1) {
                    // top left corner
                    blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                    blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
                } else if (xCo == MAX_X - 1 && yCo == 0) {
                    // bottom right corner
                    blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                    blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                } else if (xCo == MAX_X - 1 && yCo == MAX_Y - 1) {
                    // top right corner
                    blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                    blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
                }
            } else if (isEdgeBlock()) {
                // should return 3 neighbour blocks
                if (xCo == 0) {
                    // left edge
                    blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
                    blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                    blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                } else if (xCo == MAX_X - 1) {
                    // right edge
                    blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
                    blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                    blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                } else if (yCo == 0) {
                    // bottom edge
                    blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                    blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                    blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                } else if (yCo == MAX_X - 1) {
                    // top edge
                    blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                    blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                    blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
                }
            } else {
                // should return 4 neighbour blocks
                blocks.push(this.grid[xCo + 1][yCo]); // right neighbour
                blocks.push(this.grid[xCo - 1][yCo]); // left neighbour
                blocks.push(this.grid[xCo][yCo + 1]); // top neighbour
                blocks.push(this.grid[xCo][yCo - 1]); // bottom neighbour
            }
            return blocks;
        }
    }, {
        key: 'getSameColourNeighbours',
        value: function getSameColourNeighbours(block) {
            var _this3 = this;

            // how do you get only same color blocks?
            var neighbour = this.getNeighbours(block);

            // if block has neighbours
            if (neighbour.length > 0) {
                var _loop2 = function _loop2(i) {
                    if (block.colour === neighbour[i].colour) {
                        var exist = _this3.sameColourBlocks.find(function (blk) {
                            return blk.x == neighbour[i].x && blk.y == neighbour[i].y;
                        });
                        if (!exist) {
                            _this3.sameColourBlocks.push(neighbour[i]);
                            _this3.getSameColourNeighbours(neighbour[i]);
                        }
                    }
                };

                for (var i = 0; i < neighbour.length; i++) {
                    _loop2(i);
                }
            }
        }
    }, {
        key: 'renderScoreboard',
        value: function renderScoreboard() {
            var _this4 = this;

            var scorecard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('#scoreEl');

            this.score = 0;
            this.grid.forEach(function (blocks) {
                blocks.forEach(function (block) {
                    if (!block.clickable) _this4.score += 10;
                });
            });

            var el = scorecard.cloneNode(false);
            scorecard.parentNode.replaceChild(el, scorecard);

            el.className = 'scorecard';

            var score = document.createElement('div'),
                restart = document.createElement('button');

            score.className = 'score';
            score.id = 'score';
            score.innerText = 'Score ' + this.score;

            restart.innerText = this.score > 0 ? 'Restart' : 'Refresh';
            restart.className = 'restart clickable';
            restart.addEventListener('click', function (evt) {
                _this4.constructor();
                _this4.render();
            });

            el.appendChild(score);
            el.appendChild(restart);
        }
    }]);

    return BlockGrid;
}();

window.addEventListener('DOMContentLoaded', function () {
    return new BlockGrid().render();
});