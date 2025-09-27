import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  template: `
    <strong class="message">
      This page does not exist
    </strong>
  `,
  styles: `
    .message {
      display: flex;
      justify-content: center;
      margin-top: 100px;
    }
  `
})
export class PageNotFound {

}
