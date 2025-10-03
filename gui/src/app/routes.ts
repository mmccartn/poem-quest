import { Routes } from '@angular/router'
import { Home } from './home/home'
import { PageNotFound } from './page-not-found/page-not-found'
import { PoemDetails } from './poem-details/poem-details'

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'PoemQuest'
  },
  {
    path: 'details/:author/:title',
    component: PoemDetails,
    title: 'Poem details'
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page not found'
  }
]
export default routeConfig
