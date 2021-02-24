import React, { Component } from "react";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Resizable } from "re-resizable";
import Switch from "react-switch";
import firebase from "firebase";
import Bubble from "react-bubble";
import AisleForm from "../../Components/AisleForm";
import { mainReducer } from "../../reducers/mainReducer";

export default function StoreMap() {
  const [firstClick, setFirstClick] = useState(true);

  const [wallCoordinates, setWallCoordinates] = useState([]);
  const [tempWalls, setTempWalls] = useState(null);

  const [tempStart, setTempStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [mapWidth, setMapWidth] = useState(300);
  const [mapHeight, setMapHeight] = useState(300);

  const [aisles, setAisles] = useState([]);

  const [swich, setSwich] = useState(false);
  const [takenPos, setTakenPos] = useState({ x: 0, y: 0 });
  const [takenIndex, setTakenIndex] = useState(-1);

  const blueprintWindow = useRef(undefined);

  const [addingLocations, setAddingLocations] = useState(false);

  const db = firebase.firestore();

  let drawRectLeft;
  let drawRectTop;

  useEffect(() => {
    drawRectLeft = blueprintWindow.current.getBoundingClientRect().left;
    drawRectTop = blueprintWindow.current.getBoundingClientRect().top;
  });

  useEffect(() => {
    const hebRef = db
      .collection("stores")
      .doc("HEB")
      .collection("map-data")
      .doc("walls");
    hebRef.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().wallCoordinates) {
          setWallCoordinates(doc.data().wallCoordinates);
        }
        if (doc.data().mapSize.width && doc.data().mapSize.height) {
          setMapWidth(doc.data().mapSize.width);
          setMapHeight(doc.data().mapSize.height);
        }
        if (doc.data().aisles[0]) {
          setAisles(doc.data().aisles);
        }
      }
    });
  }, []);

  function onSave() {
    const hebRef = db
      .collection("stores")
      .doc("HEB")
      .collection("map-data")
      .doc("walls");
    hebRef.set({
      wallCoordinates: wallCoordinates,
      aisles: aisles,

      mapSize: { height: mapHeight, width: mapWidth },
    });
  }

  function mouseMove(e) {
    e.preventDefault();

    setMousePos({ x: e.clientX - drawRectLeft, y: e.clientY - drawRectTop });

    if (mousePos.x && mousePos.y) {
      if (mousePos.x % 6 <= 2 && mousePos.y % 6 <= 2) {
        setCursorPos({
          x: mousePos.x - (mousePos.x % 6),
          y: mousePos.y - (mousePos.y % 6),
        });
      }
      if (mousePos.x % 6 >= 4 && mousePos.y % 6 <= 2) {
        setCursorPos({
          x: mousePos.x + 6 - (mousePos.x % 6),
          y: mousePos.y - (mousePos.y % 6),
        });
      }
      if (mousePos.x % 6 <= 2 && mousePos.y % 6 >= 4) {
        setCursorPos({
          x: mousePos.x - (mousePos.x % 6),
          y: mousePos.y + 6 - (mousePos.y % 6),
        });
      }
      if (mousePos.x % 6 >= 4 && mousePos.y % 6 >= 4) {
        setCursorPos({
          x: mousePos.x + 6 - (mousePos.x % 6),
          y: mousePos.y + 6 - (mousePos.y % 6),
        });
      }
    }

    if (!firstClick && cursorPos.x && cursorPos.y) {
      setTempWalls({ start: tempStart, end: cursorPos });
    }
  }

  function createWall() {
    if (firstClick && cursorPos.x && cursorPos.y) {
      setTempStart(cursorPos);
      setFirstClick(false);
    } else if (firstClick && (!cursorPos.x || !cursorPos.y)) {
      mouseMove();
      setTempStart(cursorPos);
      setFirstClick(false);
    } else if (!firstClick && cursorPos.x && cursorPos.y) {
      const newCoordinates = wallCoordinates;
      const end = cursorPos;

      newCoordinates.push({ start: tempStart, end: end });
      setWallCoordinates(newCoordinates);
      setFirstClick(true);
      setTempStart(null);
      setTempWalls(null);
    }
  }

  function createAisle() {
    if (cursorPos.x && cursorPos.y) {
      let takenIndex = -1;
      aisles.forEach((ai, index) => {
        //turn into findIndex()
        if (
          cursorPos.x === ai.coordinate.x &&
          cursorPos.y === ai.coordinate.y
        ) {
          takenIndex = index;
        }
      });
      if (takenIndex === -1) {
        setTakenPos({ x: 0, y: 0 });
        setTakenIndex(-1);
        setAisles([...aisles, { coordinate: cursorPos }]);
      } else {
        console.log("click aisle happened");
        setTakenPos({ x: cursorPos.x, y: cursorPos.y });
        setTakenIndex(takenIndex);
      }
    }
  }

  function handleSwitch() {
    setSwich(!swich);
  }

  function ClearWalls() {
    setWallCoordinates([]);
  }

  return (
    <div
      style={{
        flexDirection: "column",
        paddingTop: 20,
        float: "left",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p className="map-par" style={{ width: 35, paddingRight: 6, top: 0 }}>
          {Math.round(mapHeight / 3)} <br /> ft
        </p>

        <Resizable
          className="grid-map"
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false,
          }}
          style={{
            outlineColor: "black",
            outlineWidth: "4px",
            outlineStyle: "solid",
            boxSizing: "content-box",
            borderWidth: 0,
            margin: 0,
          }}
          minWidth="150"
          minHeight="150"
          maxWidth="1200"
          maxHeight="1200"
          defaultSize={{ width: mapWidth, height: mapHeight }}
          onResizeStop={(e, direction, ref, d) => {
            setMapWidth(mapWidth + d.width);
            setMapHeight(mapHeight + d.height);
            console.log("Width: ", mapWidth, "Height: ", mapHeight);
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <svg
              ref={blueprintWindow}
              onClick={swich ? createAisle : createWall}
              id="svgWin"
              width={mapWidth}
              height={mapHeight}
              onMouseMove={(e) => mouseMove(e)}
            >
              <circle cx={cursorPos.x} cy={cursorPos.y} r="2"></circle>
              <defs>
                <pattern
                  id="smallGrid"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 6 0 L 0 0 0 6"
                    fill="none"
                    stroke="black"
                    strokeWidth="0.75"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="60" height="60" fill="url(#smallGrid)" />
                </pattern>
              </defs>
              <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

              {aisles ? (
                aisles.map((ai, index) => {
                  return (
                    <g key={index}>
                      <circle
                        cx={ai.coordinate.x}
                        cy={ai.coordinate.y}
                        r={3}
                        stroke="black"
                        strokeWidth={1}
                        fill="yellow"
                      ></circle>
                    </g>
                  );
                })
              ) : (
                <></>
              )}

              {wallCoordinates.map((coordinates, index) => {
                return (
                  <Wall
                    start={coordinates.start}
                    end={coordinates.end}
                    key={index}
                  />
                );
              })}

              {tempWalls ? (
                <Wall start={tempWalls.start} end={tempWalls.end} />
              ) : (
                <></>
              )}
            </svg>
          </div>
        </Resizable>
      </div>
      <div
        style={{
          position: "relative",
          right: cursorPos.x,
          top: cursorPos.y,
        }}
      ></div>
      <p
        className="map-par"
        style={{
          height: 50,
          marginTop: 5,
          marginLeft: 50,
          width: mapWidth,
          bottom: 0,
        }}
      >
        {Math.round(mapWidth / 3)} ft
      </p>

      <Button style={{ marginRight: 10 }} onClick={ClearWalls}>
        Clear Walls
      </Button>
      <Button style={{ margin: 20 }} onClick={onSave}>
        Save
      </Button>
      <div style={{ flexDirection: "row" }}>
        {swich ? <></> : <h3 style={{ flex: 1 }}>Wall</h3>}

        <Switch
          onChange={handleSwitch}
          checked={swich}
          offColor="#b3d5ff"
          uncheckedIcon={false}
          checkedIcon={false}
        />
        {swich ? <h3 style={{ flex: 1 }}>Aisle</h3> : <></>}
      </div>
      {swich ? (
        <Button
          style={{ flex: 1 }}
          onClick={() => setAddingLocations(!addingLocations)}
        >
          {addingLocations
            ? "Stop Assigning Item Locations"
            : "Assign Item Locations"}
        </Button>
      ) : (
        <></>
      )}

      {takenPos.x !== 0 && takenPos.y !== 0 ? (
        <AisleForm index={takenIndex} aisles={aisles}></AisleForm>
      ) : (
        <></>
      )}
    </div>
  );
}

const Wall = ({ start, end }) => {
  return (
    <g>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="black"
        strokeWidth={2}
      />

      <circle
        cx={start.x}
        cy={start.y}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />

      <circle
        cx={end.x}
        cy={end.y}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />
    </g>
  );
};
