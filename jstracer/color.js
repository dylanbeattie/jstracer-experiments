import Vector from './vector.js';

class Material {
    getColorAt = point => Color.Grey;
}

class Chessboard extends Material {
    constructor(color1, color2) {
        super();
        this.color1 = color1;
        this.color2 = color2;
    }
    getColorAt = point => {
        let ax = Math.abs(Math.round(point.x) % 2);
        let ay = Math.abs(Math.round(point.y) % 2);
        let az = Math.abs(Math.round(point.z) % 2);
        if (ay == 0) {
            return (ax == az ? this.color1 : this.color2);
        } else {
            return (ax == az ? this.color2 : this.color1);
        }
    }
}

class Color extends Material {

    getColorAt = _ => this;

    static White = new Color(1, 1, 1);
    static Black = new Color(0, 0, 0);
    static Grey = new Color(0.5, 0.5, 0.5);
    clamp = value => (value > 1 ? 1 : value < 0 ? 0 : value);

    constructor(r, g, b) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
    }

    clip = function () {
        let rr = this.r;
        let gg = this.g;
        let bb = this.b;
        var intensity = this.r + this.g + this.b;
        var overflow = intensity - 3;
        if (overflow > 0) {
            rr = rr + overflow * (rr / intensity);
            gg = gg + overflow * (gg / intensity);
            bb = bb + overflow * (bb / intensity);
        }
        return new Color(this.clamp(rr), this.clamp(gg), this.clamp(bb));
    }

    /** add this vector to that vector, and return a new vector representing the sum of both vectors */
    add = (that) => new Color(this.r + that.r, this.g + that.g, this.b + that.b);

    /** multiply this color by the supplied factor. 0 =>  */
    multiply = (that) => new Color(this.r * that.r, this.g * that.g, this.b * that.b);

    /** multiply this color by the supplied factor. 0 =>  */
    scale = (factor) => new Color(this.r * factor, this.g * factor, this.b * factor);

    hex = (value) => Math.floor(0xff * value).toString(16).padStart(2, '0');

    toHexColor = () => `#${this.hex(this.r)}${this.hex(this.g)}${this.hex(this.b)}`;
}

export { Chessboard, Color };