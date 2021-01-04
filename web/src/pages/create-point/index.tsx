import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'
import api from '../../services/api'
import './styles.css'
import logo from './../../assets/logo.svg'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

/* sempre que tivermos array ou objeto: devemos seta o 
** tipo da variavel manualmente cm interfece
*/
interface Item {
  id: number
  title: string
  image_url: string
}

interface IBGEUF {
  sigla: string
}

interface IBGECity {
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedPositionMap, setSelectedPositionMap] = useState<[number, number]>([0, 0])
  const [inicialPosition, setInicialPosition] = useState<[number, number]>([0, 0])
  const [inputFormData, setInputFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const history = useHistory()
  
  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<[IBGEUF]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
      const ufInitials = response.data.map( uf => uf.sigla)
      console.log(ufInitials)
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return

    axios.get<[IBGECity]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      // carregar somente as cidades baseadas no uf selecionada
      const citiesByState = response.data.map(city => city.nome)
      setCities(citiesByState)
    })
  }, [selectedUf])

  useEffect(() => {
    // Pega posição inicial do user assim que carregar o app
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      setInicialPosition([latitude, longitude])
    })
  }, [])

  // função que pega a uf selecionada no option html
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  // função que pega a cidade selecionada no option html
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
  }

  // função que pega o evento onClick no html
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPositionMap([event.latlng.lat, event.latlng.lng])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setInputFormData({ ...inputFormData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    }
    else setSelectedItems([...selectedItems, id])
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = inputFormData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPositionMap
    const items = selectedItems

    const data = {
      name, email, whatsapp, uf, city, latitude, longitude, items
    }

    await api.post('points', data)

    alert('Ponto de coleta criado')

    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={ logo } alt=""/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input onChange={handleInputChange} type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input onChange={handleInputChange} type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input onChange={handleInputChange} type="number" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={inicialPosition} zoom={12} onClick={handleMapClick}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPositionMap} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                <option value="0">Selecione um Estado</option>
                {ufs.map(uf => {
                  return (
                  <option key={uf} value={uf}>{uf}</option>
                )})}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectedCity} value={selectedCity} name="city" id="city">
                <option value="0">Selecione uma Cidade</option>
                {cities.map(city => {
                  return (
                    <option value={city}>{city}</option>
                  )
                })}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => {
              return (
                <li 
                  onClick={() => handleSelectItem(item.id)} 
                  key={item.id} 
                  className={selectedItems.includes(item.id) ? 'selected' : ''}>
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>
              )
            })
            }

          </ul>
        </fieldset>

        <button type="submit">Cadastrar novo ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint
