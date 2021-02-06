import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function AisleForm() {
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
        <Form.Label style={{ marginRight: 4 }}>Width: </Form.Label>
        <Form.Control
          name="aisleWidthControl"
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
        <div style={{ display: "inline" }}>ft</div>
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
        <Form.Label style={{ marginRight: 4 }}>Aisle Number: </Form.Label>
        <Form.Control
          name="aisleNumberControl"
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
        <Form.Label style={{ marginRight: 4 }}>Number of Sections: </Form.Label>
        <Form.Control
          name="numSectionsControl"
          defaultValue="Auto"
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
    </Form.Group>
  );
}
