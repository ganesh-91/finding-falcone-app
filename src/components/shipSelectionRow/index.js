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
        let distConstant = '';
        this.props.selectedPlanetsList.map((elm) => {
            // debugger;
            if (elm.uid === this.props.uid) {
                distConstant = elm.planetDist;
            }
        })
        console.log('distConstant', distConstant)
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
                            {/* <option disabled value={this.getName()}>{this.getName()}</option> */}
                            <option disabled value={this.state.selectedPlanet}>{this.state.selectedPlanet}</option>
                            {this.props.planetList.map((elm) => {
                                if (!this.props.selectedPlanet.includes(elm.name)) {
                                    return (<option key={elm.id} value={elm.name}>{`${elm.name}${elm.distance}`}</option>);
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
                                        disabled={(distConstant > elm.max_distance) || (this.props.parsedShipList[elm.id] <= 0 ? true : false)}
                                        className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor={`${this.props.uid}${elm.name}`}>{`${elm.name} (${this.props.parsedShipList[elm.id]}) ${elm.max_distance}`}</label>
                                </div>
                            </div>)
                    })}
                </div>
            </div>
        );
    }

    getName = () => {
        let name = 'Select';
        for (const planetInx in this.props.planetList) {
            if (this.props.planetList[planetInx].name === this.state.selectedPlanet) {
                name = this.props.planetList[planetInx].name + this.props.planetList[planetInx].distance;
            }
        }
        // debugger;
        return name;
    }

    planetSelected = (e) => {
        this.setState({ selectedPlanet: e.target.value });
        this.props.planetSelected(e.target.value, this.props.uid)
    }

}

export default ShipSelectionRow;
