import { Activity, Point, Session, User } from '../types'

export interface Storage {
  addActivity(userId: number, activity: Activity): Promise<void>
  getActivities(userId: number): Promise<Activity[]>
  getPoints(userId: number): Promise<Point[]>
  getPointsBetweenDate(
    userId: number,
    from: number,
    to: number
  ): Promise<Point[]>

  getSession(key: string): Promise<Session | null>
  updateSession(key: string, data: any, userId?: number): Promise<void>
  destroySession(key: string): Promise<void>

  getUser(userId: number): Promise<User>
  authenticateUser(email: string, password: string): Promise<User | null>

  close(): Promise<void>
}

export const getStorage: () => Promise<Storage>
