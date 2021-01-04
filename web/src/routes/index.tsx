import { Route, BrowserRouter } from 'react-router-dom'

import Home from './../pages/home'
import Point from './../pages/create-point'

const Routes = () => {
  return (
    <BrowserRouter>
      <Route exact component={ Home } path="/" />
      <Route component={ Point } path="/cadastro" />
    </BrowserRouter>
  )
}

export default Routes
