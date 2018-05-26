To get started

```
$ npm i
$ npm start
$ open http://localhost:9100/
```

It is a game similar to candy crush.

When you click on a block with one or more neighbours of the same colour, blocks with matching color are removed.
If the same-color neighbours of the block you clicked have same color neighbours, remove these too.
After you removed the blocks, the remaining blocks above the ones removed need to fall down.

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
Facts:
1. Blocks on the diagonal do not count as neighbours
2. You should not be able to remove a single block
3. When the block is cleared then the blocks above it are falling down. 

Tasks for those who wants to improve this game:
0. Write more tests! There are some example specs in the tests folder to help you.
1. Can you make the remaining blocks 'fall down' to the bottom and move to left?
2. Can you accumulate blocks horizontally? - requirement that blocks are pushed to the left if any columns are empty
3. Recursion is your friend can you improve this?
4. Can you pick a better color scheme?
5. Can you think how you'd do bonus scoring - like when 10 or more blocks  cleared in a click, add 10 points.
