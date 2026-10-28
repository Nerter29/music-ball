export function lerp(origin: number, destination: number, time: number): number {
    return origin + (destination - origin) * time;
}

// I didn't write that
export function hexToHsl(hex: string): [number, number, number] {
    hex = hex.replace("#", "");

    let r = parseInt(hex.substr(0, 2), 16) / 255;
    let g = parseInt(hex.substr(2, 2), 16) / 255;
    let b = parseInt(hex.substr(4, 2), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number = 0, s: number = 0, l: number = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

export function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomWithOpposite(n: number): number {
    return randomInRange(-n, n);
}

export function getColorFromHSL(h : number, s : number, l : number){
    return  `hsl(${h}, ${s}%, ${l}%)`;    
}