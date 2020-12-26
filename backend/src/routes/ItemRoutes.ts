import { Router } from 'express'
import ItemsController from '../controllers/ItemsController'

const routes = Router()
const itemController = new ItemsController()

routes.get('/items', itemController.index)


export default routes