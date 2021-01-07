import { Router } from 'express'
import CollectPoints from './../controllers/CollectPoints'

const routes = Router()
const collectPoints = new CollectPoints()

routes.get('/points/:city', collectPoints.index)
routes.get('/points/:id', collectPoints.show)
routes.post('/points', collectPoints.store)
routes.put('/points/:id', collectPoints.update)
routes.delete('/points/:id', collectPoints.destroy)

export default routes