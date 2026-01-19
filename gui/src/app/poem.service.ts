import { Injectable } from '@angular/core'
import { Poem } from './types/poem'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface PoetryErrorResponse {
  status: string
  reason: string
}

function isErrorResponse(resp: any): resp is PoetryErrorResponse {
  return typeof resp?.status === 'string' && typeof resp?.reason === 'string'
}

class InvalidResponseError extends Error {
  constructor(status: string, reason: string = '') {
    super(`${status} - ${reason}`)
  }
}

@Injectable({
  providedIn: 'root'
})
export class PoemService {
  protected readonly baseUrl: string = 'https://poetrydb.org/'
  protected readonly http: HttpClient

  constructor(httpClient: HttpClient) {
    this.http = httpClient
  }

  protected sanitizeString(term: string): string {
    return encodeURIComponent(term)
  }

  protected sanitizeNumber(term: number): number {
    return Math.min(Math.max(term, 0), 1000)
  }

  getPoemsByAuthorTitle(author: string, title: string, poemCount: number): Observable<Poem[]> {
    author = this.sanitizeString(author)
    title = this.sanitizeString(title)
    poemCount = this.sanitizeNumber(poemCount)
    const url = `${this.baseUrl}author,title,poemcount/${author};${title};${poemCount}/author,title,linecount`
    return this.http.get<PoetryErrorResponse | Poem[]>(url).pipe(
      map(resp => {
        if (isErrorResponse(resp)) {
          throw new InvalidResponseError(resp.status, resp.reason)
        }
        return resp ?? []
      })
    )
  }

  getPoemText(author: string, title: string): Observable<string[]> {
    author = this.sanitizeString(author)
    title = this.sanitizeString(title)
    const url = `${this.baseUrl}author,title,poemcount/${author};${title};1/lines`
    return this.http.get<PoetryErrorResponse | { lines: string[] }[]>(url).pipe(
      map(resp => {
        if (isErrorResponse(resp)) {
          throw new InvalidResponseError(resp.status, resp.reason)
        }
        return resp?.length ? resp[0].lines : []
      })
    )
  }

  getAuthors(): Observable<string[]> {
    const url = `${this.baseUrl}authors`
    return this.http.get<PoetryErrorResponse | { authors: string[] }>(url).pipe(
      map(resp => {
        if (isErrorResponse(resp)) {
          throw new InvalidResponseError(resp.status, resp.reason)
        }
        return resp.authors ?? []
      })
    )
  }
}
