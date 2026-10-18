import { entity } from "./entity.js";
import { hexToHsl, randomWithOpposite } from "./utils.js";
export class Particle extends entity {
    x;
    y;
    speed;
    vx;
    vy;
    baseStartLife;
    lifeDiff;
    startLife;
    life;
    startRadius;
    radius;
    hue;
    saturation;
    luminosity;
    gravity;
    lifeProportion;
    constructor(x, y, angle, color, angleDiff, speed, speedDiff, gravity) {
        super(x, y, 1, 1, color);
        this.x = x;
        this.y = y;
        this.speed = speed + randomWithOpposite(speedDiff * speed);
        const randomAngle = angle + randomWithOpposite(angleDiff);
        this.vx = Math.cos(randomAngle) * this.speed;
        this.vy = Math.sin(randomAngle) * this.speed;
        this.baseStartLife = 2.5;
        this.lifeDiff = 0.4;
        this.startLife = this.baseStartLife + randomWithOpposite(this.baseStartLife * this.lifeDiff);
        this.life = this.startLife;
        const baseRadius = 1.5;
        const radiusDiff = 0.5;
        this.startRadius = baseRadius + randomWithOpposite(radiusDiff * baseRadius);
        this.radius = this.startRadius;
        const hueDiff = 10;
        const luminosityDiff = 10;
        const hsl = hexToHsl(color);
        this.hue = randomWithOpposite(hueDiff) + hsl[0];
        this.saturation = hsl[1];
        this.luminosity = randomWithOpposite(luminosityDiff) + hsl[2];
        const gravityDiff = 0.5;
        this.gravity = gravity + randomWithOpposite(gravityDiff * gravity);
        this.lifeProportion = 1;
    }
    update(dt) {
        if (this.life >= 0) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.vy -= this.gravity;
            this.life -= dt;
        }
        this.lifeProportion = Math.max(this.life / this.startLife, 0);
        this.radius = this.lifeProportion * this.startRadius;
    }
}
export function spawnParticlePatch(particles, x, y, angle, num, color, angleDiff, speed, speedDiff, gravity) {
    // Spawns num particles in a new patch of particles list
    var patchIndex = null;
    for (let i = 0; i < particles.length; i++) {
        // If we found a hole, we will fill it by replacing it with the new patch
        if (particles[i] == null) {
            patchIndex = i;
            particles[i] = [];
            break;
        }
    }
    // If we don't find any hole, we add a new patch slot to our list
    if (patchIndex == null) {
        particles.push([]);
        patchIndex = particles.length - 1;
    }
    let particleMaxLife = 0;
    for (let i = 0; i < num; i++) {
        const p = new Particle(x, y, angle, color, angleDiff, speed, speedDiff, gravity);
        particles[patchIndex].push(p);
        particleMaxLife = p.baseStartLife + p.lifeDiff;
    }
    // We say now to delete the patch when every particles will be dead, in particleMaxLife milliseconds.
    setTimeout(() => {
        if (patchIndex !== null) {
            particles[patchIndex] = null;
        }
    }, particleMaxLife * 1000);
}
export function updateParticles(particles, dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const patch = particles[i];
        if (patch != null) {
            for (let j = 0; j < patch.length; j++) {
                const particle = patch[j];
                particle.update(dt);
            }
        }
    }
}
export function handleCollision(particles, x, y, vx, vy, color, gravity) {
    const num = 10;
    const angleDiff = Math.PI / 2;
    const speed = 100;
    const speedDiff = 0.2;
    const angle = Math.atan2(vy, vx);
    spawnParticlePatch(particles, x, y, angle, num, color, angleDiff, speed, speedDiff, gravity * 0.003);
}
