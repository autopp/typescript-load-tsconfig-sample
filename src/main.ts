import { Point } from "@/point"

function dist(p: Point, q: Point): number {
  return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2))
}

const p = new Point(1, 2)
const q = new Point(4, 6)
console.log(dist(p, q))
