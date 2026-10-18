import { entity } from "./entity.js";
export default class Ball extends entity {
    velX;
    velY;
    bounceRatio;
    baseVelX;
    baseVelY;
    baseX;
    baseY;
    constructor(velX, velY, bounceRatio, radius, color) {
        super(0, 0, radius, radius, color);
        this.baseVelX = velX;
        this.baseVelY = velY;
        this.baseX = 0;
        this.baseY = 0;
        this.velX = velX;
        this.velY = velY;
        this.bounceRatio = bounceRatio;
    }
    resetPos() {
        this.x = this.baseX;
        this.y = this.baseY;
        this.velX = this.baseVelX;
        this.velY = this.baseVelY;
    }
    move(gravity, dt) {
        this.x += this.velX * dt;
        this.y += this.velY * dt;
        this.velY -= gravity * dt;
    }
    bounce(ballTargetY, newVelY) {
        this.velY = newVelY;
        this.y = ballTargetY;
    }
}
