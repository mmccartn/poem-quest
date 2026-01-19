import { ActivatedRoute } from '@angular/router'
import { Component, inject, signal, computed } from '@angular/core'
import { PoemService } from '../poem.service'
import { finalize } from 'rxjs/operators'

@Component({
  selector: 'app-poem-details',
  imports: [],
  template: `
    <article class="poem">
      <h2 class="title">{{ title }}</h2>
      <p class="author">By: {{ author }}</p>
      <section class="text">
        @if (isLoading()) {
          <p class="loading">Loading poem...</p>
        } @else {
          @for (line of lines(); track $index) {
            @if (line) {
              <p>{{ line }}</p>
            } @else {
              <br>
            }
          }
        }
      </section>
      <p class="line-count">Total lines: {{ lineCount() }}</p>
    </article>
  `,
  styles: `
    .poem {
      max-width: 700px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 12px;
      line-height: 1.5;
    }
    .title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .author {
      text-align: center;
      font-style: italic;
      font-size: 1rem;
      color: #555;
      margin-bottom: 1.5rem;
    }
    .text {
      margin-bottom: 1rem;
    }
    .text p {
      margin: 0.25rem 0;
      text-indent: 1.25rem;
    }
    .loading {
      text-align: center;
      font-style: italic;
    }
    .line-count {
      text-align: right;
      font-size: 0.85rem;
      color: #777;
    }
  `
})
export class PoemDetails {
  protected readonly route: ActivatedRoute = inject(ActivatedRoute)
  protected readonly poemService: PoemService = inject(PoemService)

  protected readonly author: string
  protected readonly title: string

  protected readonly lines = signal<string[]>([])
  protected readonly isLoading = signal(false)

  protected readonly lineCount = computed(() => {
    return this.lines().reduce((cnt, line) => line ? cnt + 1 : cnt, 0)
  })

  constructor() {
    this.author = this.route.snapshot.params['author']
    this.title = this.route.snapshot.params['title']

    this.isLoading.set(true)
    this.poemService.getPoemText(this.author, this.title)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: lines => this.lines.set(lines),
        error: err => {
          this.lines.set([])
          console.error('Unable to fetch poem.', err)
        }
    })
  }
}
