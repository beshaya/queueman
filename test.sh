#!/bin/bash

#Test queueman against itself and cumin in all permutations

node=nodejs
#my machine is weird?

$node test.js
$node test.js --listen
$node test.js --send
$node test.js --listen --send
