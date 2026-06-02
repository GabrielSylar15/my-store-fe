import { httpClient } from '@/core'

export interface UploadedFile {
  id: string
  name: string
  mime: string
  size: number
  height: number | null
  width: number | null
  duration: number | null
}

class FileService {
  async upload(file: File): Promise<UploadedFile> {
    const form = new FormData()
    form.append('file', file)
    const res = await httpClient.post('/api/v1/files', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 10_000,
    })
    return res.data
  }
}

export const fileService = new FileService()
