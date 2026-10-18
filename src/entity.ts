export abstract class entity{
    x : number;
    y : number;
    sizeX : number;
    sizeY: number;
    color : string
    
    constructor(x : number, y : number, sizeX : number, sizeY : number, color : string){
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.color = color;
    }
}