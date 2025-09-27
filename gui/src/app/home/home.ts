import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <ul class="choices">
      <li><a [routerLink]="['/poems']">Cick here to search poems by title and author name.</a></li>
    </ul>
  `,
  styles: `
    .choices {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 50px;
      align-items: center;
      font-size: 16pt;
    }
  `
})
export class Home {

}
