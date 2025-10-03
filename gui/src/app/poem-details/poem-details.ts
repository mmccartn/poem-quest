import { ActivatedRoute } from '@angular/router'
import { Component, inject, signal } from '@angular/core'
import { PoemService } from '../poem.service'

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
            <p>{{ line }}</p>
          }
        }
      </section>
      <p class="line-count">Total lines: {{ this.lines().length }}</p>
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

  constructor() {
    this.author = this.route.snapshot.params['author']
    this.title = this.route.snapshot.params['title']

    this.isLoading.set(true)
    this.poemService.getPoemText(this.author, this.title).then(lines => {
      this.lines.set(lines)
    }).catch(err => {
      this.lines.set([])
      console.error('Unable to fetch poem.', err)
    }).finally(() => {
      this.isLoading.set(false)
    })
  }
}
