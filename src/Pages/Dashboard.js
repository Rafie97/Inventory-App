import React, { Component, useState } from "react";
import firebase from "firebase";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import InventoryPage from "./Dash Pages/InventoryPage";
import StoreMap from "./Dash Pages/StoreMap";
import Button from "react-bootstrap/Button";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import { ToggleButton } from "react-bootstrap";
import { BiCurrentLocation } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.doThisOnce = this.doThisOnce.bind(this);
  }

  doThisOnce() {
    const db = firebase.firestore();
    const hebRef = db.collection("stores").doc("HEB").collection("items");

    this.state.cards.forEach((e) => {
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
      const newAisle = Math.floor(Math.random() * 10) + 1;
      const newX = Math.floor(Math.random() * 375);
      const newY = Math.floor(Math.random() * 300);

      const newLocationObj = {
        aisle: newAisle,
        coordinates: {
          xPos: newX,
          yPos: newY,
        },
      };

      hebRef
        .doc(e.docID)
        .update({
          location: newLocationObj,
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.log("Error updating document: ", error);
        });
    });
  }

  render() {
    return (
      <div className="wrap-dash">
        <div className="menuNav">
          <MenuWithDropdown title="Dashboards" />

          <div
            className="foot-container"
            style={{ marginLeft: 10, marginBottom: 10 }}
          >
            <div style={{ fontSize: 16 }}>
              Numerus Delta Inventory Solutions
            </div>
            <p style={{ fontSize: 12 }}>Privacy Policy | Copyright 2020</p>
          </div>
        </div>

        <Switch>
          <Redirect exact from="/Dashboard" to="/Dashboard/Inventory" />
          <Route path="/Dashboard/Inventory" exact component={InventoryPage} />
          <Route path="/Dashboard/Map" exact component={StoreMap} />
        </Switch>
      </div>
    );
  }
}

function MenuWithDropdown({ title }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  const items = [
    { value: "Inventory" },
    { value: "Analytics" },
    { value: "Ecommerce" },
  ];

  return (
    <div className="dd-wrapper">
      <ul style={{ listStyle: "none" }}>
        <li style={{ marginBottom: 20, marginTop: 60 }}>
          <div
            tabIndex={0}
            role="button"
            onKeyPress={() => toggle(!open)}
            onClick={() => toggle(!open)}
          >
            <div>
              <MdDashboard
                style={{ position: "relative", left: -8, top: -5 }}
              />
              {title}
            </div>
          </div>

          {open && (
            <ul style={{ listStyle: "none" }} className="dd-list">
              {items.map((item) => (
                <li>
                  <Link
                    style={{ color: "white", fontSize: 15 }}
                    to={"/Dashboard/" + item.value}
                  >
                    {item.value}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li style={{ color: "white", marginBottom: 20, width: "100%" }}>
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to="/Dashboard/StoreData"
          >
            <BsClipboardData
              style={{ position: "relative", left: -20, top: -5 }}
            />
            Store Data
          </Link>
        </li>
        <li
          style={{
            color: "white",
            marginBottom: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          <BiCurrentLocation
            style={{ position: "relative", left: -70, top: -5 }}
          />
          <Link
            style={{
              color: "white",
              textDecoration: "none",
            }}
            to="/Dashboard/Map"
          >
            Map
          </Link>
        </li>
      </ul>
    </div>
  );
}
