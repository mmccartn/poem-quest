import { Routes } from '@angular/router'
import { Home } from './home/home'
import { PoemSearch } from './poem-search/poem-search'
import { PageNotFound } from './page-not-found/page-not-found'

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
  {
    path: '**',
    component: PageNotFound,
    title: 'Page Not Found'
  }
]
export default routeConfig
