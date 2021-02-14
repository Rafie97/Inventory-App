import React, { Component } from "react";
import { MdDashboard } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CustomCard from "./CustomCard";
import firebase from "firebase";

type formProps = {
  index: number;
  aisles: any;
};

export default function AisleForm({ index, aisles }: formProps) {
  const [open, setOpen] = React.useState(false);
  const [aisle, setAisle] = React.useState(0);
  const [section, setSection] = React.useState(0);
  const [shelves, setShelves] = React.useState(4);

  const toggle = () => {
    setOpen(!open);
  };

  function onSave() {
    const db = firebase.firestore();
    const hebRef = db
      .collection("stores")
      .doc("HEB")
      .collection("map-data")
      .doc("walls");

    const ais = aisles;
    ais[index] = {
      ...ais[index],
      aisle: aisle,
      section: section,
      shelves: shelves,
    };
    hebRef.update({
      aisles: ais,
    });
  }

  function setForm(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "aisleNumberControl") {
      setAisle(parseFloat(e.target.value) || 0);
    }
    if (e.target.name === "numSectionsControl") {
      setSection(parseFloat(e.target.value) || 0);
    }
    if (e.target.name === "numShelvesControl") {
      setShelves(parseFloat(e.target.value) || 0);
    }
  }

  return (
    <Form.Group style={{ alignSelf: "center" }}>
      <Form.Label>
        Please choose some specifications for a new aisle.
      </Form.Label>

      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          margin: 20,
        }}
      >
        <Form.Label style={{ marginRight: 4 }}>Aisle Number: </Form.Label>
        <Form.Control
          name="aisleNumberControl"
          onChange={(e: any) => setForm(e)}
          value={aisle > 0 ? aisle : ""}
          style={{
            width: "4rem",
            bottom: 4,
            display: "inline",
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            padding: 0,
            height: 40,
          }}
        ></Form.Control>
      </div>
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          margin: 20,
        }}
      >
        <Form.Label style={{ marginRight: 4 }}>Section Number: </Form.Label>
        <Form.Control
          name="numSectionsControl"
          style={{
            width: "5rem",
            bottom: 4,
            display: "inline",
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            padding: 0,
            height: 40,
          }}
        ></Form.Control>
      </div>
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          margin: 20,
        }}
      >
        <Form.Label style={{ marginRight: 4 }}>Number of Shelves: </Form.Label>
        <Form.Control
          name="numShelvesControl"
          defaultValue="4"
          style={{
            width: "4rem",
            bottom: 4,
            display: "inline",
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            padding: 0,
            height: 40,
          }}
        ></Form.Control>
      </div>

      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "auto",
          margin: 20,
        }}
      >
        <div tabIndex={0} role="button" onKeyPress={toggle} onClick={toggle}>
          <div>List of Products</div>
        </div>
        {open && (
          <ul style={{ listStyle: "none" }}>
            <li>Product 1</li>
            <li>Product 2</li>
          </ul>
        )}
      </div>
      <div style={{ flexDirection: "row" }}>
        <Button style={{ marginRight: 10 }} onClick={onSave}>
          Save
        </Button>
        <Button style={{ marginRight: 10 }}>Delete</Button>
      </div>
    </Form.Group>
  );
}
