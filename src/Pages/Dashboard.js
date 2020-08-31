import React, { Component } from 'react';
import firebase from 'firebase';
import CustomCard from '../Components/CustomCard';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Item from '../Models/Item';
import Button from 'react-bootstrap/Button';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            backSearches:[],
        };
        this.handleItemChange = this.handleItemChange.bind(this);
        this.searchItems = this.searchItems.bind(this);

        const timeRef = new Date('August 30, 2020 00:00:00');
        const diffRef = timeRef.getTime();
        this.diffRef = diffRef; 
    }

    componentDidMount() {
        
        this.getItems();
    }

    async getItems() {
        const db = firebase.firestore();
        const hebRef = db.collection("stores").doc("HEB").collection("items");

        await hebRef.onSnapshot((snap) => {
            this.setState({ cards: [], backSearches:[] });
            snap.forEach(doc => {
                const item = new Item(doc.id, doc.data().name, doc.data().price, doc.data().imageLink, doc.data().barcode, doc.data().promo, doc.data().reviews , doc.data().priceHistory);
                this.setState({ cards: [...this.state.cards, item], backSearches:[...this.state.backSearches, item] });
            });
        });

    }

    async handleItemChange(newItem) {
        const items = this.state.cards;

        if (items.find(e => (e.docID === newItem.docID))) {

            //Update in state
            const index = items.findIndex(e => (e.docID === newItem.docID));
            items[index] = newItem;
            await this.setState({ cards: items , backSearches:items});
            

            //Update in firebase
            
            const db = firebase.firestore();
            const hebRef = db.collection("stores").doc("HEB").collection("items");
            await hebRef.doc(newItem.docID).update(newItem);

            
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

        //this.getItems();
    }

    async searchItems(val){

        if(val ===''){
            this.setState({backSearches:this.state.cards});
        }
        else if(val !== ''){
            await this.setState({backSearches:[]});
            const temp = this.state.cards.filter((i)=>{
                return i.name.includes(val);
            })
            await this.setState({backSearches:temp});
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
                        <Navbar.Brand style={{fontSize:30}}>Welcome to your inventory</Navbar.Brand>
                    </Navbar>
                </div>

                <div className="menuNav">
                    <ul style = {{listStyle:'none'}}>
                        <li style={{color:'white', marginBottom:20}}>Inventory</li>
                        <li style={{color:'white', marginBottom:20}}>Store Data</li>
                        <li style={{color:'white', marginBottom:20}}>Map</li>
                    </ul>
                </div>

                <div className="searchBar">
                    <input placeholder='Search' type='text' onChange={(val)=>this.searchItems(val.target.value)} />
                </div>

                <div className="cards">
                    
                    {(!this.state.cards.length) ? (<p>Loading</p>) : (this.state.backSearches.map((card) => (
                        <CustomCard data={card} handleItemChange={this.handleItemChange}></CustomCard>
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