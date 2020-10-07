import React, { Component } from 'react';
import firebase from 'firebase';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import InventoryPage from './Dash Pages/InventoryPage';
import StoreMap from './Dash Pages/StoreMap';
import Button from 'react-bootstrap/Button';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.doThisOnce = this.doThisOnce.bind(this);
    }

    
    doThisOnce(){
        const db = firebase.firestore();
        const hebRef = db.collection("stores").doc("HEB").collection("items");

        
        this.state.cards.forEach((e)=>{
            /*
            const priceHistoryArray = Object.entries(e.priceHistory);

            const newHistoryArr = [];
            priceHistoryArray.forEach((entry)=>{
                if(typeof entry[1] ==="number"){
                    newHistoryArr.push(entry);
                }
                else if(typeof entry[1] === "string"){
                    const tempEntry = [entry[0], parseFloat(entry[1])]
                    newHistoryArr.push(tempEntry);
                }
                else{ newHistoryArr.push('idk')}
            })

            */
            const newAisle =  Math.floor(Math.random()*10)+1;
            const newX = Math.floor(Math.random()*375);
            const newY= Math.floor(Math.random()*300);

            const newLocationObj = {
                aisle: newAisle,
                coordinates:{
                    xPos:newX,
                    yPos:newY
                }
            };

            hebRef.doc(e.docID).update({
                location: newLocationObj
            }).catch(function(error) {
                // The document probably doesn't exist.
                console.log("Error updating document: ", error);
            });
            
        });
        
    }


    render() {
        return (
            <div className="wrap-dash">
                <div className="navBar">
                    <Navbar>
                        <Navbar.Brand style={{fontSize:30}}>Welcome to your inventory</Navbar.Brand>
                        <Button onClick = {this.doThisOnce}> DO THIS ONCE </Button>
                    </Navbar>
                </div>

                <div className="menuNav">
                    <ul style = {{listStyle:'none'}}>
                        <li style={{marginBottom:20}}>
                            <Link style={{color:'white'}} to="/Dashboard">Inventory</Link>
                        </li>
                        <li style={{color:'white', marginBottom:20}}>
                            <Link style={{color:'white'}}  to="/Dashboard/StoreData">Store Data</Link>
                        </li>
                        <li style={{color:'white', marginBottom:20}}>
                            <Link style={{color:'white'}}  to="/Dashboard/Map">Map</Link>
                        </li>
                    </ul>
                </div>

                <Switch>
                    <Route path="/Dashboard/" exact component={InventoryPage} />
                    <Route path="/Dashboard/Map" exact component={StoreMap} />
                </Switch>



                <footer>
                    <div className="foot-container">
                        <div>
                            Numerus Delta Inventory Solutions
                        </div>
                        <div style={{height:'2rem'}} ></div>
                        <p>Privacy Policy | Copyright 2017</p>
                    </div>
                </footer>


            </div>
        );
    }
}