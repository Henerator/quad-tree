export class RandomHelper {
    static range(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    static rangeInteger(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    }
}