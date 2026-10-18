import Ball from "./ball.js";
import { Camera } from "./camera.js";
import { songConfigs } from "./songConfigs.js";
import { createPlatforms } from "./platform.js";
import { detectMidiNotes, playMp3File } from "./soundExtractor.helper.js";
import { handleCollision, updateParticles } from "./particle.js";
const gravity = 750;
let lastTime = 0;
let beginTime = 0;
let firstFrame = true;
let playing = false;
function loop(ball, particles, platforms, camera, notesTime, currentNote, time) {
    if (firstFrame) {
        lastTime = time;
        beginTime = time;
        firstFrame = false;
    }
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    const trueTime = (time - beginTime) / 1000;
    if (trueTime >= notesTime[0]) {
        ball.move(gravity, dt);
        updateParticles(particles, dt);
        const entities = [...platforms, ...particles.flat(), ball];
        camera.refreshScreen();
        camera.draw(entities, ball.x, ball.y);
        const currentNoteTime = notesTime[currentNote];
        if (trueTime > currentNoteTime) {
            const platform = platforms[currentNote];
            ball.bounce(platform.ballTargetY, platform.ballVelY);
            let collideY = ball.y - ball.sizeY;
            if (platform.reversedBounce) {
                collideY = ball.y + ball.sizeY;
            }
            handleCollision(particles, ball.x, collideY, ball.velX, ball.velY, "#00b3ff", gravity);
            currentNote++;
        }
    }
    if (playing) {
        requestAnimationFrame((currentTime) => loop(ball, particles, platforms, camera, notesTime, currentNote, currentTime));
    }
}
function main() {
    let canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    const ball = new Ball(200, 0, 0.9, 10, "#00ffcc");
    const particles = [];
    const camera = new Camera(0, 0, 1, canvas, ctx, 0.05);
    const songSelector = document.getElementById('songSelector');
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Select a song";
    songSelector.appendChild(defaultOption);
    songConfigs.forEach((song, i) => {
        const optionElt = document.createElement("option");
        optionElt.textContent = song.name;
        optionElt.value = i.toString();
        songSelector.appendChild(optionElt);
    });
    songSelector.addEventListener('change', async (e) => {
        const option = e.target;
        const song = songConfigs[parseInt(option.value)];
        const midi = await (await fetch(`../midis/${song.file}.mid`)).arrayBuffer();
        const mp3 = await (await fetch(`../audio/${song.file}.mp3`)).blob();
        if (!midi)
            return;
        let notesTime = await detectMidiNotes(midi, song.tracks, 50);
        if (notesTime.length <= 0) {
            return;
        }
        const skipTime = notesTime[0] + (song.startTime ?? 0);
        notesTime = notesTime.map((v) => { return v - skipTime; }).filter((v) => { return v >= 0; });
        ball.resetPos();
        camera.resetPos();
        const platforms = createPlatforms(notesTime, gravity, ball);
        console.log("Notes Time : ", notesTime);
        console.log("Skip time :", skipTime);
        playing = false;
        setTimeout(() => {
            playing = true;
            firstFrame = true;
            playMp3File(mp3, skipTime);
            setTimeout(() => {
                requestAnimationFrame((currentTime) => loop(ball, particles, platforms, camera, notesTime, 0, currentTime));
            }, song.delay ?? 0);
        }, 200);
    });
}
main();
