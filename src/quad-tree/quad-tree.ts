import { Point } from '../helpers/classes/point';
import { Rect } from '../helpers/classes/rect';
import { IntersectionDetector } from '../helpers/intersection-detector';


export class QuadTree {
    public tlChild: QuadTree;
    public trChild: QuadTree;
    public blChild: QuadTree;
    public brChild: QuadTree;

    private isSplitted: boolean;
    private points: Point[] = [];

    constructor(public boundary: Rect, private capacity: number) {
    }

    insert(pt: Point): boolean {
        if (!IntersectionDetector.PointToRect(pt, this.boundary)) {
            return false;
        }

        if (this.capacity > this.points.length) {
            this.points.push(pt);
            return true;
        }

        if (!this.isSplitted) {
            this.split();
        }

        if (this.tlChild.insert(pt)) return true;
        if (this.trChild.insert(pt)) return true;
        if (this.blChild.insert(pt)) return true;
        if (this.brChild.insert(pt)) return true;
    }

    getRangePoints(range: Rect, rangePoints: Point[] = []): Point[] {
        if (!IntersectionDetector.RectToRect(this.boundary, range)) {
            return rangePoints;
        }

        this.points.forEach(pt => {
            if (IntersectionDetector.PointToRect(pt, range)) {
                rangePoints.push(pt);
            }
        });

        if (!this.isSplitted) {
            return rangePoints;
        }

        this.tlChild.getRangePoints(range, rangePoints);
        this.trChild.getRangePoints(range, rangePoints);
        this.blChild.getRangePoints(range, rangePoints);
        this.brChild.getRangePoints(range, rangePoints);

        return rangePoints;
    }

    private split() {
        this.tlChild = new QuadTree(this.boundary.changeSize(1 / 2, 1 / 2), this.capacity);

        const trChildRect = this.boundary
            .changePosition(this.boundary.x + this.boundary.width / 2, this.boundary.y)
            .changeSize(1 / 2, 1 / 2);
        this.trChild = new QuadTree(trChildRect, this.capacity);

        const blChildRect = this.boundary
            .changePosition(this.boundary.x, this.boundary.y + this.boundary.height / 2)
            .changeSize(1 / 2, 1 / 2);
        this.blChild = new QuadTree(blChildRect, this.capacity);

        const brChildRect = this.boundary
            .changePosition(this.boundary.x + this.boundary.width / 2, this.boundary.y + this.boundary.height / 2)
            .changeSize(1 / 2, 1 / 2);
        this.brChild = new QuadTree(brChildRect, this.capacity);

        this.isSplitted = true;
    }
}