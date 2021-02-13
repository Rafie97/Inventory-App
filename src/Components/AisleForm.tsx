import React, { Component } from "react";

import { MdDashboard } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CustomCard from "./CustomCard";

export default function AisleForm() {
  const [open, setOpen] = React.useState(false);
  const [aisleNum, setAisleNum] = React.useState("");
  const [scetion, setSection] = React.useState("");
  const [shelves, setShelves] = React.useState("");

  const toggle = () => {
    setOpen(!open);
  };

  function onSave() {}

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
          onChangeCapture={(val) => setAisleNum(val)}
          value={aisleNum}
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
