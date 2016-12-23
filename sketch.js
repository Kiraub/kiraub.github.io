var black;
var x;
var y;
var lastx;
var lasty;

function setup()
{
    frameRate(60);
    black = color(0);
    createCanvas( 600, 600);
    background(200);
    lastx = -1;
    lasty = -1;
}

function draw()
{
    if( mouseIsPressed )
    {
        x = mouseX;
        y = mouseY;
        if( lastx == -1)
        {
            lastx = x;
            lasty = y;
        } else
        {
            stroke(0);
            line( lastx, lasty, x, y);
            lastx = x;
            lasty = y;
        }
    } else
    {
        lastx = -1;
        lasty = -1;
    }
}