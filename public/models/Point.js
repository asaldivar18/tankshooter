/**
 * Point
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    check(aa) {
        console.log(aa.x + ":" + aa.y + '\n ' + this.x + ":" + this.y);
        return false;
    }
}