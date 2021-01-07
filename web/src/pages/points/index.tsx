import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import api from '../../services/api'
import axios from 'axios'
import './styles.css'

interface Point {
  id: number
  image: string
  name: string
  city: string
  uf: string
  whatsapp: string
}

interface IBGEUF {
  sigla: string
}

interface IBGECity {
  nome: string
}

const Points = () => {
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cities, setCities] = useState<string[]>([])
  //const [usePoint, setUsePoint] = useState<Point[]>([])
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    axios.get<[IBGEUF]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
      const ufInitials = response.data.map( uf => uf.sigla)
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const city = selectedCity
    const data = city

    api.get(`points/${data}`).then(response => {
      setPoints(response.data)
    })
  }

  return (
    <div id="page-create-point">
      <form onSubmit={handleSubmit}>
        <h1>Pontos de coleta</h1>
        <fieldset>
          <legend>
            <h2>Escolha a cidade</h2>
          </legend>
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
                      <option key={city} value={city}>{city}</option>
                    )
                  })}
                </select>
              </div>
            </div>
          </fieldset>
          <button type="submit">buscar...</button>
      </form>

      <div className="row">
        {points.map(point => {
          return (
            <div className="col" key={point.id}>
              <div className="card">
                <img className="card-img-top img-fluid" src={point.image} alt="Imagem de capa do card" />
                <div className="card-body">
                  <h2 className="card-title">{point.name}</h2>
                  <h5>{point.city} - {point.uf}</h5>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Points
