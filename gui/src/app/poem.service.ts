import { Injectable } from '@angular/core'
import { Poem } from './types/poem'

class InvalidResponseError extends Error {
  constructor(status: number, reason: string) {
    super(`${status} - ${reason}`)
  }
}

@Injectable({
  providedIn: 'root'
})
export class PoemService {
  protected readonly baseUrl: string = 'https://poetrydb.org/'

  protected sanitizeString(term: string): string {
    return encodeURIComponent(term)
  }

  protected sanitizeNumber(term: number): number {
    return Math.min(Math.max(term, 0), 1000)
  }

  async getPoemsByAuthorTitle(author: string, title: string, poemCount: number): Promise<Poem[]> {
    author = this.sanitizeString(author)
    title = this.sanitizeString(title)
    poemCount = this.sanitizeNumber(poemCount)
    const resp = await fetch(
      `${this.baseUrl}author,title,poemcount/${author};${title};${poemCount}/author,title,linecount`
    )
    if (resp.status !== 200) {
      throw new InvalidResponseError(resp.status, resp.statusText)
    }
    const json = await resp.json()
    if (json.status) {
      throw new InvalidResponseError(json.status, json.reason)
    }
    return json ?? []
  }

  // Fetch all lines of the first poem found for a given author and title
  async getPoemText(author: string, title: string): Promise<string[]> {
    author = this.sanitizeString(author)
    title = this.sanitizeString(title)
    const url = `${this.baseUrl}author,title,poemcount/${author};${title};1/lines`
    const resp = await fetch(url)
    if (resp.status !== 200) {
      throw new InvalidResponseError(resp.status, resp.statusText)
    }
    const json = await resp.json()
    if (json.status) {
      throw new InvalidResponseError(json.status, json.reason)
    }
    return json?.length ? json[0].lines : []
  }

  // Fetch all authors
  async getAuthors(): Promise<string[]> {
    const resp = await fetch(`${this.baseUrl}author`)
    if (resp.status !== 200) {
      throw new InvalidResponseError(resp.status, resp.statusText)
    }
    const json = await resp.json()
    if (json.status) {
      throw new InvalidResponseError(json.status, json.reason)
    }
    return json?.authors ?? []
  }
}
