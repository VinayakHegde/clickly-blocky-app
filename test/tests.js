const { expect } = chai;
describe("BlockGrid", function() {
    "use strict";
    const blockGrid = new BlockGrid();

    describe("clearBlock", () => {
        let randomBlock = null;
        let sameColours = [];
        
        // run this before running the each test case
        beforeEach(() => {
            randomBlock = blockGrid.grid[Math.floor(Math.random() * MAX_X)][Math.floor(Math.random() * MAX_Y)];
            if(randomBlock.clickable){
                blockGrid.sameColourBlocks = [];
                blockGrid.getSameColourNeighbours(randomBlock);

                if(blockGrid.sameColourBlocks.length > 0){
                    for(let i=0; i< blockGrid.sameColourBlocks.length;i++){
                        let sameBlock = blockGrid.grid[blockGrid.sameColourBlocks[i].x][blockGrid.sameColourBlocks[i].y];
                        // clear the sameBlock
                        blockGrid.clearBlock(sameBlock);
                        sameColours.push(sameBlock)
                    }
                }

            }
        });

        it('should turn the block white and make it not clickable', (done) =>{
            if(sameColours.length > 0){
                sameColours.forEach((sameBlock) => {
                    // sameBlock should be non clickable after clearing
                    (sameBlock.clickable).should.equal(false);
                    // sameBlock should be white in colour after clearing
                    (sameBlock.colour).should.equal(WHITE);
                });
            }
            done();
        });
        it('should be idempotent - (I may not be right here!!)', (done)=>{
            if(sameColours.length > 0){
                sameColours.forEach((sameBlock) => {
                    // sameBlock should have property clickable after clearing
                    sameBlock.should.have.property('clickable').equal(false);
                    // sameBlock should  have property colour after clearing
                    sameBlock.should.have.property('colour').equal(WHITE);
                    // sameBlock should  have property x after clearing
                    sameBlock.should.have.property('x');
                    // sameBlock should  have property y after clearing
                    sameBlock.should.have.property('y');
                });
            }

            done();
        });
    });

    describe('removeBlock - below are redundant/duplicate test cases', () => {
        it('is idempotent');
        it('makes the block not clickbale');
        it('turns the block white');
    });

    describe('getNeighbours', () =>{
        // collect all 4 corner blocks - this is what we expect in a grid
        let cornerBlock = {
            bl : blockGrid.grid[0][0],
            br : blockGrid.grid[0][MAX_Y - 1],
            tl : blockGrid.grid[MAX_X - 1][0],
            tr : blockGrid.grid[MAX_X - 1][MAX_Y - 1]
        };

        chai.should();

        it('returns the neighrbours to either side and above', (done) => {
            // all non corner / non edge blocks should have four neighbours
            blockGrid.grid.forEach((blocks, x)=>{
                // skip the left and right edge
                if(x > 0 && x < MAX_X - 1){
                    blocks.forEach((block, y)=> {
                        // skip the top and bottom edge
                        if(y > 0 && y < MAX_Y - 1){
                            blockGrid.getNeighbours(block).should.have.lengthOf(4);
                        }
                    });
                }
            });
            done();
        });
        it('returns correct results for corner blocks', (done) => {
            // all corner blocks should have 2 neighbours
            blockGrid.getNeighbours(cornerBlock.bl).should.have.lengthOf(2);
            blockGrid.getNeighbours(cornerBlock.br).should.have.lengthOf(2);
            blockGrid.getNeighbours(cornerBlock.tl).should.have.lengthOf(2);
            blockGrid.getNeighbours(cornerBlock.tr).should.have.lengthOf(2);
            done();
        });
        it('returns correct results for blocks on the edges', (done) => {
            let x = 0, 
                y = 0;

            // left edge
            edge(false);

            // bottom edge
            edge(true);

            y = MAX_Y - 1;
            x = MAX_X - 1; 

            // right edge
            edge(false);

            // top edge
            edge(true);

            function edge(increX){
                let MAX = increX ? MAX_X : MAX_Y;
                for(let i = 0; i < MAX; i++){
                    let a = increX ? i : x,
                        b = increX ? y : i,
                        c = a < MAX - 1 && b < MAX - 1,
                        block = blockGrid.grid[a][b];
          
                    if(a != b && c){
                        // all the non corner edge blocks should have three neighbours 
                        blockGrid.getNeighbours(block).should.have.lengthOf(3);
                    }
                }
            }

            done();
        });
    });

    describe('reorderColumn', () => {
        /* Why would we need this function? Can you fill the test in and use it? */
        before(() => {
            let randomBlock = blockGrid.grid[Math.floor(Math.random() * MAX_X)][Math.floor(Math.random() * MAX_Y)];

            if(randomBlock.clickable){
                blockGrid.sameColourBlocks = [];
                blockGrid.getSameColourNeighbours(randomBlock);
                  
                if(blockGrid.sameColourBlocks.length > 0){
                    for(let i=0; i< blockGrid.sameColourBlocks.length;i++){
                        blockGrid.clearBlock(blockGrid.grid[blockGrid.sameColourBlocks[i].x][blockGrid.sameColourBlocks[i].y]);
                    }
                }
                blockGrid.reorderColumn();
            }
        });
        it('should ensure that remaining blocks are at the bottom', (done) => {
      
            blockGrid.reorderColumn();
            for (let x = 0; x < MAX_X; x++) {
                let bWhite = false;
                for (let y = 0; y < MAX_Y; y++) {
                    bWhite = !bWhite ? (blockGrid.grid[x][y].colour == WHITE) : bWhite;
                    if(bWhite) {
                      (blockGrid.grid[x][y].colour).should.equal(WHITE);
                    }
                }
            }
            done();
        });
    });
});
