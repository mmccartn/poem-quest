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

  protected readonly authorFormControl: FormControl
  protected readonly searchForm

  protected readonly authorInput

  protected authorNames = signal<string[]>([])

  // Filter the authorNames list by matching with the current author search term
  protected readonly filteredAuthors = computed(() => {
    const author = this.authorInput().toLowerCase()
    return this.authorNames().filter(name => name.toLowerCase().includes(author))
  })

  protected readonly isLoading = signal(false)

  protected updateRoute(author: string, title: string, poemCount: number) {
    const queryParams: Record<string, string> = {}
    if (author) {
      queryParams['author'] = author
    }
    if (title) {
      queryParams['title'] = title
    }
    if (poemCount) {
      queryParams['poemCount'] = String(poemCount)
    }
    this.router.navigate(['/'], { queryParams })
  }

  protected async submitSearch() {
    this.isLoading.set(true)
    const author = this.searchForm.value.author ?? ''
    const title = this.searchForm.value.title ?? ''
    const poemCount = this.searchForm.value.poemCount ?? 0
    try {
      this.poemList = await this.poemService.getPoemsByAuthorTitle(author, title, poemCount)
    } catch (err) {
      this.poemList = []
      console.error('Unable to fetch poem search results.', err)
    } finally {
      this.updateRoute(author, title, poemCount)
      this.isLoading.set(false)
    }
  }

  constructor() {
    // Capture any optional search terms stored in query params
    const author = this.route.snapshot.queryParamMap.get('author') ?? ''
    const title = this.route.snapshot.queryParamMap.get('title') ?? ''
    const poemCountStr = this.route.snapshot.queryParamMap.get('poemCount') ?? '0'
    const poemCount = Number.isFinite(Number(poemCountStr)) ? Number(poemCountStr) : 0

    // Initialize the search input forms
    this.authorFormControl = new FormControl<string>(author)
    this.searchForm = new FormGroup({
      author: this.authorFormControl,
      title: new FormControl<string>(title),
      poemCount: new FormControl<number>(poemCount)
    })

    // Make a signal out of the author form autocomplete reactivity
    this.authorInput = toSignal(
      this.authorFormControl.valueChanges,
      { initialValue: this.authorFormControl.value }
    )

    // Asnycronously fetch the full list of author names for auto-completion
    this.poemService.getAuthors().then(names => {
      this.authorNames.set(names)
    }).catch(err => {
      this.authorNames.set([])
      console.error('Unable to fetch author names.', err)
    })

    // Fetch results if search terms were stored in the url
    if (author || title) {
      this.submitSearch()
    }
  }
}
