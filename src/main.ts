import Ball from "./ball.js";
import { Camera } from "./camera.js";
import { songConfigs } from "./songConfigs.js";
import { entity } from "./entity.js";
import { createPlatforms, Platform } from "./platform.js";
import { detectMidiNotes, playMp3File, stopAudio } from "./sound.helper.js"
import { handleCollision, Particle, updateParticles } from "./particle.js";
import { getColorFromHSL } from "./utils.js";

const commonLuminosity = 65;
const hueSpeed = 10;

const gravity = 750;
let lastTime = 0;
let beginTime = 0;

let firstFrame = true;

let playing = false;

function loop(ball : Ball, particles : Particle[][], platforms : Platform[], camera : Camera, notesTime : number[], currentNote : number,
    canvas : HTMLCanvasElement, time: number){
    if(firstFrame){
        lastTime = time;
        beginTime = time;
        firstFrame = false
    }
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    const trueTime = (time - beginTime) / 1000;

    ball.move(trueTime, gravity);
    updateParticles(particles, dt)

    const entities : entity[] = [...platforms, ...particles.flat(),ball];

    camera.refreshScreen();
    camera.draw(entities, ball.x, ball.y, dt);

    const currentNoteTime = notesTime[currentNote];
    if(trueTime > currentNoteTime){
        const platform = platforms[currentNote]
        platform.updating = true;
        const mainColor = platform.fullyUpdatedColor
        ball.bounce(platform.ballTargetY, platform.ballVelY, trueTime);
        ball.color = mainColor

        let collideY = ball.y - ball.sizeY;
        if(platform.reversedBounce){
            collideY = ball.y + ball.sizeY;
        }
        handleCollision(particles, ball.x, collideY, ball.velX, ball.bounceVelY, platform.hue, commonLuminosity, gravity)
        currentNote++;
    }

    platforms.forEach((p) => {
        p.updateColor(dt);
    })
    
    if(playing){
        requestAnimationFrame((currentTime) => loop(ball, particles, platforms, camera, notesTime, currentNote, canvas, currentTime));
    }
}

function main(){

    let canvas = document.getElementById("mainCanvas") as HTMLCanvasElement
    let ctx = canvas.getContext("2d");
    if(!ctx){
        return;
    }

    const mainColor = getColorFromHSL(0, 100, commonLuminosity);
    
    const ball = new Ball(200, 0, 0.9, 8, mainColor, 5, 0.3);
    const particles : Particle[][] = [];
    const camera = new Camera(0, 0, 1, canvas, ctx, 5);

    const songSelector = document.getElementById('songSelector') as HTMLInputElement;
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Select a song";
    songSelector.appendChild(defaultOption);

    songConfigs.forEach((song, i) =>{
        const optionElt = document.createElement("option")
        optionElt.textContent = song.name;
        optionElt.value = i.toString();
        songSelector.appendChild(optionElt);
    });

    songSelector.addEventListener('change', async (e) => {
        const option = (e.target as HTMLOptionElement)
        const song = songConfigs[parseInt(option.value)];

        const midi = await (await fetch(`../midis/${song.file}.mid`)).arrayBuffer();
        const mp3 = await (await fetch(`../audio/${song.file}.mp3`)).blob();
        if (!midi) return;

        let notesTime = await detectMidiNotes(midi, song.tracks, 50);
        if(notesTime.length <= 0){
            return;
        }
        const preSongTime = 2;

        let skipTime = notesTime[0] + (song.startTime ?? 0);
        notesTime = notesTime.map((v) => {return v - skipTime}).filter((v) => {return v >= 0});
        skipTime += notesTime[0];
        const leakingTime =  notesTime[0]
        notesTime = notesTime.map((v) => v - leakingTime + preSongTime);
        
        ball.resetPos();
        camera.x = ball.x;
        camera.y = ball.y;

        const platforms : Platform[] = createPlatforms(notesTime, preSongTime, gravity, ball, 20,
        commonLuminosity, hueSpeed);

        console.log("Notes Time : ", notesTime);
        console.log("Skip time :", skipTime);
        playing = false;
        setTimeout(() =>{
            playing = true;
            firstFrame = true;
            stopAudio();
            setTimeout(() => {
                playMp3File(mp3, skipTime);
            }, preSongTime * 1000)
            setTimeout(() => {
                requestAnimationFrame((currentTime) => loop(ball, particles, platforms, camera, notesTime, 0, canvas, currentTime));
            }, song.delay ?? 150);
        }, 200);

    });
}

main();
