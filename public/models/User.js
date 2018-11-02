class User {
    constructor(isPlayer) {
        this.kills = 0;
        this.deaths = 0;
        if (isPlayer) {
            this.tank = new Tank(30, height - height * .0625 - 20, true);
        } else {
            this.tank = new Tank(30, 20, false);
        }
    }

}