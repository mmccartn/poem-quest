import { Routes } from '@angular/router'
import { Home } from './home/home'
import { PageNotFound } from './page-not-found/page-not-found'

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'PoemQuest'
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page not found'
  }
]
export default routeConfig
