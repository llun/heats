import { TaskName as ImportStravaBackupTask } from './tasks/importStravaBackup'

export type Task = {
  name: ImportStravaBackupTask
  data: any
}

export interface Background {
  runTask(task: Task): Promise<void>
}
