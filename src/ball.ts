import { entity } from "./entity.js";

export default class Ball extends entity{
    velX: number;
    velY: number;
    bounceRatio: number;
    baseVelX : number;
    baseVelY: number;
    baseX : number;
    baseY : number;

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

    move(gravity : number, dt : number) : void{    
    
        this.x += this.velX * dt;
        this.y += this.velY * dt;

        this.velY -= gravity * dt;
    }

    bounce(ballTargetY : number, newVelY: number) : void{
        
        this.velY = newVelY;
        this.y = ballTargetY;
    }

    
}