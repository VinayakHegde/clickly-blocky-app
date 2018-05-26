To get started

```
$ npm i
$ npm start
$ open http://localhost:9100/
```

Your task is to create a game similar to candy crush.

When you click on a block with one or more neighbours of the same colour, blocks with matching color are removed.
If the same-color neighbours of the block you clicked have same color neighbours, remove these too.
After you removed the blocks, the remaining blocks above the ones removed need to fall down.

Feel free to use whatever libs you need to make it all work.

E.g.,

Given:

```
#####$#
###$$##
###$##$
##$$###
```

After the first $ is clicked the board should look like this:

```
##   $#
### ###
### ##$
#######
```

Clicking and of the # will result in:

```



    $$
```

Tasks:
0. Write tests! There are some example specs in the tests folder to help you get started. They will also give you some ideas for a possible solution
1. Implement blockClicked to remove (or hide) all blocks of the same colour that are connected to the target element.
2. Redraw the grid and make the remaining blocks 'fall down' to the bottom
3. Ensure that the remaining blocks can still be clicked afterwards and that you can't "remove" empty blocks

FAQ, trivia and other goodies:

1. Blocks on the diagonal do not count as neighbours
2. You should not be able to remove a single block
3. Recursion is your friend with this task, but up to a limit, why?
4. When the block is cleared then the blocks above it are falling down. Can you model this in terms of ordering blocks in each column?
5. No need to accumulate blocks horizontally, but you're welcome to think how you would implement the requirement that blocks are pushed to the left if any columns are empty
6. Can you pick a better color scheme?
7. If you manage this under half an hour, can you think how you'd do scoring?