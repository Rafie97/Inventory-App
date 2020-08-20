import React, { Component } from 'react';
import firebase from 'firebase';
import CustomCard from '../Components/CustomCard';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
        };
        this.handleItemChange = this.handleItemChange.bind(this);

    }

    componentDidMount() {
        const config = {
            apiKey: "AIzaSyAwVQUWQfP18Lmai0-897ftQ3AwFOGwF88",
            authDomain: "bigproject-3043c.firebaseapp.com",
            databaseURL: "https://bigproject-3043c.firebaseio.com",
            projectId: "bigproject-3043c",
            storageBucket: "bigproject-3043c.appspot.com",
            messagingSenderId: "1070431489619",
            appId: "1:1070431489619:web:ccf28d925d4e9db7a7c0a6",
            measurementId: "G-STD67N7EY0"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        this.getItems();
    }

    async getItems() {
        const db = firebase.firestore();
        const hebRef = db.collection("stores").doc("HEB").collection("items");

        await hebRef.onSnapshot((snap) => {
            this.setState({ cards: [] });
            snap.forEach(doc => {
                const item = {
                    "docID": doc.id,
                    "name": doc.data().name,
                    "price": doc.data().price,
                    "imageLink": doc.data().imageLink,
                    "promo": doc.data().promo,
                };
                this.setState({ cards: [...this.state.cards, item] });
            });
        })
    }

    async handleItemChange(newItem) {
        const items = this.state.cards;

        if (items.find(e => (e.docID === newItem.docID))) {
            delete newItem.docID;
            //Update in state
            const index = items.findIndex(e => (e.docID === newItem.docID));
            items[index] = newItem;
            await this.setState({ cards: items });

            //Update in firebase
            const db = firebase.firestore();
            const hebRef = db.collection("stores").doc("HEB").collection("items");
            await hebRef.doc(newItem.docID).set(newItem);
        }
        else if(newItem.docID==='additem' && newItem.name !=='Add a new item' && newItem.price !==''){
            delete newItem.docID;
            //Update in firebase
            const db = firebase.firestore();
            const hebRef = db.collection("stores").doc("HEB").collection("items");
            await hebRef.add(newItem);
            
            //Update in state 
            this.getItems();
        }
        else {
            console.log("Saved a new item without changing name or adding a price");
        }
    }




    render() {
        const emptyCard={
            "docID": "additem",
            "name": 'Add a new item',
            "price": '',
            "imageLink": '',
            "promo": '',
        }
        return (
            <div className="wrap-dash">
                <div className="navBar">
                    <Navbar>
                        <Navbar.Brand>Welcome to your inventory</Navbar.Brand>
                    </Navbar>
                </div>

                <div className="menuNav">
                    <Nav >
                        <Nav.Link style={{color:'white'}}>Inventory</Nav.Link>
                        <Nav.Link style={{color:'white'}}>Store Data</Nav.Link>
                    </Nav>
                </div>

                <div className="cards">
                    {(!this.state.cards.length) ? (<p>Loading</p>) : (this.state.cards.map((card) => (
                        <CustomCard data={card} handleItemChange={this.handleItemChange} ></CustomCard>
                    )))}
                    {(!this.state.cards.length) ? (<p>Loading</p>) : (<CustomCard data={emptyCard} handleItemChange={this.handleItemChange}></CustomCard>) }
                </div>


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