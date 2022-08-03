import { Component } from 'react';
import React from 'react';
import MarvelService from '../../Services/MarvelService';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './charList.scss';
import CharInfo from '../CharInfo/CharInfo';

class CharList extends Component {  
    
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false
    }

   marvelService = new MarvelService();

    componentDidMount () {
        this.onRequest();
        
    }

    onRequest = (offset) => {
        this.onCharLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }
    
    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
        
    }

    onCharLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars})=> ({
            chars: [...chars, ...newChars], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
       
    }

    onError =() => {
        this.setState({ 
            loading: false,
            error: true
        })
    }
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
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

    const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
    
    const items = this.renderItems(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
    
}
CharInfo.PropTypes = {
    charId: PropTypes.number
}
export default CharList;