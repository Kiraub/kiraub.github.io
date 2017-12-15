// constants

//global vars
var xda;

function setup()
{
    //
    createCanvas( 600, 600);
    background( 20);
    xda = random( 10, 100);
}

function draw()
{
    //
    noStroke();
    
    rect( 0, 0, xda, xda);
}