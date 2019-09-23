import React, { Component } from "react";

import utils from '../../utils/appUtils'
import API from '../../utils/axiosInterceptor'
import ShipSelectionRow from "../shipSelectionRow";

import './index.scss';

class ContentWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shipList: [],
            planetList: [],
            selectedPlanetsList: [],
            selectedShips: [],
            selectedPlanet: [],
            parsedShipList: {}
        };
    }
    render() {
        return (
            <div className="page-container">
                <div className="container-fluid mt-5">
                    <div>Select planet you want to search</div>
                    <div className="selection-section mt-5">
                        <ShipSelectionRow
                            uid={1}
                            selectedShips={this.state.selectedShips}
                            parsedShipList={this.state.parsedShipList}
                            selectedPlanet={this.state.selectedPlanet}
                            shipSelected={this.shipSelected}
                            selectedPlanetsList={this.state.selectedPlanetsList}
                            planetSelected={this.planetSelected}
                            shipList={this.state.shipList}
                            planetList={this.state.planetList} />
                        <ShipSelectionRow
                            uid={2}
                            selectedShips={this.state.selectedShips}
                            parsedShipList={this.state.parsedShipList}
                            selectedPlanetsList={this.state.selectedPlanetsList}
                            selectedPlanet={this.state.selectedPlanet}
                            shipSelected={this.shipSelected}
                            planetSelected={this.planetSelected}
                            shipList={this.state.shipList}
                            planetList={this.state.planetList} />
                        <ShipSelectionRow
                            uid={3}
                            selectedShips={this.state.selectedShips}
                            parsedShipList={this.state.parsedShipList}
                            selectedPlanetsList={this.state.selectedPlanetsList}
                            selectedPlanet={this.state.selectedPlanet}
                            shipSelected={this.shipSelected}
                            planetSelected={this.planetSelected}
                            shipList={this.state.shipList}
                            planetList={this.state.planetList} />
                        <ShipSelectionRow
                            uid={4}
                            selectedShips={this.state.selectedShips}
                            parsedShipList={this.state.parsedShipList}
                            selectedPlanetsList={this.state.selectedPlanetsList}
                            selectedPlanet={this.state.selectedPlanet}
                            shipSelected={this.shipSelected}
                            planetSelected={this.planetSelected}
                            shipList={this.state.shipList}
                            planetList={this.state.planetList} />
                    </div>
                    <div></div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.getData();
    }

    planetSelected = (val, uid) => {
        const tempState = JSON.parse(JSON.stringify(this.state));
        let foundFlag = false;
        let planetId = '';
        let planetDist = '';
        tempState.selectedPlanet = [];

        for (const planetInx in tempState.planetList) {
            if (tempState.planetList[planetInx].name === val) {
                planetId = tempState.planetList[planetInx].id;
                planetDist = tempState.planetList[planetInx].distance;
            }
        }
        for (const planetInx in tempState.selectedPlanetsList) {
            const singleObj = tempState.selectedPlanetsList[planetInx];
            if (parseInt(singleObj.uid) === parseInt(uid)) {
                singleObj.planet = val;
                singleObj.id = planetId;
                singleObj.planetDist = planetDist;
                foundFlag = true;
            }
            tempState.selectedPlanet.push(tempState.selectedPlanetsList[planetInx].planet);
        }

        if (!foundFlag) {
            tempState.selectedPlanetsList.push({ planet: val, uid: uid, planetId, planetDist })
            tempState.selectedPlanet.push(val);
        }
        // tempState.selectedPlanet.push(val);
        this.setState({
            selectedPlanetsList: tempState.selectedPlanetsList,
            selectedPlanet: tempState.selectedPlanet
        }, () => {
            console.log('this.state.selectedPlanetsList', this.state.selectedPlanetsList);
        });
    }

    shipSelected = (val, ship, uid) => {
        const tempState = JSON.parse(JSON.stringify(this.state));
        let parsedShipList = {};

        for (const shipInx in tempState.shipList) {
            parsedShipList[tempState.shipList[shipInx].id] = tempState.shipList[shipInx].total_no;
            for (const planetInx in tempState.selectedPlanetsList) {

                if (tempState.selectedPlanetsList[planetInx].uid === uid) {
                    tempState.selectedPlanetsList[planetInx].ship = ship.name;
                    tempState.selectedPlanetsList[planetInx].shipId = ship.id;
                }

                if (tempState.shipList[shipInx].id === tempState.selectedPlanetsList[planetInx].shipId) {
                    parsedShipList[tempState.shipList[shipInx].id] = parsedShipList[tempState.shipList[shipInx].id] - 1;
                }
            }
        }

        this.setState({
            selectedPlanetsList: tempState.selectedPlanetsList,
            shipList: tempState.shipList,
            parsedShipList
        }, () => {
            console.log('this.state', this.state);
        });
    }

    getData = async () => {
        const response = await Promise.all([
            API.getApi('planets').then((result) => { return result.data }),
            API.getApi('vehicles').then((result) => { return result.data })
        ]);
        let parsedShipList = {};

        for (const apiInx in response) {
            for (const respId in response[apiInx]) {
                response[apiInx][respId].id = utils.uniqueIdGenerator();
                if (parseInt(apiInx) === 1) {
                    parsedShipList[response[apiInx][respId].id] = response[apiInx][respId].total_no;
                }
            }
        }

        console.log('parsedShipList', parsedShipList);
        this.setState({
            planetList: response[0],
            shipList: response[1],
            parsedShipList
        }, () => {
            console.log(this.state)
        })
    }

    toSingleRecipe = ((recipe) => {
        this.props.updateSingleRecipe(recipe);
        window.localStorage.setItem('singleRecipe', JSON.stringify(recipe));
    })

}

export default ContentWrapper;
