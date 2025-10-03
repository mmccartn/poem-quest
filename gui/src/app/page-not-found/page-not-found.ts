import { Component } from '@angular/core'

@Component({
  selector: 'app-page-not-found',
  imports: [],
  template: `
    <section class="container">
      <strong class="message">
        This page does not exist
      </strong>
    </section>
  `,
  styles: `
    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
    }
    .message {
      font-size: 2rem;
      color: #666;
      text-align: center;
    }
  `
})
export class PageNotFound { }
