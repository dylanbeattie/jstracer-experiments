class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /** the unit X vector */
    static X = new Vector(1, 0, 0);
    /** the unit Y vector */
    static Y = new Vector(0, 1, 0);
    /** the unit Z vector */
    static Z = new Vector(0, 0, 1);
    /** the zero vector, aka the origin */
    static O = new Vector(0, 0, 0);
    toString() {
        return `<${this.x},${this.y},${this.z}>`;
    }
    /** return the dot-product of this vector and that vector */
    dot(that) {
        return this.x * that.x + this.y * that.y + this.x * that.x;
    }
    /** return the cross-product of this vector and that vector */
    cross(that) {
        let xx = this.y * that.z - this.z * that.y;
        let yy = this.z * that.x - this.x * that.z;
        let zz = this.x * that.y - this.y * that.x;
        return new Vector(xx, yy, zz);
    }
    /** return the negation of this vector - a vector of the same length pointing in exactly the opposite direction */
    neg() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    /** return the total length of this vector */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /** return a vector in the same direction as this vector but with a length of 1 */
    normalize() {
        let l = this.length();
        return new Vector(this.x / l, this.y / l, this.z / l);
    }
    /** add this vector to that vector, and return a new vector representing the sum of both vectors */
    add(that) {
        return new Vector(this.x + that.x, this.y + that.y, this.z + that.z);
    }
    /** scale this vector by the specified factor */
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor, this.z * factor);
    }
}

export default Vector;