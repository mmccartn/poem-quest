import { Injectable } from '@angular/core'
import { PoemInfo } from './models/poem-info'

@Injectable({
  providedIn: 'root'
})
export class PoemService {
  protected readonly baseUrl: string = 'https://poetrydb.org/'

  protected sanitizeString(term: string): string {
    return term.replace(/\W/g, '')
  }

  protected sanitizeNumber(term: number): number {
    return Math.min(Math.max(term, 0), 1000)
  }

  async getPoemsByAuthorTitle(author: string, title: string, poemCount: number): Promise<PoemInfo[]> {
    author = this.sanitizeString(author)
    title = this.sanitizeString(title)
    poemCount = this.sanitizeNumber(poemCount)
    const data = await fetch(
      `${this.baseUrl}author,title,poemcount/${author};${title};${poemCount}`
    )
    if (data.status === 200) {
      return (await data.json()) ?? []
    } else {
      throw new Error(`Invalid response, code: ${data.status}`)
    }
  }

}
