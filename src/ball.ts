import { entity } from "./entity.js";

export default class Ball extends entity{
    velX: number;
    velY: number;
    bounceRatio: number;
    baseVelX : number;
    baseVelY: number;
    baseX : number;
    baseY : number;

    startX: number = 0;
    startY: number = 0;
    startGravity: number = 0;
    lastBounceTime: number = 0;

    constructor(velX : number, velY : number, bounceRatio: number, radius : number, color: string){
        super(0, 0, radius, radius, color);
        this.baseVelX = velX;
        this.baseVelY = velY;
        this.baseX = 0;
        this.baseY = 0;
        this.velX = velX;
        this.velY = velY;
        this.bounceRatio = bounceRatio
    }

    resetPos(){
        this.x = this.baseX;
        this.y = this.baseY;
        this.velX = this.baseVelX;
        this.velY = this.baseVelY;
    }

    /** Analytic move */
    move(time: number, gravity: number) {
        const t = time - this.lastBounceTime;

        this.x = this.startX + this.velX * t;
        this.y = this.startY + (this.velY * t) - (0.5 * gravity * t * t);
    }

    bounce(ballTargetY: number, newVelY: number, time: number, currentX: number) {
        this.lastBounceTime = time;
        this.startX = currentX;
        this.startY = ballTargetY;
        this.velY = newVelY;
    }

    
}