import { Component, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Poem } from '../types/poem'
import { PoemEntry } from '../poem-entry/poem-entry'
import { PoemService } from '../poem.service'

const DEFAULT_AUTHOR = 'Shakespeare'
const DEFAULT_TITLE = 'Sonnet'
const DEFAULT_POEM_COUNT = 100

@Component({
  selector: 'app-home',
  imports: [PoemEntry, ReactiveFormsModule],
  template: `
    <section class="search">
      <form [formGroup]="searchForm" (submit)="submitSearch()">
        <label for="author">Author:</label>
        <input id="author" type="text" formControlName="author" placeholder="name of author" />

        <label for="title">Title:</label>
        <input id="title" type="text" formControlName="title" placeholder="poem title" />

        <label for="poem-count">Poem Count:</label>
        <input id="poem-count" type="number" formControlName="poemCount" />

        <button type="submit" class="primary">Search</button>
      </form>
    </section>
    <section class="results">
      @if (!poemList.length) {
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
      color: #666;
      padding: 2rem 0;
    }
  `
})
export class Home {
  protected poemList: Poem[] = []
  protected readonly poemService: PoemService = inject(PoemService)

  protected readonly searchForm = new FormGroup({
    author: new FormControl(DEFAULT_AUTHOR),
    title: new FormControl(DEFAULT_TITLE),
    poemCount: new FormControl(DEFAULT_POEM_COUNT)
  })

  protected async submitSearch() {
    try {
      this.poemList = await this.poemService.getPoemsByAuthorTitle(
        this.searchForm.value.author ?? '',
        this.searchForm.value.title ?? '',
        this.searchForm.value.poemCount ?? 0
      )
    } catch (err) {
      this.poemList = []
      console.error(err)
    }
  }
}
