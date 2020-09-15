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
        this.doThisOnce = this.doThisOnce.bind(this);
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
                const item = new Item(doc);
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
        const emptyDoc = {
            docID:"additem",
            name:"Add a new item",
        }

        const emptyCard= new Item(emptyDoc);

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