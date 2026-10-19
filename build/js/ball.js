import { entity } from "./entity.js";
export default class Ball extends entity {
    velX;
    bounceVelY;
    bounceRatio;
    baseVelX;
    baseVelY;
    baseX;
    baseY;
    startX = 0;
    startY = 0;
    lastBounceTime = 0;
    constructor(velX, velY, bounceRatio, radius, color) {
        super(0, 0, radius, radius, color);
        this.baseVelX = velX;
        this.baseVelY = velY;
        this.baseX = 0;
        this.baseY = 0;
        this.velX = velX;
        this.bounceVelY = velY;
        this.bounceRatio = bounceRatio;
    }
    resetPos() {
        this.x = this.baseX;
        this.y = this.baseY;
        this.velX = this.baseVelX;
        this.bounceVelY = this.baseVelY;
        this.lastBounceTime = 0;
        this.startX = 0;
        this.startY = 0;
    }
    /** Analytic move */
    move(time, gravity) {
        const t = time - this.lastBounceTime;
        this.x = this.startX + this.velX * t;
        this.y = this.startY + (this.bounceVelY * t) - (0.5 * gravity * t * t);
    }
    bounce(ballTargetY, newVelY, time) {
        this.lastBounceTime = time;
        this.startX = this.x;
        this.startY = ballTargetY; // only to make sure that littles position variations don't accumulate over time
        this.bounceVelY = newVelY;
    }
}
