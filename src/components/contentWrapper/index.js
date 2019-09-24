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
            selectedPlanetsList: [
                { uid: 1 },
                { uid: 2 },
                { uid: 3 },
                { uid: 4 }
            ],
            selectedShips: [],
            selectedPlanet: [],
            parsedShipList: {},
            timeCount: 0
        };
    }
    render() {
        return (
            <div className="page-container container">
                <div className="container-fluid mt-5">
                    <div>Select planet you want to search</div>
                    <div className="user-actions mt-5">
                        <div className="selection-section">
                            {this.state.selectedPlanetsList.map((elm) => {
                                return (
                                <ShipSelectionRow
                                    uid={elm.uid}
                                    key={elm.uid}
                                    selectedShips={this.state.selectedShips}
                                    parsedShipList={this.state.parsedShipList}
                                    selectedPlanet={this.state.selectedPlanet}
                                    shipSelected={this.shipSelected}
                                    selectedPlanetsList={this.state.selectedPlanetsList}
                                    planetSelected={this.planetSelected}
                                    shipList={this.state.shipList}
                                    planetList={this.state.planetList} />)
                            })}
                        </div>
                        <div>Time Taken : {this.state.timeCount}</div>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary">Find Falcon</button>
                    </div>
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
        let selectedPlanetsList = tempState.selectedPlanetsList;
        let shipList = tempState.shipList;

        for (const shipInx in shipList) {
            parsedShipList[shipList[shipInx].id] = shipList[shipInx].total_no;
            for (const planetInx in selectedPlanetsList) {

                if (selectedPlanetsList[planetInx].uid === uid) {
                    selectedPlanetsList[planetInx].ship = ship.name;
                    selectedPlanetsList[planetInx].shipId = ship.id;
                    selectedPlanetsList[planetInx].shipSpeed = ship.speed;
                }

                if (shipList[shipInx].id === selectedPlanetsList[planetInx].shipId) {
                    parsedShipList[shipList[shipInx].id] = parsedShipList[shipList[shipInx].id] - 1;
                }
            }
        }

        let timeCount = 0;
        selectedPlanetsList.map((elm) => {
            if (elm.planetDist && elm.shipSpeed) {
                timeCount = timeCount + (elm.planetDist / elm.shipSpeed);
            }
        })

        this.setState({
            selectedPlanetsList: selectedPlanetsList,
            shipList: shipList,
            parsedShipList,
            timeCount
        }, () => {
            console.log('this.state.selectedPlanetsList', this.state.selectedPlanetsList);
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
            console.log('this.state.shipList', this.state.shipList)
        })
    }

    toSingleRecipe = ((recipe) => {
        this.props.updateSingleRecipe(recipe);
        window.localStorage.setItem('singleRecipe', JSON.stringify(recipe));
    })

}

export default ContentWrapper;
