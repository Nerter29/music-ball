export type songConfig = {
    name : string,
    file : string,
    delay ?: number,
    tracks ?: number[],
    startTime ?: number
}

export const songConfigs : songConfig[] = [
    {
        name: "Dreiton",
        file: "dreiton",
        startTime: 150,
        tracks: [0, 6]
    },
    {
        name: "Claire de Lune",
        file : "claire-de-lune",
        startTime: 0,
    },
    {
        name: "Merry Go Round of Life",
        file : "merry",
        startTime: 50,
    },
    {
        name: "Sweden",
        file : "sweden",
        startTime: 0,
    },
    {
        name: "Kass Theme",
        file : "kasstheme",
        startTime: 0,
        tracks: [0]
    },
    {
        name: "Aria Math",
        file : "aria-math",
        startTime: 50,
        tracks: [13, 14]
    },
    {
        name: "Nocturne",
        file : "nocturne",
        startTime: 0,
        tracks: [1]
    },
    {
        name: "Mice On Venus",
        file : "mice-on-venus",
        startTime: 0
    },
    {
        name: "Dry hands",
        file : "dry-hands",
        startTime: 0
    },
    {
        name: "Gravity Falls",
        file : "gravity-falls",
        tracks: [6, 3]
    },

]