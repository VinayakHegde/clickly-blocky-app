'use strict';

const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;
const WHITE = 'white';

class Block {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        this.clickable = true;
    }

    // sets the colour to the block
    setColour(colour){
        this.colour = colour;
    }

    // sets the clickable property to the block
    setClickable(clickable){
        this.clickable = clickable;
    }
}

class BlockGrid {
    constructor () {
        this.grid = [];
        this.sameColourBlocks = [];
        this.score = 0;

        for (let x = 0; x < MAX_X; x++) {
            const col = [];
            for (let y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    redrawBlock(blockEl, block) {
        const {x, y, colour} = block;
        const id = `block_${x}x${y}`;

        blockEl.id = id;
        blockEl.className = block.clickable ? 'block clickable' : 'block';
        blockEl.style.background = block.colour;
    }

    render(grid=document.querySelector('#gridEl')) {
        let el = grid.cloneNode(false);
        grid.parentNode.replaceChild(el, grid);
        for (let x = 0; x < MAX_X; x++) {
          const id = 'col_' + x;
          const colEl = document.createElement('div');
          colEl.className = 'col';
          colEl.id = id;
          el.appendChild(colEl);

          for (let y = MAX_Y - 1; y >= 0; y--) {
            const block = this.grid[x][y];
            const blockEl = document.createElement('div'); 

            if(block.clickable) {
              blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));    
            }              

            colEl.appendChild(blockEl);
            this.redrawBlock(blockEl, block);
          }
        }
        this.renderScoreboard();
        return this;
    }

    blockClicked (e, block) {
        // what happens on each block click before you re-render?
        // what happens to each column of blocks?
        
        // male the element as active       
        e.target.className = e.target.className + ' active';
        this.sameColourBlocks = [];
        this.getSameColourNeighbours(block);
        
        if(this.sameColourBlocks.length > 0){
            for(let i=0; i< this.sameColourBlocks.length;i++){
                // clear the block
                this.clearBlock(this.grid[this.sameColourBlocks[i].x][this.sameColourBlocks[i].y]);
            }
        }

        // reorder the columns in a way that any white block in the middle should bubbleup the stack
        this.reorderColumn();

        // delay for 0.1 second to redraw- so that we can see block clicked animation.
        setTimeout(() => {
            this.render();
        }, 100);
    }

    clearBlock(block){
        block.setColour(WHITE);
        block.setClickable(false);
    }

    reorderColumn(){
        let colours = [];            

        // loop through each column and reorder the colour - 
        for (let x = 0; x < MAX_X; x++) {
            colours = this.grid[x].map(blk => blk.colour).filter(colour => colour != WHITE);

            while(colours.length < MAX_Y){
                colours.push(WHITE);
            }
            for (let y = 0; y < MAX_Y; y++) {
                this.grid[x][y].setColour(colours[y]);
                this.grid[x][y].setClickable(colours[y] != WHITE);
            }
        }
    }

    getNeighbours(block){
        if(!block) return new Array();
        // how do you get all neighbours of a given block given its coordinates
        var blocks = new Array(),
            xCo = block.x,
            yCo = block.y;

        // return true if the block is a one of the corner block
        function isCornerBlock(){
            return ((xCo == 0 || xCo == MAX_X - 1) && (yCo == 0 || yCo == MAX_Y - 1));
        }

        // return true if the block is a one of the edge block
        function isEdgeBlock(){
            return (xCo == 0 || xCo == MAX_X - 1 || yCo == 0 || yCo == MAX_Y - 1);
        }

        if(isCornerBlock()){
            // should return 2 neighbour blocks
            if(xCo == 0 && yCo == 0){
                // bottom left corner
                blocks.push(this.grid[xCo][yCo+1]); // top neighbour
                blocks.push(this.grid[xCo+1][yCo]); // right neighbour
            }
            else if(xCo == 0 && yCo == MAX_Y - 1){
                // top left corner
                blocks.push(this.grid[xCo+1][yCo]); // right neighbour
                blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
            }
            else if(xCo == MAX_X - 1 && yCo == 0){
                // bottom right corner
                blocks.push(this.grid[xCo-1][yCo]); // left neighbour
                blocks.push(this.grid[xCo][yCo+1]); // top neighbour

            }
            else if(xCo == MAX_X - 1 && yCo == MAX_Y - 1){
                // top right corner
                blocks.push(this.grid[xCo-1][yCo]); // left neighbour
                blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
            }
        } else if(isEdgeBlock()){
            // should return 3 neighbour blocks
            if(xCo == 0){
                // left edge
                blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
                blocks.push(this.grid[xCo][yCo+1]); // top neighbour
                blocks.push(this.grid[xCo+1][yCo]); // right neighbour
            } else if(xCo == MAX_X-1){
                // right edge
                blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
                blocks.push(this.grid[xCo][yCo+1]); // top neighbour
                blocks.push(this.grid[xCo-1][yCo]); // left neighbour
            } else if(yCo == 0){
                // bottom edge
                blocks.push(this.grid[xCo+1][yCo]); // right neighbour
                blocks.push(this.grid[xCo-1][yCo]); // left neighbour
                blocks.push(this.grid[xCo][yCo+1]); // top neighbour
            } else if(yCo == MAX_X-1){
                // top edge
                blocks.push(this.grid[xCo+1][yCo]); // right neighbour
                blocks.push(this.grid[xCo-1][yCo]); // left neighbour
                blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
            }
        } else{
            // should return 4 neighbour blocks
            blocks.push(this.grid[xCo+1][yCo]); // right neighbour
            blocks.push(this.grid[xCo-1][yCo]); // left neighbour
            blocks.push(this.grid[xCo][yCo+1]); // top neighbour
            blocks.push(this.grid[xCo][yCo-1]); // bottom neighbour
        }
        return blocks;
    }

    getSameColourNeighbours(block){
        // how do you get only same color blocks?
        let neighbour = this.getNeighbours(block);
        
        // if block has neighbours
        if(neighbour.length > 0){
            for(let i=0; i<neighbour.length; i++){
                if(block.colour === neighbour[i].colour){
                    let exist = this.sameColourBlocks.find(function(blk){
                        return blk.x == neighbour[i].x && blk.y == neighbour[i].y;
                    });
                    if(!exist){
                        this.sameColourBlocks.push(neighbour[i]);
                        this.getSameColourNeighbours(neighbour[i]);
                    }
                }
            }            
        }
    }

    renderScoreboard(scorecard=document.querySelector('#scoreEl')){
        this.score = 0;
        this.grid.forEach((blocks)=>{
            blocks.forEach((block)=>{
                if(!block.clickable) this.score += 10;
            });
        });

        let el = scorecard.cloneNode(false);
        scorecard.parentNode.replaceChild(el, scorecard);

        el.className = 'scorecard';

        const score = document.createElement('div'),
            restart = document.createElement('button');

        score.className = 'score';
        score.id = 'score';
        score.innerText = 'Score ' + this.score;

        restart.innerText = this.score > 0 ? 'Restart' : 'Refresh';
        restart.className = 'restart clickable';
        restart.addEventListener('click', (evt) => {
            this.constructor();
            this.render()
        });  

        el.appendChild(score);
        el.appendChild(restart);
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
