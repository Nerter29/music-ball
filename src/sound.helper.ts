
import { Midi } from '@tonejs/midi';

export async function detectMidiNotes(
    arrayBuffer: ArrayBuffer,
    trackIndexes: number[] | undefined,
    minNoteTimeMs : number
): Promise<number[]> {
    
    const midi = new Midi(arrayBuffer);

    const rawNotes: number[] = [];

    const tracksToAnalyze = trackIndexes !== undefined
        ? [trackIndexes].flat().map(idx => midi.tracks[idx]).filter(Boolean)
        : midi.tracks;

    console.log("Tracks : ", midi.tracks);
    for (const track of tracksToAnalyze) {
        for (const note of track.notes) {
            rawNotes.push(Number(note.time.toFixed(3)));
        }
    }

    if (rawNotes.length === 0) return [];

    rawNotes.sort((a, b) => a - b);

    const uniqueOnsets: number[] = [Number(rawNotes[0])];
    const minDistanceSec = minNoteTimeMs / 1000;
    for (let i = 1; i < rawNotes.length; i++) {
        const currentTime = rawNotes[i];
        const lastTime = uniqueOnsets[uniqueOnsets.length - 1];

        if (currentTime - lastTime >= minDistanceSec) {
            uniqueOnsets.push(Number(currentTime));
        }
    }

    return uniqueOnsets;
}

let audioElement: HTMLAudioElement | null = null;

export function playMp3File(file: Blob, skipTime : number) {
  
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement = null;
    }

    const audioUrl = URL.createObjectURL(file);

    audioElement = new Audio(audioUrl);
    if (skipTime > 0) {
      audioElement.currentTime = skipTime;
    }
    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
      audioElement = null;
    };

    audioElement.play()

}