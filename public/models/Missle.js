/**
 * Missle
 */
class Missle {
    constructor(x, y, isPlayer) {
        this.isPlayer = isPlayer;
        this.x = x;
        this.y = y;
        this.updatePoints();
        //console.log(this.tank);

    }

    updatePoints() {
        if (this.isPlayer) {
            this.point = new Point(this.x, this.y);
        } else {
            this.point = new Point(this.x, this.y)
        }
    }
    display() {
        if (this.isPlayer) {
            ellipse(this.x, this.y, 6, 6)
        } else {
            ellipse(this.x, this.y, 6, 6)

        }
    }
    move() {
        if (this.isPlayer) {
            this.y -= 2;
        } else {
            this.y += 2;
        };
    }
}