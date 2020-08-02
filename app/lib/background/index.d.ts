import { Task as ImportStravaBackupTask } from './tasks/importStravaBackup'

export type Task = ImportStravaBackupTask

export interface BackgroundRunner {
  runTask(task: Task): Promise<void>
}
