
const { default: axios } = require('axios');
const express = require('express');
const app = express();
const PORT = 3000;

const omdb = axios.create({
    baseURL: 'http://www.omdbapi.com?apikey=e43db8a2',
    timeout: 1000 * 60 * 15,
    headers: {
    'Content-Type': 'application/json',
    },
});

const tmdbTokenApi = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmU5MWE0ZjhiMjk0ZTA0YWRlMTBhNjk4NWY3ZDljZiIsIm5iZiI6MTY4NzkxMzAwNS41OTM5OTk5LCJzdWIiOiI2NDliODIyZGIxZjY4ZDAwYWY1MjBhODgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.g3eXhMTVv_5PGKI_Tr_T08b5RWt_HGL993XtxtGxtu4"
const tmdbApiKey = "7fe91a4f8b294e04ade10a6985f7d9cf" 

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 1000 * 60 * 15,
    headers: {
    'Content-Type': 'application/json',
    'Authorization': tmdbTokenApi,
    },
});

app.get('/', (req, res) => {
  res.send('Olá, mundo! Esta é minha primeira aplicação Express.');
});

app.get('/procurar-filme', async (req, res) => {
  const {titulo, ano} = req.query;

  if(!titulo || !ano){
    res.json({ data: {}, error:"Informe o ano e o título" });
    return
  }

  const params = {
      "t": titulo,       
      "y": ano,       
      "plot": "full",   
      "r": "json",       
  }
  
  const response = await tmdb.get(`/search/movie?query=${titulo}&year=${ano}`, {
    params:{
      api_key:tmdbApiKey
    }
  })

  if(!response.data.results[0]){
    res.json({ data: {}, error:"Nenhum filme encontrado" });
    return
  }

  const id = response.data.results[0]['id']


  const fetchRatings = tmdb.get(`/movie/${id}/reviews`, {
    params: {
      api_key: tmdbApiKey
    }
  });
  
  const fetchOmdb = omdb.get("", {
    params: params
  });

  // Executando ambas as requisições em paralelo
  const [ratings, response2] = await Promise.all([fetchRatings, fetchOmdb]);

  const resJson = {
    title:titulo,
    year:ano,
    sinopse:response2.data['Plot'],
    reviews:ratings.data.results,
  }

  res.json({ data: resJson, error:"" });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});