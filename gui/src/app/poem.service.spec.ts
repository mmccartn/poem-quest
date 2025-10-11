import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { PoemService } from './poem.service'
import { of, throwError } from 'rxjs'

describe('PoemService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let poemService: PoemService

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])
    poemService = new PoemService(httpClientSpy)
  })

  it('should return expected authors (HttpClient called once)', (done: DoneFn) => {
    const expectedAuthors: string[] = ['foo', 'bar']
    httpClientSpy.get.and.returnValue(of({ authors: expectedAuthors }))
    poemService.getAuthors().subscribe({
      next: authors => {
        expect(authors).withContext('expected authors').toEqual(expectedAuthors)
        done()
      },
      error: done.fail
    })
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1)
  })

  it('should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse))
    poemService.getAuthors().subscribe({
      next: authors => done.fail('expected an error, not authors'),
      error: (error) => {
        expect(error.error).toContain('test 404 error')
        done()
      }
    })
  })

})
