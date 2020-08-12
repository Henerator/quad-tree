export class Rect {
    get right(): number {
        return this.x + this.width;
    }

    get bottom(): number {
        return this.y + this.height;
    }

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {
    }

    changePosition(x: number, y: number): Rect {
        return new Rect(x, y, this.width, this.height);
    }

    changeSize(widthRatio: number, heightRatio: number): Rect {
        return new Rect(this.x, this.y, this.width * widthRatio, this.height * heightRatio);
    }
}