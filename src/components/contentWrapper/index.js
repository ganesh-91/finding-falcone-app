import React, { Component } from "react";

import utils from '../../utils/appUtils'
import API from '../../utils/axiosInterceptor'
import ShipSelectionRow from "../shipSelectionRow";

import './index.scss';

class UserSelectionBlock extends Component {
    render() {
        return (
            <>
                <div>Select planet you want to search</div>
                <div className="text-danger">{this.props.error}</div>
                <div className="user-actions mt-5">
                    <div className="selection-section">
                        {this.props.selectedPlanetsList.map((elm) => {
                            return (
                                <ShipSelectionRow
                                    uid={elm.uid}
                                    key={elm.uid}
                                    parsedShipList={this.props.parsedShipList}
                                    selectedPlanet={this.props.selectedPlanet}
                                    selectedPlanetsList={this.props.selectedPlanetsList}
                                    shipList={this.props.shipList}
                                    planetList={this.props.planetList}
                                    shipSelected={this.props.shipSelected}
                                    planetSelected={this.props.planetSelected} />)
                        })}
                    </div>
                    <div className="info-display">Time Taken : {this.props.timeCount}</div>
                </div>
                <div>
                    <button onClick={this.props.findFalcon} type="button" className="btn btn-primary">Find Falcon</button>
                </div>
            </>
        );
    }
}

const ResultBlock = (props) => {
    if (props.status === 'pass') {
        return (
            <div>
                <h3>
                    <p>Success! Congratulation on Finding Falcon. King Shan is Mighty pleased.</p>
                    <p className="mt-5">Time Taken : {props.timeCount}</p>
                    <p className="mt-2">Planet found : {props.planet_found}</p>
                </h3>
            </div>
        )
    } else if (props.status === 'fail') {
        return (
            <div>
                <h3>
                    <p>Sorry! Finding Falcon mission failed. Try again.</p>
                    <p className="mt-5">Time Taken : {props.timeCount}</p>
                </h3>
            </div>
        )
    }

}

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
            selectedPlanet: [],
            parsedShipList: {},
            timeCount: 0,
            error: '',
            success: false,
            planet_found: ''
        };
    }
    render() {
        return (
            <div className="page-container container">
                <div className="container-fluid mt-5">
                    {this.state.success ?
                        <ResultBlock
                            status={this.state.status}
                            timeCount={this.state.timeCount}
                            planet_found={this.state.planet_found}
                        />
                        : <UserSelectionBlock
                            parsedShipList={this.state.parsedShipList}
                            selectedPlanet={this.state.selectedPlanet}
                            selectedPlanetsList={this.state.selectedPlanetsList}
                            shipList={this.state.shipList}
                            planetList={this.state.planetList}
                            error={this.state.error}
                            shipSelected={this.shipSelected}
                            planetSelected={this.planetSelected}
                            timeCount={this.state.timeCount}
                            findFalcon={this.findFalcon}
                        />
                    }
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

        this.setState({
            selectedPlanetsList: tempState.selectedPlanetsList,
            selectedPlanet: tempState.selectedPlanet
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
        })
    }

    getToken = () => {

    }

    findFalcon = async () => {
        let token;

        await API.postApi('token')
            .then((resp) => {
                token = resp.data.token;
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    error: 'Error occurred !'
                })
            })
        let rqstData = {
            token,
            planet_names: [],
            vehicle_names: []
        }
        const tempList = JSON.parse(JSON.stringify(this.state.selectedPlanetsList));

        for (const obj in tempList) {
            if (tempList[obj].planet && tempList[obj].ship) {
                rqstData.planet_names.push(tempList[obj].planet);
                rqstData.vehicle_names.push(tempList[obj].ship);
            }
        }

        API.postApi('find', rqstData)
            .then((response) => {
                this.setState({
                    success: true,
                    status: 'pass',
                    planet_found: response.data.planet_name
                })
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    success: true,
                    status: 'fail'
                })

            })
    }

}

export default ContentWrapper;
