import React, { Component } from 'react';
import { useEffect, useState, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Resizable } from 're-resizable';
import ReactDOM from 'react-dom';

export default function StoreMap() {


    const [firstClick, setFirstClick] = useState(true);

    const [wallCoordinates, setWallCoordinates] = useState([]);
    const [tempWalls, setTempWalls] = useState(null);

    const [isWallSelected, setIsWall] = useState(true)

    const [tempStart, setTempStart] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [mapWidth, setMapWidth] = useState(300);
    const [mapHeight, setMapHeight] = useState(300);


    const blueprintWindow = useRef(null);

    const aisleForm = useRef(null);


    let drawRectLeft;
    let drawRectTop;

    useEffect(() => {
        drawRectLeft = blueprintWindow.current.getBoundingClientRect().left;
        drawRectTop = blueprintWindow.current.getBoundingClientRect().top;
    })


    function mouseMove(e) {
        e.preventDefault();

        setPosition({ x: e.clientX - drawRectLeft, y: e.clientY - drawRectTop });

        if (!firstClick && position.x && position.y) {

            if (wallCoordinates) {
                wallCoordinates.forEach(coord => {
                    if (position.x < coord.start.x + 10 && position.x > coord.start.x - 10) {
                        setTempWalls({ start: tempStart, end: { x: coord.start.x, y: position.y } })
                    }
                    if (position.y < coord.start.y + 10 && position.y > coord.start.y - 10) {
                        setTempWalls({ start: tempStart, end: { x: position.x, y: coord.start.y } })
                    }
                    if (position.x < coord.end.x + 10 && position.x > coord.end.x - 10) {
                        setTempWalls({ start: tempStart, end: { x: coord.end.x, y: position.y } })
                    }
                    if (position.y < coord.end.y + 10 && position.y > coord.end.y - 10) {
                        setTempWalls({ start: tempStart, end: { x: position.x, y: coord.end.y } })
                    }
                })
            }

            if (tempStart.x > position.x - 10 && tempStart.x < position.x + 10) {
                setTempWalls({ start: tempStart, end: { x: tempStart.x, y: position.y } })
            }
            else if (tempStart.y > position.y - 10 && tempStart.y < position.y + 10) {
                setTempWalls({ start: tempStart, end: { x: position.x, y: tempStart.y } })
            }
            else {
                setTempWalls({ start: tempStart, end: position });
            }

            console.log(position);
        }
    }

    function createAisle() {
        const aisleWidth = aisleForm.current.children.divAWidth.children.aisleWidthControl.value;
        const aisleNum = aisleForm.current.children.divANum.children.aisleNumberControl.value;
        const sections = aisleForm.current.children.divSections.children.numSectionsControl.value;
        const shelves = aisleForm.current.children.divShelves.children.numShelvesControl.value;

        const aisle = (<Aisle aisleNumber={aisleNum} width={aisleWidth} numSections={sections} numShelves={shelves} position={{start:{x:50, y:50}, end:{x:150, y:150}}} ></Aisle>);
        console.log(aisle);
        //blueprintWindow.current.appendChild(aisle);

        ReactDOM.createPortal(<Aisle aisleNumber={aisleNum} width={aisleWidth} numSections={sections} numShelves={shelves} position={{start:{x:50, y:50}, end:{x:150, y:150}}} />, blueprintWindow.current);
    }

    function CreateWall() {
        if (firstClick && position.x && position.y) {
            if (wallCoordinates) {
                wallCoordinates.forEach(coord => {
                    if (position.x < coord.start.x + 10 && position.x > coord.start.x - 10 && position.y < coord.start.y + 10 && position.y > coord.start.y - 10) {
                        setTempStart(coord.start)
                    }
                    if (position.x < coord.end.x + 10 && position.x > coord.end.x - 10 && position.y < coord.end.y + 10 && position.y > coord.end.y - 10) {
                        setTempStart(coord.end)
                    }
                })
            }
            if (!tempStart) {
                setTempStart(position);
            }
            setFirstClick(false);

        }
        else if (firstClick && (!position.x || !position.y)) {
            mouseMove();
            setTempStart(position);
            setFirstClick(false);
        }
        else if (!firstClick && position.x && position.y) {

            const newCoordinates = wallCoordinates;
            let end;


            wallCoordinates.forEach(coord => {
                if (position.x < coord.start.x + 10 && position.x > coord.start.x - 10) {
                    end = { x: coord.start.x, y: position.y }
                }
                if (position.y < coord.start.y + 10 && position.y > coord.start.y - 10) {
                    end = { x: position.x, y: coord.start.y }
                }
                if (position.x < coord.end.x + 10 && position.x > coord.end.x - 10) {
                    end = { x: coord.end.x, y: position.y }
                }
                if (position.y < coord.end.y + 10 && position.y > coord.end.y - 10) {
                    end = { x: position.x, y: coord.end.y }
                }
            })

            if (tempStart.x > position.x - 10 && tempStart.x < position.x + 10 && !end) {
                end = { x: tempStart.x, y: position.y };
            }
            else if (tempStart.y > position.y - 10 && tempStart.y < position.y + 10 && !end) {
                end = { x: position.x, y: tempStart.y }
            }
            else {
                end = position;
            }

            newCoordinates.push({ start: tempStart, end: end });
            setWallCoordinates(newCoordinates)
            setFirstClick(true);
            setTempStart(null);
            setTempWalls(null);
        }
    }

    function ClearWalls() {
        setWallCoordinates([]);
    }

    return (
        <div style={{ flexDirection: "column", paddingTop: 20, float: "left" }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ width: 30, }}>{Math.round(mapHeight / 3)} ft</p>

                <Resizable className='box'
                    style={{ outlineColor: 'black', outlineWidth: "5px", outlineStyle: "solid", boxSizing: 'content-box', borderWidth: 0, }}
                    minWidth="150"
                    minHeight="150"
                    maxWidth="1200"
                    maxHeight="1200"

                    defaultSize={{ width: 300, height: 300 }}
                    onResizeStop={(e, direction, ref, d) => {
                        setMapWidth(mapWidth + d.width);
                        setMapHeight(mapHeight + d.height);
                        console.log('Width: ', mapWidth, 'Height: ', mapHeight);
                    }} >

                    <div style={{ display: 'flex', flexDirection: 'row' }}>

                        <svg ref={blueprintWindow} width={mapWidth} height={mapHeight} onMouseMove={e => mouseMove(e)}  >
                            <defs>
                                <pattern id="smallGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                                    <path d="M 6 0 L 0 0 0 6" fill="none" stroke="black" stroke-width="0.75" />
                                </pattern>
                                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse" >
                                    <rect width="60" height="60" fill="url(#smallGrid)" />
                                </pattern>
                            </defs>
                            <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

                            {wallCoordinates.map((coordinates, index) => {
                                return (<Wall start={coordinates.start} end={coordinates.end} key={index} position={position} />)
                            })}
                            {tempWalls ? (<Wall start={tempWalls.start} end={tempWalls.end} position={position} />) : (<></>)}
                        </svg>
                    </div>

                </Resizable>
            </div>

            <p style={{ height: 50, alignSelf: 'center', marginLeft: 50 }}>{Math.round(mapWidth / 3)} ft</p>



            <Form.Group ref={aisleForm}>
                <Form.Label>Please choose some specifications for a new aisle.</Form.Label>
                <div name = "divAWidth" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, margin: 20 }}>
                    <Form.Label style={{ marginRight: 4 }}>Width: </Form.Label>
                    <Form.Control name="aisleWidthControl" defaultValue="4" style={{ width: "4rem", position: "relative", bottom: 4, display: "inline", fontWeight: "bold", fontSize: 30, textAlign: "center", padding: 0, height: 40 }} ></Form.Control>
                    <div style={{ display: "inline" }}>ft</div>
                </div>

                <div name = "divANum" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, margin: 20 }}>
                    <Form.Label style={{ marginRight: 4 }}>Aisle Number: </Form.Label>
                    <Form.Control name="aisleNumberControl" style={{ width: "4rem", position: "relative", bottom: 4, display: "inline", fontWeight: "bold", fontSize: 30, textAlign: "center", padding: 0, height: 40 }} ></Form.Control>
                </div>

                <div name = "divSections" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, margin: 20 }}>
                    <Form.Label style={{ marginRight: 4 }}>Number of Sections: </Form.Label>
                    <Form.Control name="numSectionsControl" defaultValue="Auto" style={{ width: "5rem", position: "relative", bottom: 4, display: "inline", fontWeight: "bold", fontSize: 30, textAlign: "center", padding: 0, height: 40 }} ></Form.Control>
                </div>

                <div name="divShelves" style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, margin: 20 }}>
                    <Form.Label style={{ marginRight: 4 }}>Number of Shelves: </Form.Label>
                    <Form.Control name="numShelvesControl" defaultValue="4" style={{ width: "4rem", position: "relative", bottom: 4, display: "inline", fontWeight: "bold", fontSize: 30, textAlign: "center", padding: 0, height: 40 }} ></Form.Control>
                </div>
                <Button onClick={createAisle}>OK</Button>

            </Form.Group>

            <Button style={{ marginRight: 20 }} onClick={ClearWalls} >Clear Walls</Button>
            <Button>Save</Button>

        </div>
    );
}

