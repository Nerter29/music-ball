import { entity } from "./entity.js";
export default class Ball extends entity {
    velX;
    velY;
    bounceRatio;
    baseVelX;
    baseVelY;
    baseX;
    baseY;
    startX = 0;
    startY = 0;
    startGravity = 0;
    lastBounceTime = 0;
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
    /** Analytic move */
    move(time, gravity) {
        const t = time - this.lastBounceTime;
        this.x = this.startX + this.velX * t;
        this.y = this.startY + (this.velY * t) - (0.5 * gravity * t * t);
    }
    bounce(ballTargetY, newVelY, time, currentX) {
        this.lastBounceTime = time;
        this.startX = currentX;
        this.startY = ballTargetY;
        this.velY = newVelY;
    }
}
