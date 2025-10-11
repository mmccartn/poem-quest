import { ComponentFixture, TestBed } from '@angular/core/testing'
import { App } from './app'
import { provideRouter } from '@angular/router'

// Steps to provide a router to the testbed taken from:
// https://konadu.dev/how-to-fix-no-provider-for-activated-route-in-angular-testing

describe('App', () => {
  let component: App
  let fixture: ComponentFixture<App>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents()

    fixture = TestBed.createComponent(App)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(App)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
      expect(compiled.querySelector('h1')?.textContent).toContain('PoemQuest')
  })
})
