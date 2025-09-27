import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header>
          <h1>PoemQuest</h1>
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: `
    header {
      display: block;
      height: 60px;
      padding: 10px;
      box-shadow: 0px 5px 5px grey;
    }
    .content {
      padding: 10px;
    }
  `
})
export class App {

}
