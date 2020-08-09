import { Task as ImportStravaBackupTask } from './tasks/importStravaBackup'
import { Task as GenerateHeatMapTask } from './tasks/generateHeatMap'

export type Task = ImportStravaBackupTask | GenerateHeatMapTask

export interface BackgroundRunner {
  runTask(task: Task): Promise<void>
}

export const getBackgroundRunner: () => BackgroundRunner
