import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000 * 60 * 15,
    headers: {
    'Content-Type': 'application/json',
    },
});

function App() {
  const [content, setContent] = useState({})
  const [error, setError] = useState("")

  const onSubmit =  async (e) => {
    e.preventDefault();

    setContent({})
    const titulo = e.target.titulo.value;
    const ano = e.target.ano.value;
    
    if(!titulo || !ano){
      return;
    }

    const response = await api.get(`/procurar-filme?titulo=${titulo}&ano=${ano}`)
    
    if(response.data.error){
      setError(response.data.error)
      return;
    }

    setError("")
    console.log(response.data.data)
    setContent(response.data.data)
  }

  return (
    <div style={{
      justifyContent:"center",
      alignItems:"center",
      width:"100vw",
      display:"flex",
      minHeight:"100vh",
      background:"#d9d9d9"
    }}>
       <div
        style={{
          background:"white",
          width:600,
          height:600,
          borderRadius:12,
          paddingInline:24,
          overflowY:"scroll"
        }}
       >
        <h2>Procurar filme</h2>

        <form action="" onSubmit={onSubmit}>
          <input type="text" placeholder='Título' name='titulo' />
          <div>
          <input type="number" max={2025}  placeholder='Ano' name='ano' />
          </div>

          <button style={{marginTop:24}} type='submit'>Procurar</button>

          {
            error && <p style={{color:"red"}} >{error}</p>
          }
          {
            Object.keys(content).length > 0 && (
              <div style={{marginTop:24}}>
                <div>
                  <span>Titulo:</span>
                  <span>{content['title']}</span>
                </div>
                <div style={{marginTop:24}}>
                  <span>Ano:</span>
                  <span>{content['year']}</span>
                </div>
                <div style={{marginTop:24}}>
                  <span>Sinopse:</span>
                  <span>{content['sinopse']}</span>
                </div>
                <div style={{marginTop:24}}>
                  <span>Reviews:</span>

                  <div>
                    {
                      content['reviews'] && content['reviews'].length > 0 && content['reviews'].map((item, index) => (
                        <div style={{marginTop:24}}>
                          <span>Review-{index + 1}:</span>
                          <span>{item['content']}</span>
                        </div>
                      ))
                    }
                  </div>
                  <span>{}</span>
                </div>
              </div>
            )
          }
        </form>
       </div>
    </div>
  )
}

export default App
