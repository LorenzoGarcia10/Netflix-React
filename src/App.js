import { useEffect, useState } from 'react';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie/FeaturedMovie';
import Header from './components/Header/Header';
import MovieRow from './components/MovieRow/MovieRow';
import tmdb from './Tmdb'

function App() {

  const [movieList, setMovieList]= useState([])
  const [featuredData, setFeaturedData]= useState(null)
  const [blackHeader, setBlackHeader]= useState(false)


  useEffect(()=>{
    const loadAll = async () =>{
     
      //pegando a lista total
      let list = await tmdb.getHomeList()
      setMovieList(list)

      //pegando featured
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }

    loadAll()
  },[])
  useEffect(()=>{
    const scrollListener = () =>{
      if(window.scrollY > 10) {
        setBlackHeader(true)
      }else{
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)
    return ()=>{
      window.removeEventListener('scroll', scrollListener)
    }
  },[])


  return (
    
    <div className='page'>
      
      <Header black={blackHeader}></Header>
      {
      featuredData && <FeaturedMovie item={featuredData}/>
      }

      <section className='lists'>
        {movieList.map((item, key)=>(
              <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
              ))}
      </section>
      
      <footer> 
        Made by Lorenzo Garcia <br/>
         Database by Themoviedb.org 
       </footer>
       {movieList.length <= 0 &&
       <div className='loading'>
       <img src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif' alt='loading'></img>
     </div>
     }
       
       
    </div>
  );
} 

export default App;