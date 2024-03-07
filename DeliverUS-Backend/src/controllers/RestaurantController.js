import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

// Listado de restaurantes: los clientes podrán consultar todos los restaurantes
const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

// Metodo para crear un nuevo restaurante
const create = async function (req, res) {
  try {
    const newRestaurant = Restaurant.build(req.body)
    newRestaurant.userId = 1
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

// Los clientes podrán consultar los detalles de los restaurantes y los productos que ofrecen
const show = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

// debe devolver el elemento del restaurante actualizado consultando la base de datos

const update = async function (req, res) {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

// debe eliminar el restaurante
const destroy = async function (req, res) {
  try {
    await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    res.json('Bien borrao broder')
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  create,
  show,
  update,
  destroy
}
export default RestaurantController
