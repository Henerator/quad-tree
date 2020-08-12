import { Point } from './helpers/classes/point';
import { Rect } from './helpers/classes/rect';
import { QuadTree } from './quad-tree/quad-tree';
import { RandomHelper } from './helpers/random/random.helper';


const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const context = <CanvasRenderingContext2D>canvas.getContext('2d');

const POINT_COUNT = 300;

let width: number;
let height: number;
let centerPoint: Point;

let quadTreeWidth: number;
let quadTree: QuadTree;

let points: Point[] = [];

const rangeRectWidth = 150;
let rangeRect = new Rect(0, 0, rangeRectWidth, rangeRectWidth);
let rangePoints: Point[];

start();

function start() {
    window.addEventListener('resize', update, false);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            update();
        }
    });
    update();

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        rangeRect = rangeRect.changePosition(
            event.clientX - centerPoint.x + quadTreeWidth / 2,
            event.clientY - centerPoint.y + quadTreeWidth / 2
        );
        rangePoints = quadTree.getRangePoints(rangeRect);
        draw();
    });
}

function update() {
    resizeCanvas();

    const rect = new Rect(0, 0, quadTreeWidth, quadTreeWidth);
    points = [];
    quadTree = new QuadTree(rect, 1);

    for (let index = 0; index < POINT_COUNT; index++) {
        const pt = new Point(RandomHelper.rangeInteger(0, quadTreeWidth), RandomHelper.rangeInteger(0, quadTreeWidth));
        points.push(pt);
        quadTree.insert(pt);
    }

    rangePoints = quadTree.getRangePoints(rangeRect);

    draw();
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    centerPoint = new Point(width / 2, height / 2);
    quadTreeWidth = Math.min(width, height) - 20;
}

function draw() {
    clear();

    const pt = centerPoint.add(new Point(-quadTreeWidth / 2, -quadTreeWidth / 2));
    context.save();
    context.translate(pt.x, pt.y);

    drawQuadTree();
    drawPoints();
    drawRange();
    drawRangePoints();
    
    context.restore();
}

function clear() {
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, height);
}

function drawQuadTree() {
    context.strokeStyle = '#f5f5f5';
    drawQuadTreeRecursive(quadTree);
}

function drawQuadTreeRecursive(tree: QuadTree) {
    const rect = tree.boundary;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (tree.tlChild) drawQuadTreeRecursive(tree.tlChild);
    if (tree.trChild) drawQuadTreeRecursive(tree.trChild);
    if (tree.blChild) drawQuadTreeRecursive(tree.blChild);
    if (tree.brChild) drawQuadTreeRecursive(tree.brChild);
}

function drawPoints() {
    context.fillStyle = '#3399ff';

    points.forEach(pt => {
        context.beginPath();
        context.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        context.fill();
    });
}

function drawRange() {
    context.strokeStyle = '#66ff66';
    context.lineWidth = 4;
    context.strokeRect(rangeRect.x, rangeRect.y, rangeRect.width, rangeRect.height);
}

function drawRangePoints() {
    context.fillStyle = '#66ff66';

    rangePoints.forEach(pt => {
        context.beginPath();
        context.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
        context.fill();
    });
}