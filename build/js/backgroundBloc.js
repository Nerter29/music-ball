import { entity, entityShape } from "./entity.js";
export class BackgroundBlock extends entity {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color, entityShape.RECTANGLE);
    }
}
export function createBackground(step, xStart, yStart, xFinish, yFinish) {
    const res = [];
    for (let x = xStart; x < xFinish; x += step) {
        for (let y = xStart; y < xFinish; y += step) {
            res.push(new BackgroundBlock(x, y, 10, 10, "#555555"));
        }
    }
    return res;
}
