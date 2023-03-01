import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import useMarvelService from "../../Services/MarvelService";
import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import "./comicsList.scss";

const setContent = (process, Component, newComicsLoading) => {
  switch(process) {
    case 'waiting' :
      return <Spinner />;
    case 'loading' :
      return newComicsLoading ? <Component /> : <Spinner />;
    case 'confirmed' :
      return  <Component />;
    case 'error':
      return <ErrorMessage />;
    default :
      throw new Error('Unexpected error');
  }
};

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [newComicsLoading, setNewComicsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
    getAllComics(offset)
      .then(onComicsLoaded)
      .then(() => setProcess('confirmed'));
  };

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }

    setComics([...comics, ...newComics]);
    setNewComicsLoading(false);
    setOffset(offset + 8);
    setComicsEnded(ended);
  };

  function renderComics(arr) {
    const items = arr.map((item) => {
  
      return (
        <li 
        key={item.id}
        className="comics__item">
          <Link to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </Link>
        </li>
      );
    });
    return <ul className="comics__grid">{items}</ul>;
  }


  return (
    <div className="comics__list">
     {setContent(process, ()=>renderComics(comics), newComicsLoading)}
      <button
        className="button button__main button__long"
        disabled={newComicsLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
