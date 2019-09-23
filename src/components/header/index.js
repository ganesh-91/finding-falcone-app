import React, { Component } from "react";
import { Link } from 'react-router-dom';

import { connect } from "react-redux";
import recipeActions from '../../actions/recipeActions';

import API from '../../utils/axiosInterceptor'
import utils from '../../utils/appUtils'

import './index.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipeList: []
        };
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>

                </div>
            </nav>
        );
    }
    componentDidMount() {
        this.getRecipeList();
    }

    toSingleRecipe = ((recipe) => {
        this.props.updateSingleRecipe(recipe);
        window.localStorage.setItem('singleRecipe', JSON.stringify(recipe));
    })

    getRecipeList = () => {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateRecipeList: (data) => {
            dispatch(recipeActions.updateRecipeList(data));
        },
        updateSingleRecipe: (data) => {
            dispatch(recipeActions.updateSingleRecipe(data));
        }
    };
};

const mapStateToProps = (store) => {
    return {
        recipeList: store.recipeReducer.recipeList
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
