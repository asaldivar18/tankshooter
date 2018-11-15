var socket = io.connect();

/**
 * Tank
 */
class Tank {
    constructor(xpos, ypos, isPlayer) {
        //this.ctx = document.getElementById("gamecanvas").getContext("2d")
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
    show(canvas) {
        console.log(this.xpos)
        if (this.isPlayer) {
            this.ctx.rect(this.xpos, this.ypos, 192, 54);
            console.log(screen.width * .125, screen.height * .0625)
                //this.ctx.rect(this., 20, 150, 100);
                //this.ctx.rect(this.xpos, this.ypos, 150, 100)
            this.ctx.stroke()
                //canvas.line(this.xpos + (screen.width * .125 / 2), this.ypos, this.xpos + (screen.width * .125 / 2), this.ypos - ((screen.width * 0.125) / 4))
        } else {
            canvas.rect(this.xpos, this.ypos, screen.width * .125, screen.height * .0625);
            canvas.line(this.xpos + (screen.width * .125 / 2), this.ypos + screen.height * .0625, this.xpos + (screen.width * .125 / 2), this.ypos + screen.height * .0625 + ((screen.width * .125) / 4))
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