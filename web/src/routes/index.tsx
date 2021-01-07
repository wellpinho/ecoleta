import { Route, BrowserRouter } from 'react-router-dom'

import Home from './../pages/home'
import Point from './../pages/create-point'
import Points from './../pages/points'

const Routes = () => {
  return (
    <BrowserRouter>
      <Route exact component={ Home } path="/" />
      <Route component={ Point } path="/cadastro" />
      <Route component={ Points } path="/points" />
    </BrowserRouter>
  )
}

export default Routes
