import Ball from "./ball.js";
import { Particle } from "./particle.js";
import { Platform } from "./platform.js";
export class Camera {
    x;
    y;
    baseX;
    baseY;
    speed;
    canvaCtx;
    canvas;
    screenWidth;
    screenHeight;
    cameraSpeed;
    constructor(x, y, speed, canvas, canvaCtx, cameraSpeed) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.canvas = canvas;
        this.canvaCtx = canvaCtx;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        this.screenWidth = windowWidth - 100;
        this.screenHeight = windowHeight - 100;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;
        this.cameraSpeed = cameraSpeed;
    }
    resetPos() {
        this.x = this.baseX;
        this.baseY = this.baseY;
    }
    refreshScreen() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        this.screenWidth = windowWidth - 100;
        this.screenHeight = windowHeight - 100;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;
        this.canvaCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    }
    draw(entities, targetCenterX, targetCenterY) {
        this.x += (targetCenterX - this.x) * this.cameraSpeed;
        this.y += (targetCenterY - this.y) * this.cameraSpeed;
        entities.forEach(e => {
            if (!e) {
                return;
            }
            const x = e.x - this.x + this.screenWidth / 2;
            const y = -(e.y - this.y) + this.screenHeight / 2;
            if (x >= 0 - e.sizeX && x <= this.screenWidth && y >= 0 - e.sizeY && y <= this.screenHeight) {
                if (e instanceof Ball) {
                    this.canvaCtx.beginPath();
                    this.canvaCtx.arc(x, y, e.sizeX, 0, 2 * Math.PI, false);
                    this.canvaCtx.lineWidth = 2;
                    this.canvaCtx.strokeStyle = e.color;
                    this.canvaCtx.stroke();
                }
                else if (e instanceof Platform) {
                    this.canvaCtx.beginPath();
                    this.canvaCtx.roundRect(x, y, e.sizeX, e.sizeY, 4);
                    this.canvaCtx.fillStyle = e.color;
                    this.canvaCtx.fill();
                }
                else if (e instanceof Particle && e.lifeProportion > 0) {
                    this.canvaCtx.globalAlpha = e.lifeProportion;
                    this.canvaCtx.beginPath();
                    this.canvaCtx.arc(x, y, e.radius, 0, Math.PI * 2);
                    this.canvaCtx.fillStyle = `hsl(${e.hue}, 100%, ${e.luminosity}%)`;
                    this.canvaCtx.fill();
                    this.canvaCtx.globalAlpha = 1;
                }
            }
        });
    }
}
