var socket = io.connect('https://guccitankgang888.herokuapp.com/' || 'http://localhost:3000');

/**
 * Tank
 */
class Tank {
    constructor(xpos, ypos, isPlayer) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.isPlayer = isPlayer;
        this.updatePoints();
        this.health = 100;
    }

    hit(point) {
        //console.log(point)
        this.health = this.health - point;
        if (this.health <= 0) {
            this.health = 100.1;
            document.getElementById("deaths").innerHTML = ++deaths
        }
        if (this.isPlayer) {
            document.getElementById("pHealth").innerHTML = Math.floor(this.health) + "%"
            document.getElementById("pHealth").style.width = Math.floor(this.health) + "%";
        } else {
            document.getElementById("oHealth").innerHTML = tank.tank.health
            document.getElementById("oHealth").style.width = tank.tank.health + "%";
        }
    }

    display() {
        if (this.isPlayer) {
            rect(this.xpos, this.ypos, width * .125, height * .0625);
            line(this.xpos + (width * .125 / 2), this.ypos, this.xpos + (width * .125 / 2), this.ypos - ((width * 0.125) / 4))
        } else {
            rect(this.xpos, this.ypos, width * .125, height * .0625);
            line(this.xpos + (width * .125 / 2), this.ypos + height * .0625, this.xpos + (width * .125 / 2), this.ypos + height * .0625 + ((width * .125) / 4))
        }
    }
    updatePoints() {
        if (this.isPlayer) {
            this.point = new Point(this.xpos + (width * .125 / 2), this.ypos - ((width * 0.125) / 4))
        } else {
            this.point = new Point(this.xpos + (width * .125 / 2), this.ypos + height * .0625 + ((width * .125) / 4))
        }
    }

    moveLeft() {
        this.xpos = this.xpos - 8.88;
        this.updatePoints()
        if (this.xpos < 0) this.xpos = 0;
    }
    moveRight() {
        this.xpos = this.xpos + 8.88;
        this.updatePoints();
        if (this.xpos > width - width * .125) this.xpos = width - width * .125;
    }
}