import { Component } from 'react';
import MarvelService from '../../Services/MarvelService';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false
    }

   marvelService = new MarvelService();

    componentDidMount () {
        this.loadChars();
    }
     
    onCharLoaded = (chars) => {
        this.setState({
            chars, 
            loading: false
        })
    }

    onError =() => {
        this.setState({ 
            loading: false,
            error: true
        })
    }
    loadChars = () => {        
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError);
    }
    renderItems(arr) {
        const items = arr.map(item => {
            return (
                <li className="char__item"  
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>         
                    <img src={item.thumbnail} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

   render () {

    const {chars, loading, error} = this.state;
    
    const items = this.renderItems(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
    
}

export default CharList;