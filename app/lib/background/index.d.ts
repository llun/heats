import { TaskName as ImportStravaBackupTask } from './tasks/importStravaBackup'

export type Task = {
  name: ImportStravaBackupTask
  data: any
}

export interface BackgroundRunner {
  runTask(task: Task): Promise<void>
}
