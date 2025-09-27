import { Routes } from '@angular/router'
import { Home } from './home/home'
import { PoemSearch } from './poem-search/poem-search'

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page'
  },
  {
    path: 'poems',
    component: PoemSearch,
    title: 'Poem Search'
  },
  }
]
export default routeConfig
