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
import Item from "../Models/Item";

import Switch from "react-switch";

type ProdPropTypes = {
  index: number;
  p: Item;
  isSelected?: boolean;
  changeAisleProducts(index: number, item: Item, add: boolean): void;
};

export default function ProductListItem({
  index,
  p,
  isSelected,
  changeAisleProducts,
}: ProdPropTypes) {
  const [isSel, setSelected] = React.useState(isSelected || false);

  React.useEffect(() => {
    if (isSel) {
      console.log("Product", p.name);
    }
  });

  const selectProduct = (p: Item) => {
    if (isSel) {
      changeAisleProducts(index, p, false);
      setSelected(false);
    } else {
      changeAisleProducts(index, p, true);
      setSelected(true);
    }
  };

  return (
    <div
      onClick={() => selectProduct(p)}
      key={p.docID}
      style={{ flexDirection: "row", width: "100%" }}
    >
      <Image
        style={{ display: "inline-block" }}
        src={p.imageLink}
        rounded={true}
      />
      <div
        style={{
          display: "inline-block",
          position: "relative",
          right: 0,
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {p.name}
        <div style={{ alignSelf: "flex-end" }}>
          <Switch
            onChange={() => {
              return;
            }}
            checked={isSel}
            offColor="#b3d5ff"
            uncheckedIcon={false}
            checkedIcon={false}
          ></Switch>
        </div>
      </div>
    </div>
  );
}
