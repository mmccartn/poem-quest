import { ActivatedRoute, Router } from '@angular/router'
import { Component, inject, signal, computed } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Poem } from '../types/poem'
import { PoemEntry } from '../poem-entry/poem-entry'
import { PoemService } from '../poem.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

@Component({
  selector: 'app-home',
  imports: [PoemEntry, ReactiveFormsModule, MatAutocompleteModule],
  template: `
    <section class="search">
      <form [formGroup]="searchForm" (submit)="submitSearch()">
        <label for="author">Author:</label>
        <input id="author"
              type="text"
              placeholder="Name of author"
              matInput
              formControlName="author"
              [matAutocomplete]="autoAuthor">
        <mat-autocomplete autoActiveFirstOption #autoAuthor="matAutocomplete">
          @for (option of filteredAuthors(); track $index) {
            <mat-option [value]="option">{{ option }}</mat-option>
          }
        </mat-autocomplete>

        <label for="title">Title:</label>
        <input id="title" type="text" formControlName="title" placeholder="Poem title" />

        <label for="poem-count">Poem Count:</label>
        <input id="poem-count" type="number" formControlName="poemCount" />

        <button type="submit" class="primary">Search</button>
      </form>
    </section>
    <section class="results">
      @if (isLoading()) {
        <p class="loading">Loading poems...</p>
      } @else if (!poemList.length) {
        <p class="empty">No results loaded.</p>
      } @else {
        <div class="poem-list">
          @for (poem of poemList; track $index) {
            <app-poem-entry [poem]="poem" />
          }
        </div>
      }
    </section>
  `,
  styles: `
    .search {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }
    form {
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
      max-width: 100%;
    }
    label {
      font-size: 0.85rem;
      font-weight: bold;
      margin-right: 0.25rem;
      color: #333;
      align-self: center;
    }
    input {
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
    }
    button.primary {
      padding: 0.6rem 1.25rem;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      background: #0052cc;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    button.primary:hover {
      background: #003d99;
    }
    .results {
      margin-top: 2rem;
    }
    .poem-list {
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      background: #fff;
    }
    .empty {
      text-align: center;
    }
    .loading {
      text-align: center;
      font-style: italic;
    }
  `
})
export class Home {
  protected readonly route: ActivatedRoute = inject(ActivatedRoute)
  protected readonly router: Router = inject(Router)
  protected readonly poemService: PoemService = inject(PoemService)

  protected poemList: Poem[] = []

  protected readonly authorFormControl: FormControl = new FormControl<string>('')
  protected readonly searchForm = new FormGroup({
    author: this.authorFormControl,
    title: new FormControl<string>(''),
    poemCount: new FormControl<number>(0)
  })

  // Make a signal out of the author form for autocomplete reactivity
  protected readonly authorInput = toSignal(
    this.authorFormControl.valueChanges,
    { initialValue: this.authorFormControl.value }
  )

  protected authorNames = signal<string[]>([])

  // Filter the authorNames list by matching with the current author search term
  protected readonly filteredAuthors = computed(() => {
    const author = this.authorInput().toLowerCase()
    return this.authorNames().filter(name => name.toLowerCase().includes(author))
  })

  protected readonly isLoading = signal(false)

  protected async submitSearch() {
    this.isLoading.set(true)
    const author = this.searchForm.value.author ?? ''
    const title = this.searchForm.value.title ?? ''
    const poemCount = this.searchForm.value.poemCount ?? 0
    try {
      this.poemList = await this.poemService.getPoemsByAuthorTitle(author, title, poemCount)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          author: author || null,
          title: title || null,
          poemCount: poemCount || null
        },
        // replace the current url, don't merge a new one onto the navigation stack
        queryParamsHandling: 'replace',
        replaceUrl: true
      })
    } catch (err) {
      this.poemList = []
      console.error('Unable to fetch poem search results.', err)
    } finally {
      this.isLoading.set(false)
    }
  }

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const author = params.get('author') ?? ''
      const title = params.get('title') ?? ''
      const poemCountStr = params.get('poemCount') ?? '0'
      const poemCount = Number.isFinite(+Number(poemCountStr)) ? +Number(poemCountStr) : 0

      // Update all search form fields to match url query params,
      // but suppress events to avoid possible loops
      this.searchForm.patchValue({ author, title, poemCount }, { emitEvent: false })

      // Auto (re)fetch results if search terms were stored in the url
      if (author || title) {
        this.submitSearch()
      } else {
        this.poemList = []
      }
    })

    // Asynchronously fetch the full list of author names for auto-completion
    this.poemService.getAuthors().then(names => {
      this.authorNames.set(names)
    }).catch(err => {
      this.authorNames.set([])
      console.error('Unable to fetch author names.', err)
    })
  }
}
