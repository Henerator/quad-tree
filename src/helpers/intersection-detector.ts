import { Point } from './classes/point';
import { Rect } from './classes/rect';


export class IntersectionDetector {
    static PointToRect(pt: Point, rect: Rect): boolean {
        return pt.x >= rect.x
            && pt.x <= rect.right
            && pt.y >= rect.y
            && pt.y <= rect.bottom;
    }

    static RectToRect(rectA: Rect, rectB:  Rect): boolean {
        if (rectA.right >= rectB.x &&
            rectA.x <= rectB.right &&
            rectA.bottom >= rectB.y &&
            rectA.y <= rectB.bottom
        ) {
            return true;
        }
        return false;
    }
}