const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../midis');
const outputDir = path.join(__dirname, '../audio');
const soundfontPath = '/usr/share/soundfonts/FluidR3_GM.sf2';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);
const midiFiles = files.filter(f => f.endsWith('.mid') || f.endsWith('.midi'));

console.log(`Converting ${midiFiles.length} files`);

midiFiles.forEach(file => {
    const baseName = path.parse(file).name;
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `${baseName}.mp3`);
    const tempWav = path.join('/tmp', `${baseName}.wav`);

    if (fs.existsSync(outputPath)) {
        console.log(`Skipped ${file} (already there)`);
        return;
    }

    const command = `fluidsynth -ni -g 1.0 -F "${tempWav}" "${soundfontPath}" "${inputPath}" && ffmpeg -y -i "${tempWav}" -af "volume=2.0" -acodec libmp3lame -ab 192k "${outputPath}" && rm -f "${tempWav}"`;

    try {
        process.stdout.write(`  Converting ${file}`);
        execSync(command, { stdio: 'ignore' });
        console.log(' Ok');
    } catch (error) {
        console.log(' Not Ok');
        console.error(error);
    }
});

