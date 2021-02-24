import React, { Component } from "react";
import { MdDashboard } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CustomCard from "./CustomCard";
import firebase from "firebase";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Modal } from "react-bootstrap";
import { productsSelector } from "reducers/selectors/selectors";
import { useSelector } from "react-redux";
import Image from "react-bootstrap/Image";

type formProps = {
  index: number;
  aisles: any;
};

export default function AisleForm({ index, aisles }: formProps) {
  const [open, setOpen] = React.useState(false);
  const [aisle, setAisle] = React.useState(0);
  const [section, setSection] = React.useState(0);
  const [shelves, setShelves] = React.useState(4);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const products = useSelector(productsSelector);

  React.useEffect(() => {
    if (products) {
      console.log("PRODUCTS: ", products);
    }
  }, [products]);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

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
        <div style={{ flexDirection: "row" }}>
          <div
            style={{ display: "inline-block", marginRight: 20 }}
            tabIndex={0}
            role="button"
            onKeyPress={toggle}
            onClick={toggle}
          >
            <div>List of Products</div>
          </div>
          <div
            onClick={() => openModal()}
            role="button"
            style={{ display: "inline-block", marginRight: 20 }}
          >
            Open modal
          </div>
        </div>

        <Modal show={modalIsOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Choose Products to Add</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {products.map((p) => {
              return (
                <div style={{ flexDirection: "column" }}>
                  <Image src={p.imageLink} rounded={true} />
                </div>
              );
            })}
          </Modal.Body>
        </Modal>

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
