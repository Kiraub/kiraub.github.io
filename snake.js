// constants

const width = 600;
const height = 600;
const gridsize = 20;

// global vars

var tileList[];
var food;


function setup()
{
    createCanvas( 600, 600);
    background( 60);
}

function draw()
{
    //
}

function drawFood()
{
    food = ( random( gridsize) )
}