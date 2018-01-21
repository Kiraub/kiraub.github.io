
function ColorScheme(schemeName) {
    let scheme = COLOR_SCHEMES[schemeName];
    let maxSteps = Math.max(...Object.keys(scheme));
    let steps = scheme[maxSteps].map((rgb) => {        
        let start = rgb.indexOf('(') + 1;
        let end = rgb.lastIndexOf(')');
        return rgb.substring(start, end).split(",").map(Number);         
    });    
    
    this.toColor = (value) => {
        if (value >= 1) 
            return steps[maxSteps - 1];                               
            
        value *= maxSteps - 1;        
        let index = Math.floor(value);
        let lower = steps[index];
        let upper = steps[index + 1];
        return mix(lower, upper, value % 1);
    };
}

function mix(rgb1, rgb2, value) {
    if (value < 0 || value > 1)
        console.log(value);
    let result = [0, 0, 0];
    for (let i = 0; i < 3; ++i) 
        result[i] = rgb1[i] * (1 - value) + rgb2[i] * value;
    return result;
}

function toColor(value, alpha) {
    value = Math.max(Math.min(value, 1), 0);
    let rgb = selectedColorScheme.toColor(value);    
    return rgba(rgb[0], rgb[1], rgb[2], alpha);
}

function rgba(r, g, b, a) {       
    return { r, g, b, a,
        toString: function() {
            return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        }
    };
}