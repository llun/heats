export type Point = {
  latitude: number
  longitude: number
  altitude: number
  timestamp: number
}

export type Activity = {
  name: string
  file?: string
  createdWith: string
  startedAt: number
  points: Point[]
}

export type Session = {
  key: string
  data: any
}

export type User = {
  id: number
  email: string
}

export type Parser = (buffer: Buffer, filename?: string) => Promise<Activity[]>
