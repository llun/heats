import { Activity, Point, Session, User } from '../types'

type StoredUser = User & {
  salt: string
  hash: string

  createdAt: number
  updatedAt: number
  deletedAt: number | null
}

export interface Storage {
  addActivity(userKey: string, activity: Activity): Promise<void>
  // getActivities(userId: number): Promise<Activity[]>
  getPoints(userKey: string): Promise<Point[]>
  // getPointsBetweenDate(
  //   userId: number,
  //   from: number,
  //   to: number
  // ): Promise<Point[]>

  getSession(key: string): Promise<Session | null>
  updateSession(key: string, data: any): Promise<void>
  destroySession(key: string): Promise<void>

  getUserByKey(key: string): Promise<StoredUser | null>
  getUserByEmail(email: string): Promise<StoredUser | null>
  createUser(
    email: string,
    salt: string,
    hash: string
  ): Promise<StoredUser | null>

  close(): Promise<void>
}

export const getStorage: () => Promise<Storage>
