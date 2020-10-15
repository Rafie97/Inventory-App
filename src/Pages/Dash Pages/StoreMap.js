import React, { Component } from 'react';
import { useEffect, useState, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Resizable } from 're-resizable';

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

    let drawRectLeft;
    let drawRectTop;

    useEffect(() => {
        drawRectLeft = blueprintWindow.current.getBoundingClientRect().left;
        drawRectTop = blueprintWindow.current.getBoundingClientRect().top;
    })


    function mouseMove(e) {
        e.preventDefault();

        setPosition({ x: e.clientX - drawRectLeft, y: e.clientY - drawRectTop });

        if (!firstClick && position.x && position.y ) {

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
        else if(firstClick && (!position.x || !position.y)){
            mouseMove();
            setTempStart(position);
            setFirstClick(false);
        }
        else if (!firstClick && position.x && position.y) {
            
            const newCoordinates = wallCoordinates;
            let end;

            
                wallCoordinates.forEach(coord => {
                    if (position.x < coord.start.x + 10 && position.x > coord.start.x - 10) {
                        end= { x: coord.start.x, y: position.y }
                    }
                    if (position.y < coord.start.y + 10 && position.y > coord.start.y - 10) {
                        end= { x: position.x, y: coord.start.y } 
                    }
                    if (position.x < coord.end.x + 10 && position.x > coord.end.x - 10) {
                        end= { x: coord.end.x, y: position.y } 
                    }
                    if (position.y < coord.end.y + 10 && position.y > coord.end.y - 10) {
                        end= { x: position.x, y: coord.end.y }
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
        <div style={{ flexDirection: "column", paddingTop: 20 }}>
            <Resizable className='box' 
                minWidth="150"
                minHeight="150"
                maxWidth="1200"
                maxHeight="1200"
                defaultSize={{ width:350, height:350}}
                onResizeStop={(e, direction, ref, d) => {
                    setMapWidth(mapWidth + d.width);
                    setMapHeight(mapHeight + d.height);
                    console.log('Width: ', mapWidth, 'Height: ', mapHeight);
                }} >

                <div className="poopoo" style={{display: 'flex', flexDirection:'row'}}>
                    <p style={{width:50, alignSelf:'center'}}>{Math.round(mapHeight/3)} ft</p>

                    <svg  ref={blueprintWindow} width={mapWidth} height={mapHeight}  onClick={ isWallSelected ? (CreateWall):(CreateAisle)} onMouseMove={e => mouseMove(e)}  >

                        <line x1={0} y1={10} x2={mapWidth} y2={10} stroke="#283d6d" strokeWidth={5} strokeDasharray={[15, 5]}  />

                        <line x1={10} y1={0} x2={10} y2={mapHeight} stroke="#283d6d" strokeWidth={5} strokeDasharray={[15, 5]} />

                        <line x1={0} y1={mapHeight-10} x2={mapWidth} y2={mapHeight-10} stroke="#283d6d" strokeWidth={5} strokeDasharray={[15, 5]} />

                        <line x1={mapWidth-10} y1={0} x2={mapWidth-10} y2={mapHeight} stroke="#283d6d" strokeWidth={5} strokeDasharray={[15, 5]} />


                        <defs>
                            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#525252" stroke-width="0.75" />
                            </pattern>
                            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse" x='12' y='12'>
                                <rect width="100" height="100" fill="url(#smallGrid)" />
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="black" stroke-width="1" />
                            </pattern>
                        </defs>
                        <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

                        {wallCoordinates.map((coordinates, index) => {
                            return (<Wall start={coordinates.start} end={coordinates.end} key={index} position={position} />)
                        })}
                        {tempWalls ? (<Wall start={tempWalls.start} end={tempWalls.end} position={position} />) : (<></>)}
                    </svg>
                </div>

                <p style={{height:50, alignSelf:'center', marginLeft:50}}>{Math.round(mapWidth/3)} ft</p>

            </Resizable>

            <Form.Group type="radio">
                <Form.Check type="radio" label="Wall" name="group1"></Form.Check>
                <Form.Check type="radio" label="Aisle" name="group1"></Form.Check>
            </Form.Group>

            <Button style={{ marginRight: 20 }} onClick={ClearWalls} >Clear Walls</Button>
            <Button>Save</Button>

        </div>
    );
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

const Aisle = ({ start, end }) => (
    <g>
        <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="black"
            strokeWidth={6}
        />

        <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="white"
            strokeWidth={2}
            strokeDasharray={[5, 5]}
        />
    </g>
)



