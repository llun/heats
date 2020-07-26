import Router, { RouterContext } from '@koa/router'
import { DefaultContext } from 'koa'
import { File } from 'multiparty'

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
  key: string
  email: string
}

export type Parser = (buffer: Buffer, filename?: string) => Promise<Activity[]>

type FlashType =
  | 'alert-primary'
  | 'alert-secondary'
  | 'alert-success'
  | 'alert-danger'
  | 'alert-warning'
  | 'alert-info'
  | 'alert-light'
  | 'alert-dark'
export type AppContext = RouterContext & {
  flash: (type: FlashType, message: string) => void
  files?: {
    [key in string]: File[]
  }
}

export type AppRouter = Router<
  any,
  DefaultContext & {
    flash: (type: FlashType, message: string) => void
    logout: () => Promise<void>
    files?: {
      [key in string]: File[]
    }
  }
>
