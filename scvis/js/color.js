
function toColor(value, alpha) {
    //TODO fetch scale from color picker    
    let scale = (value) => {
        let r = value * value;
        r = Math.floor(255 * r);
        let g = 2 * value * (1 - value);
        g = Math.floor(255 * g);
        let b = (1 - value) * (1 - value);
        b = Math.floor(255 * b);

        return rgba(r, g, b, alpha);
    }

    value = Math.max(Math.min(value, 1), 0);
    return scale(value);
}

function rgba(r, g, b, a) {
    return { r, g, b, a,
        toString: function() {
            return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        }
    };
}