import React, { Component } from "react";

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
            <header className="App-header">
                <div>

                </div>
                <div className="brand-name">
                    Finding Falcon
                </div>
                <div className="links mr-5">
                    <a href="https://www.geektrust.in/" className="ml-2">GeekTrust Home</a>
                </div>
            </header>
        );
    }
}

export default Header;
