import React, { Component } from 'react';
import CustomCard from '../../Components/CustomCard';
import Item from '../../Models/Item';
import firebase from 'firebase';



export default class InventoryPage extends Component {

    constructor(props) {

        super(props);
        this.state = {
            cards: [],
            backSearches:[],        
        };
        this.handleItemChange = this.handleItemChange.bind(this);
        this.searchItems = this.searchItems.bind(this); 
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


    render() {

        const emptyDoc = {
            docID:"additem",
            name:"Add a new item",
        }

        const emptyCard= new Item(emptyDoc);

        return (
            <div>

                <div style={{marginBottom:40, marginTop:40, textAlign:'start'}}>
                    <input placeholder='Search' type='text' onChange={(val)=>this.searchItems(val.target.value)} style={{paddingLeft:10}} />
                </div>

                <div className="cards">
                    {(!this.state.cards.length) ? (<p>Loading</p>) : (this.state.backSearches.map((card) => (
                        <CustomCard data={card} handleItemChange={this.handleItemChange}></CustomCard>
                    )))}
                    {(!this.state.cards.length) ? (<p>Loading</p>) : (<CustomCard data={emptyCard} handleItemChange={this.handleItemChange}></CustomCard>) }
                </div>
            </div>
        )
    }
}