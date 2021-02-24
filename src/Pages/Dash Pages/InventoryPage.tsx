import React from "react";
import CustomCard from "../../Components/CustomCard";
import Item from "../../Models/Item";
import firebase from "firebase";
import { mainReducer } from "../../reducers/mainReducer";
import { setProducts } from "reducers/actions/appState";
import { useDispatch, useSelector } from "react-redux";
import { productsSelector } from "reducers/selectors/selectors";

export default function InventoryPage() {
  const [cards, setCards] = React.useState<Item[]>([]);
  const [backSearches, setBackSearches] = React.useState<Item[]>([]);
  const dispatch = useDispatch();
  const products = useSelector(productsSelector);

  React.useEffect(() => {
    getItems();
  }, []);

  React.useEffect(() => {
    dispatch(setProducts(cards));
    cards.forEach((c) => {
      console.log("CARD ", c.name);
    });
  }, [cards]);

  async function getItems() {
    const db = firebase.firestore();
    const hebRef = db.collection("stores").doc("HEB").collection("items");
    let cardo: Array<Item> = [];
    await hebRef.onSnapshot(async (snap) => {
      snap.forEach((doc) => {
        const item = new Item(doc);
        cardo.push(item);
      });
      await setCards(cardo);
      await setBackSearches(cardo);
    });
  }

  async function handleItemChange(newItem: Item) {
    const items = cards;

    if (items.find((e) => e.docID === newItem.docID)) {
      //Update in state
      const index = items.findIndex((e) => e.docID === newItem.docID);
      items[index] = newItem;

      await setCards(items);
      await setBackSearches(items);
      //Update in firebase

      const db = firebase.firestore();
      const hebRef = db.collection("stores").doc("HEB").collection("items");
      await hebRef.doc(newItem.docID).set(newItem);
    } else if (
      newItem.docID === "additem" &&
      newItem.name !== "Add a new item" &&
      newItem.price !== ""
    ) {
      delete newItem.docID;
      //Update in firebase
      const db = firebase.firestore();
      const hebRef = db.collection("stores").doc("HEB").collection("items");
      await hebRef.add(newItem);

      //Update in state
      getItems();
    } else {
      console.log("Saved a new item without changing name or adding a price");
    }

    //getItems();
  }

  async function searchItems(val: string) {
    if (val === "") {
      setBackSearches(cards);
    } else if (val !== "") {
      await setBackSearches([]);
      const temp = cards.filter((i) => {
        return i.name.includes(val);
      });
      await setBackSearches(temp);
    }
  }

  const emptyDoc = {
    docID: "additem",
    name: "Add a new item",
  };

  const emptyCard = new Item(emptyDoc);

  return (
    <div style={{ float: "left", marginLeft: 20 }}>
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: "start" }}>
        <input
          placeholder="Search"
          type="text"
          onChange={(val) => searchItems(val.target.value)}
          style={{ paddingLeft: 10 }}
        />
      </div>

      <div>
        {cards && backSearches ? (
          backSearches.map((card) => (
            <CustomCard
              data={card}
              handleItemChange={handleItemChange}
            ></CustomCard>
          ))
        ) : (
          <p>Loading</p>
        )}
        {cards && backSearches ? (
          <CustomCard
            data={emptyCard}
            handleItemChange={handleItemChange}
          ></CustomCard>
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  );
}
