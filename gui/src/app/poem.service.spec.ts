import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { PoemService } from './poem.service'
import { of, throwError } from 'rxjs'
import { Poem } from './types/poem'

describe('PoemService', () => {
  let baseUrl: string
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let poemService: PoemService

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])
    poemService = new PoemService(httpClientSpy)
    baseUrl = 'https://poetrydb.org/'
  })

  it('should return expected poems', (done: DoneFn) => {
    const author = 'author-name'
    const title = 'title-name'
    const count = 10
    const expectedUrl = `${baseUrl}author,title,poemcount/${author};${title};${count}/author,title,linecount`

    const expectedPoems: Poem[] = [
      { title: `${title}_1`, author, linecount: '3' },
      { title: `${title}_2`, author, linecount: '2' }
    ]
    httpClientSpy.get.and.returnValue(of(expectedPoems))

    poemService.getPoemsByAuthorTitle(author, title, count).subscribe({
      next: poems => {
        expect(poems).toEqual(expectedPoems)
        expect(httpClientSpy.get).toHaveBeenCalledOnceWith(expectedUrl)
        done()
      },
      error: done.fail
    })
  })

  it('should return expected poem text', (done: DoneFn) => {
    const author = 'author-name'
    const title = 'title-name'
    const expectedUrl = `${baseUrl}author,title,poemcount/${author};${title};1/lines`

    const expectedText: string[] = ['line1', '', 'line3']
    httpClientSpy.get.and.returnValue(of([{ lines: expectedText }]))

    poemService.getPoemText(author, title).subscribe({
      next: lines => {
        expect(lines).toEqual(expectedText)
        expect(httpClientSpy.get).toHaveBeenCalledOnceWith(expectedUrl)
        done()
      },
      error: done.fail
    })
  })

  it('should return expected authors (HttpClient called once)', (done: DoneFn) => {
    const expectedAuthors: string[] = ['author1', 'author2']
    httpClientSpy.get.and.returnValue(of({ authors: expectedAuthors }))

    poemService.getAuthors().subscribe({
      next: authors => {
        expect(authors).toEqual(expectedAuthors)
        expect(httpClientSpy.get).toHaveBeenCalledOnceWith(`${baseUrl}authors`)
        done()
      },
      error: done.fail
    })
  })

  it('should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    })
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse))
    poemService.getAuthors().subscribe({
      next: authors => done.fail('expected an error, not authors'),
      error: error => {
        expect(error.error).toContain('test 404 error')
        done()
      }
    })
  })

})
