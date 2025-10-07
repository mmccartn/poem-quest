import { Component, input, output } from '@angular/core'
import { Poem } from '../types/poem'

@Component({
  selector: 'app-poem-entry',
  imports: [],
  template: `
    <article class="poem">
      <div class="info">
        <h3 class="title" (click)="toggle.emit()">
          {{ poem().title }}
        </h3>
        <p class="author">{{ poem().author }}</p>
      </div>
      <span class="line-count">{{ poem().linecount }} lines</span>
    </article>
  `,
  styles: `
    .poem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
      font-family: Georgia, "Times New Roman", serif;
      width: 100%;
      box-sizing: border-box;
    }
    .info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: #222;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
    }
    .author {
      font-size: 0.85rem;
      color: #555;
      margin: 0.25rem 0 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .line-count {
      font-size: 0.85rem;
      color: #777;
      white-space: nowrap;
      margin-left: 1rem;
      flex-shrink: 0;
    }
  `
})
export class PoemEntry {
  readonly poem = input.required<Poem>()
  protected readonly toggle = output()
}
