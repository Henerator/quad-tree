export class Point {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) {
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

    add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    mul(point: Point): Point {
        return new Point(this.x * point.x, this.y * point.y);
    }
}