import { Component, inject } from '@angular/core'
import { PoemInfo } from '../models/poem-info'
import { PoemDetails } from '../poem-details/poem-details'
import { PoemService } from '../poem.service'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
    selector: 'app-poem-search',
    imports: [PoemDetails, ReactiveFormsModule],
    template: `
    <section class="search">
      <form [formGroup]="searchForm" (submit)="submitSearch()">
        <label for="author">Author: </label>
        <input id="author" type="text" formControlName="author" />
        <label for="title">Title: </label>
        <input id="title" type="text" formControlName="title" />
        <label for="poem-count">Poem Count: </label>
        <input id="poem-count" type="number" formControlName="poemCount" />
        <button type="submit" class="primary">Search</button>
      </form>
    </section>
    <section class="results">
      @if (poemList.length === 0) {
        <p>No results loaded.</p>
      } @else {
        @for(poem of poemList; track $index) {
          <app-poem-details [poem]="poem"></app-poem-details>
        }
      }
    </section>
  `,
    styles: `
    .search {
      font-size: 18pt;
      margin-bottom: 15px;
    }
    input {
      font-size: 16pt;
      margin-bottom: 15px;
      padding: 10px;
      width: 400px;
      border-top: none;
      border-right: none;
      border-left: none;
      border-bottom: solid .3px;
    }
    button {
      padding: 10px;
      border: solid 1px blue;
      background: blue;
      color: white;
      border-radius: 8px;
    }
    .results {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 50px;
      align-items: center;
    }
  `
})
export class PoemSearch {
    protected poemList: PoemInfo[] = []
    protected readonly poemService: PoemService = inject(PoemService)

    protected readonly searchForm = new FormGroup({
        author: new FormControl('Shakespeare'),
        title: new FormControl('Sonnet'),
        poemCount: new FormControl(10)
    })

    protected async submitSearch() {
        try {
            this.poemList = await this.poemService.getPoemsByAuthorTitle(
                this.searchForm.value.author ?? '',
                this.searchForm.value.title ?? '',
                this.searchForm.value.poemCount ?? 0
            )
        } catch (e) {
            this.poemList = []
            console.error(e)
        }
    }

}
