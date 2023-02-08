import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useMarvelService from "../../Services/MarvelService";
import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import "./singleComicsPage.scss";

const SingleComicsPage = () => {
    const { comicsId } = useParams();

    const [ comic, setComic ] = useState(null);
    const { loading, error, getComics, clearError } = useMarvelService();

    
    useEffect(() => {
        updateComic();
      }, [comicsId]);   
    
      const updateComic = () => {
        clearError();
      getComics(comicsId).then(onComicLoaded);
        
      };     
    
      const onComicLoaded = (comic) => {
        setComic(comic);
      };
      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error || !comic) ? <View comic={comic} /> : null;
    

  return (
   <>
   {errorMessage}
   {spinner}
   {content}
   </>
  );
};

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic;
    const comicPrice = price === 0 ? 'NOT AVAILABLE' : price + '$';
      
    return (
        <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">
            {description}
          </p>
          <p className="single-comic__descr">{pageCount}</p>
          <p className="single-comic__descr">Language: {language}</p>
          <div className="single-comic__price">{comicPrice}</div>
        </div>
        <Link to="/comics" className="single-comic__back">
          Back to all
        </Link>
      </div>
    );
}

export default SingleComicsPage;