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
          <p>Find poems in the PoetryDB</p>
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: `
    header {
      display: flex;
      height: 60px;
      padding: 30px;
      box-shadow: 0px 5px 5px #ddd;
      justify-content: space-between;
    }
    h1 {
      align-self: center;
    }
    p {
      align-self: flex-end;
      font-style: italic;
      color: #555;
    }
    .content {
      padding: 2rem;
    }
    a {
      text-decoration: none;
      color: black;
    }
  `
})
export class App { }
