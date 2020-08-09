export type FileType = 'import' | 'heatimage'

export interface FileLoader {
  save(buffer: Buffer, type: FileType, name: string): Promise<string | null>
  load(path: string): Promise<Buffer | null>
}

export const getFileLoader: () => FileLoader
