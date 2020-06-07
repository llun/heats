import { Activity, Point } from '../types'

export interface Storage {
  addActivity(userId: number, activity: Activity): Promise<void>
  getActivities(userId: number): Promise<Activity[]>
  getPoints(userId: number): Promise<Point[]>
  getPointsBetweenDate(
    userId: number,
    from: number,
    to: number
  ): Promise<Point[]>
  close(): Promise<void>
}
