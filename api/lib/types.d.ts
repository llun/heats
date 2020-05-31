export type Point = {
  latitude: number,
  longitude: number,
  altitude: number
}

export type Activity = {
  startTime: number,
  points: Point[]
}

export type Parser = (buffer:Buffer) => Activity