import Ball from "./ball.js";
import { entity } from "./entity.js";

export class Platform extends entity{
    ballTargetY : number;
    ballVelY : number;
    reversedBounce : boolean;
    constructor(x : number, y : number, ballTargetY : number, width : number, height : number, color: string, reversedBounce : boolean, ballVelY : number){
        super(x, y, width, height, color);
        this.ballTargetY = ballTargetY;
        this.reversedBounce = reversedBounce
        this.ballVelY = ballVelY
    }
}

/** Makes an estimation of ball trajectory to predict platforms pos */
export function createPlatforms(notesTime : number[], gravity : number, ball : Ball) : Platform[]{
    const res : Platform[] = [];

    const width = 32;
    const height = 12;

    let x = ball.x;
    let y = ball.y;
    let lastTime = notesTime[0]
    let velY = ball.velY
    for(let time of notesTime){
        const elapsed = time - lastTime
        lastTime = time;
        x += elapsed * ball.velX;
        
        y = y + (velY * elapsed) - (0.5 * gravity * elapsed * elapsed);

        const velYAtImpact = velY - (gravity * elapsed);

        velY = -velYAtImpact * ball.bounceRatio;

        const bounceBackward = velYAtImpact > 0
        
        res.push(new Platform(x - width / 2, y + (bounceBackward ? height + ball.sizeY : - ball.sizeX), y, width, height, "#ffffff", bounceBackward, velY));
    }
    return res;
}