import Item from "./Item";

export type coordinate = {
  x: number;
  y: number;
};

export type Aisle = {
  coordinate: coordinate;
  products: Item[];
};
