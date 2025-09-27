import { Component, input } from '@angular/core'
import { PoemInfo } from '../models/poem-info'

@Component({
  selector: 'app-poem-details',
  imports: [],
  template: `
    <article class="poem">
      <h2 class="title">{{ poem().title }}</h2>
      <p class="author">By: {{ poem().author }}</p>
      <section class="text">
        @for(line of poem().lines; track $index) {
          <p>{{ line }}</p>
        }
      </section>
      <p class="line-count">Total lines: {{ poem().linecount }}</p>
    </article>
  `,
  styles: `
    .poem {
      width: 600px;
      padding: 20px;
      border: 1px solid black;
      border-radius: 8px;
      line-height: 1.5;
    }
    .title {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin: 0;
      margin-bottom: 20px;
    }
    .author {
      font-style: italic;
      font-size: 13pt;
      color: darkbrown;
      margin-bottom: 10px;
    }
    .text {
      margin-bottom: 5px;
      text-indent: 15px;
    }
    .line-count {
      text-align: right;
      font-size: 11pt;
      color: grey;
    }
  `
})
export class PoemDetails {
  public poem = input.required<PoemInfo>()
}
