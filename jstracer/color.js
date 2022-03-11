import Vector from './vector.js';

class Color {
    clamp = value => (value > 1 ? 1 : value < 0 ? 0 : value);

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /** add this vector to that vector, and return a new vector representing the sum of both vectors */
    add = (that) => new Color(this.r + that.r, this.g + that.g, this.b + that.b);

    /** multiply this color by the supplied factor. 0 =>  */
    multiply = (factor) => new Vector(this.r * factor, this.g * factor, this.b * factor);

    hex = (value) => Math.floor(0xff * value).toString(16).padStart(2, '0');

    toHexColor = () => `#${this.hex(this.r)}${this.hex(this.g)}${this.hex(this.b)}`;
}

export default Color;