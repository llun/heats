import { Activity } from '../types'

export interface Storage {
  addActivity(person: number, activity: Activity): Promise<void>
}
