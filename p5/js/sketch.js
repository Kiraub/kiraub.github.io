var x;
var y;
var lastx;
var lasty;

var brushOption;
var brushSize;

var black = 0;

var backgroundColor = 200;
var canvasHeight = 600;
var canvasWidth = 600;

var fps = 60;

function setup()
{
    lastx = -1;
    lasty = -1;

    frameRate( fps);
    createCanvas( canvasWidth, canvasHeight);
    background( backgroundColor);
    
    brushOption = createRadio();
    brushOption.option( "pencil");
    brushOption.option( "eraser");
    brushOption.style( 'width', '80px');

    brushSize = createSlider( 1, 20, 2, 1);

}

function draw()
{
    if( mouseIsPressed)
    {
        handleMouse();
    } else
    {
        lastx = -1;
        lasty = -1;
    }
}

function handleMouse()
{
    x = mouseX;
    y = mouseY;
    if( lastx == -1)
    {
        lastx = x;
        lasty = y;
    } else
    {
        if( brushOption.value() == "pencil")
        {
            stroke( black);
            strokeWeight( brushSize.value());
            line( lastx, lasty, x, y);
        } else if( brushOption.value() == "eraser")
        {
            stroke( backgroundColor);
            strokeWeight( brushSize.value() * 2);
            line( lastx, lasty, x, y);
        }
        lastx = x;
        lasty = y;
    }
}