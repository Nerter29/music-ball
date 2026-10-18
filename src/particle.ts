import { entity } from "./entity.js";
import { hexToHsl, randomInRange, randomWithOpposite } from "./utils.js";

export type ParticleDirection = -1 | 1;

export class Particle extends entity{
    x: number;
    y: number;
    speed: number;
    vx: number;
    vy: number;
    baseStartLife: number;
    lifeDiff : number;
    startLife: number;
    life: number;
    startRadius: number;
    radius: number;
    hue: number;
    saturation: number;
    luminosity: number;
    gravity: number;
    lifeProportion : number

    constructor(x: number, y: number, angle: number, color: string, angleDiff: number, 
    speed: number, speedDiff: number, gravity : number) {
        
        super(x, y, 1, 1, color)
        this.x = x;
        this.y = y;

        this.speed = speed + randomWithOpposite(speedDiff * speed);

        const randomAngle = angle + randomWithOpposite(angleDiff);
        this.vx = Math.cos(randomAngle) * this.speed;
        this.vy = Math.sin(randomAngle) * this.speed;

        this.baseStartLife = 2.5
        this.lifeDiff = 0.4;
        this.startLife = this.baseStartLife + randomWithOpposite(this.baseStartLife * this.lifeDiff);
        this.life = this.startLife;

        const baseRadius = 1.5;
        const radiusDiff = 0.5;
        this.startRadius = baseRadius+ randomWithOpposite(radiusDiff * baseRadius);

        this.radius = this.startRadius;

        const hueDiff = 10;
        const luminosityDiff = 10;

        const hsl = hexToHsl(color);
        this.hue = randomWithOpposite(hueDiff) + hsl[0];
        this.saturation = hsl[1];
        this.luminosity = randomWithOpposite(luminosityDiff) + hsl[2];

        const gravityDiff = 0.5
        this.gravity = gravity + randomWithOpposite(gravityDiff * gravity);

        this.lifeProportion = 1;
    }

    update(dt: number): void {
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

export function spawnParticlePatch( particles: (Particle[] | null)[], x: number, y: number, angle: number, num: number, color: string,
    angleDiff: number, speed: number, speedDiff: number, gravity: number): void {
    // Spawns num particles in a new patch of particles list
    var patchIndex: number | null = null;
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
        (particles[patchIndex] as Particle[]).push(p);
        particleMaxLife = p.baseStartLife + p.lifeDiff;
    }
    
    // We say now to delete the patch when every particles will be dead, in particleMaxLife milliseconds.
    setTimeout(() => {
        if (patchIndex !== null) {
            particles[patchIndex] = null;
        }
    }, particleMaxLife * 1000);
}

export function updateParticles(particles: Particle[][], dt: number): void {
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

export function handleCollision(
    particles: (Particle[] | null)[],
    x: number,
    y: number,
    vx : number,
    vy : number,
    color :string,
    gravity : number
): void {
    const num = 10;
    const angleDiff = Math.PI / 2;
    const speed = 100;
    const speedDiff = 0.2;

    const angle = Math.atan2(vy, vx);

    spawnParticlePatch(particles, x, y, angle, num, color, angleDiff, speed, speedDiff, gravity * 0.003);
}