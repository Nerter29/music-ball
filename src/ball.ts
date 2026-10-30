import { entity } from "./entity.js";
import { Platform } from "./platform.js";
import { randomInRange } from "./utils.js";

export type Coo = {
    x: number,
    y : number
};

export default class Ball extends entity{
    velX: number;
    bounceVelY: number;
    bounceRatio: number;
    baseVelX : number;
    baseVelY: number;
    baseX : number;
    baseY : number;

    startX: number = 0;
    startY: number = 0;
    lastBounceTime: number = 0;
    trailCoordList : Coo[] = [];
    trailLength: number;
    trailStartLuminosity : number;

    constructor(velX : number, velY : number, bounceRatio: number, radius : number, color: string, trailLength : number,
    trailStartLuminosity : number){
        super(0, 0, radius, radius, color);
        this.baseVelX = velX;
        this.baseVelY = velY;
        this.baseX = 0;
        this.baseY = 0;
        this.velX = velX;
        this.bounceVelY = velY;
        this.bounceRatio = bounceRatio

        this.trailLength = trailLength;
        this.trailStartLuminosity = trailStartLuminosity;
    }

    resetPos(){
        this.x = this.baseX;
        this.y = this.baseY;
        this.velX = this.baseVelX;
        this.bounceVelY = this.baseVelY;
        this.lastBounceTime = 0;
        this.startX = 0;
        this.startY = 0
    }

    /** Analytic move */
    move(time: number, gravity: number) {
        
        this.trailCoordList.push({x : this.x, y: this.y});
        if(this.trailCoordList.length > this.trailLength){
            this.trailCoordList.shift();
        }

        const t = time - this.lastBounceTime;

        this.x = this.startX + this.velX * t;
        this.y = this.startY + (this.bounceVelY * t) - (0.5 * gravity * t * t);
    }

    bounce(ballTargetY: number, newVelY: number, time: number) {
        this.lastBounceTime = time;
        this.startX = this.x;
        this.startY = ballTargetY; // only to make sure that littles position variations don't accumulate over time
        this.bounceVelY = newVelY;
    }

    
}