import React, { Component } from "react";

import './index.scss';

class ShipSelectionRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPlanet: 'Select',
            selectedShip: '0'
        };
    }
    render() {
        return (
            <div className="ship-selection-wrapper col">
                <div className="form-group">
                    <div className="title">
                        destination {this.props.uid}
                    </div>
                </div>
                <div className="form-group">
                    <div className="planet-selection">
                        <select value={this.state.selectedPlanet}
                            onChange={this.planetSelected}
                            className="custom-select">
                            <option disabled
                                value={this.state.selectedPlanet}>
                                {this.state.selectedPlanet}</option>
                            {this.props.planetList.map((elm) => {
                                if (!this.props.selectedPlanet.includes(elm.name)) {
                                    return (<option key={elm.id}
                                        value={elm.name}>{elm.name}</option>);
                                } else {
                                    return null;
                                }
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    {this.state.selectedPlanet.toLowerCase() !== 'select' && this.props.shipList.map((elm) => {
                        return (
                            <div key={elm.id} className="ship-selection text-left">
                                <div className="custom-control custom-radio">
                                    <input type="radio" onChange={(e) => {
                                        this.setState({ selectedShip: elm.name });
                                        this.props.shipSelected(e.target.value, elm, this.props.uid)
                                    }} name={this.props.uid} id={`${this.props.uid}${elm.name}`}
                                        disabled={this.props.parsedShipList[elm.id] <= 0 ? true : false}
                                        className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor={`${this.props.uid}${elm.name}`}>{`${elm.name} (${this.props.parsedShipList[elm.id]})`}</label>
                                </div>
                            </div>)
                    })}
                </div>
            </div>
        );
    }
    planetSelected = (e) => {
        this.setState({ selectedPlanet: e.target.value });
        this.props.planetSelected(e.target.value, this.props.uid)
    }

}

export default ShipSelectionRow;