class Aisle extends Component {

    constructor(props) {
        super(props)
        this.aisle_number = props.aisleNumber;
        this.num_sections = props.numSections;
        this.num_shelves = props.numShelves;
        this.position = props.position;
        this.width = props.width;
    }

    render() {
        return (
            <g>
                <line
                    x1={this.position.start.x}
                    y1={this.position.start.y}
                    x2={this.position.end.x}
                    y2={this.position.end.y}
                    stroke="black"
                    strokeWidth={this.width}
                />

                <line
                    x1={this.position.start.x}
                    y1={this.position.start.y}
                    x2={this.position.end.x}
                    y2={this.position.end.y}
                    stroke="white"
                    strokeWidth={this.width - 2}
                    strokeDasharray={[5, 5]}
                />
            </g>
        )
    }


}

const Wall = ({ start, end, position }) => {

    const [firstCorner, setFirstCorner] = useState(false);
    const [secondCorner, setSecondCorner] = useState(false);

    useEffect(() => {
        if (position.x < start.x + 10 && position.x > start.x - 10 && position.y < start.y + 10 && position.y > start.y - 10) {
            setFirstCorner(true);
        }
        else {
            setFirstCorner(false);
        }

        if (position.x < end.x + 10 && position.x > end.x - 10 && position.y < end.y + 10 && position.y > end.y - 10) {
            setSecondCorner(true);
        }
        else {
            setSecondCorner(false);
        }
    })


    return (
        <g >
            <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="white"
                strokeWidth={6}
            />

            <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#283d6d"
                strokeWidth={2}
                strokeDasharray={[15, 5]}
            />

            {firstCorner ? (<circle cx={start.x} cy={start.y} r={4} stroke="white" strokeWidth={1} fill="#283d6d" />) : (<></>)}
            {secondCorner ? (<circle cx={end.x} cy={end.y} r={4} stroke="white" strokeWidth={1} fill="#283d6d" />) : (<></>)}
        </g>
    )
}





