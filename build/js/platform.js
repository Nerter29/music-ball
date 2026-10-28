import { entity } from "./entity.js";
import { getColorFromHSL } from "./utils.js";
export class Platform extends entity {
    ballTargetY;
    ballVelY;
    reversedBounce;
    passed;
    hue;
    luminosity;
    deadLuminosity;
    updatedLuminosity;
    updating = false;
    updateProgress = 0;
    updateTime = 0.2;
    fullyUpdatedColor;
    constructor(x, y, ballTargetY, width, height, hue, deadLuminosity, updatedLuminosity, reversedBounce, ballVelY) {
        super(x, y, width, height, "#000");
        this.ballTargetY = ballTargetY;
        this.reversedBounce = reversedBounce;
        this.ballVelY = ballVelY;
        this.passed = false;
        this.hue = hue;
        this.updatedLuminosity = updatedLuminosity;
        this.deadLuminosity = deadLuminosity;
        this.luminosity = deadLuminosity;
        this.color = getColorFromHSL(this.hue, 100, this.deadLuminosity);
        this.fullyUpdatedColor = getColorFromHSL(this.hue, 100, this.updatedLuminosity);
    }
    updateColor(dt) {
        if (this.updating) {
            const gap = this.updatedLuminosity - this.deadLuminosity;
            this.updateProgress += dt;
            const rawRatio = Math.min(this.updateProgress / this.updateTime, 1);
            const easeOutRatio = rawRatio * (2 - rawRatio); // ease out : f(x) = x * (2 - x)
            this.luminosity = (easeOutRatio) * gap + this.deadLuminosity;
            if (rawRatio >= 1) {
                this.updating = false;
            }
            this.color = getColorFromHSL(this.hue, 100, this.luminosity);
        }
    }
}
/** Makes an estimation of ball trajectory to predict platforms pos */
export function createPlatforms(notesTime, preSongTime, gravity, ball, deadLuminosity, updatedLuminosity, hueSpeed) {
    const res = [];
    const width = 32;
    const height = 12;
    let x = ball.x;
    let y = ball.y;
    let lastTime = notesTime[0] - preSongTime;
    let velY = ball.bounceVelY;
    let hue = 0;
    for (let time of notesTime) {
        const elapsed = time - lastTime;
        lastTime = time;
        x += elapsed * ball.velX;
        y = y + (velY * elapsed) - (0.5 * gravity * elapsed * elapsed);
        const velYAtImpact = velY - (gravity * elapsed);
        velY = -velYAtImpact * ball.bounceRatio;
        const bounceBackward = velYAtImpact > 0;
        hue += elapsed * hueSpeed;
        res.push(new Platform(x - width / 2, y + (bounceBackward ? height + ball.sizeY : -ball.sizeX), y, width, height, hue, deadLuminosity, updatedLuminosity, bounceBackward, velY));
    }
    return res;
}
