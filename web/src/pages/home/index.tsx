import { Link } from 'react-router-dom'
import { FiLogIn, FiMapPin } from 'react-icons/fi'
import './styles.css'
import logo from './../../assets/logo.svg'

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={ logo } alt="Ecoleta"/>
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to="/cadastro">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
          <Link to="/points">
            <span>
              <FiMapPin />
            </span>
            <strong>Todos os pontos de coleta</strong>
          </Link>
        </main>

        <footer>
          <p>
          Rio de Janeiro 2021/01/07 - Created by Wellington Pinho - Open to job: (21) 9818 - 46398
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home