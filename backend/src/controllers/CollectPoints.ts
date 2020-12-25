import { Request, Response } from 'express'
import knex from '../database/conn'

class CollectPoints {
  async index(req: Request, res:Response) {
    const { city, uf, items } = req.query

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'point_id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    return res.json(points)
  }


  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex('points')
      .where('id', id)
      .first()

    if (!point) res.status(400).json({ message: 'Nenhum ponto de coleta encontrado.' })

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('title')

    return res.json({point, items})
  }

  async store(req: Request, res: Response) {
    const { 
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items 
    } = req.body

    const trx = await knex.transaction()

    const point = ({
      image: 'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    })

    const insertedIds = await trx('points').insert(point)

    const point_id = insertedIds[0]

    const pointItems = items.map((item_id: Number) => {
      return {
        item_id,
        point_id
      }
    })

    await trx('point_items').insert(pointItems)

    /* Quando usamos transaction, precisamos deste comando
    ** para finalizar o envio dos dados e gravar no banco.
    ** sem ele os dados ficam em loop e não salvam no banco.
    */
    await trx.commit()

    return res.json({
      Created: 'Novo ponto de coleta criado com sucesso!',
      id: point_id,
      ...point
    })
  }
}

export default CollectPoints