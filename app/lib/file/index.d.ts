export interface FileLoader {
  save(buffer: Buffer, name: string): Promise<string | null>
  load(path: string): Promise<Buffer | null>
}

export const getFileLoader: () => FileLoader
