import React, { Component } from 'react';
import { useEffect, useState, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function StoreMap() {

    
    const [firstClick, setFirstClick] = useState(true);

    const [wallCoordinates, setWallCoordinates] = useState([]);
    const [tempWalls, setTempWalls] = useState(null);

    const [tempStart, setTempStart] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

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

        if (!firstClick && position && tempStart) {
            
            if(wallCoordinates){
                wallCoordinates.forEach(coord=>{
                    if(position.x < coord.start.x+10 && position.x>coord.start.x-10 ) {
                        setTempWalls({start:tempStart, end:{x: coord.start.x, y:position.y}})
                    }
                    if(position.y < coord.start.y+10 && position.y>coord.start.y-10) {
                        setTempWalls({start:tempStart, end:{x: position.x, y:coord.start.y}})
                    }
                    if(position.x < coord.end.x+10 && position.x>coord.end.x-10 ) {
                        setTempWalls({start:tempStart, end:{x: coord.end.x, y:position.y}})
                    }
                    if(position.y < coord.end.y+10 && position.y>coord.end.y-10) {
                        setTempWalls({start:tempStart, end:{x: position.x , y:coord.end.y}})
                    }
                })
            }

            console.log(position);
            if(tempStart.x > position.x -10 && tempStart.x < position.x + 10 ){
                setTempWalls({start:tempStart, end:{x: tempStart.x, y:position.y}})
            }
            else if(tempStart.y > position.y -10 && tempStart.y < position.y + 10 ){
                setTempWalls({start:tempStart, end:{x: position.x, y:tempStart.y}})
            }
            else{
                setTempWalls({ start: tempStart, end: position });
            }
        }
    }


    function CreateWall() {
        if (firstClick && position) {
            if(wallCoordinates){
                wallCoordinates.forEach(coord=>{
                    if(position.x < coord.start.x+10 && position.x>coord.start.x-10 && position.y < coord.start.y+10 && position.y>coord.start.y-10)
                    {
                        setTempStart(coord.start)
                    }
                    if(position.x < coord.end.x+10 && position.x>coord.end.x-10 && position.y < coord.end.y+10 && position.y>coord.end.y-10)
                    {
                        setTempStart(coord.end)
                    }
                })
            }
            if (!tempStart){
                setTempStart(position);
            }
            setFirstClick(false);
            
        }
        else if (position && tempStart) {
            setTempWalls(null);
            const newCoordinates = wallCoordinates;
            let end;

            if(tempStart.x > position.x -10 && tempStart.x < position.x + 10 ){
                end= {x: tempStart.x, y:position.y};
            }
            else if(tempStart.y > position.y -10 && tempStart.y < position.y + 10 ){
                end = {x: position.x, y:tempStart.y}
            }
            else{
                end = position;
            }

            newCoordinates.push({ start: tempStart, end: end });
            setWallCoordinates(newCoordinates)
            setFirstClick(true);
        }
    }

    function ClearMap(){
        setWallCoordinates([]);
    }

    return (
        <div style={{flexDirection:"column", paddingTop:20}}>
            <svg ref={blueprintWindow} width="800px" height="500px"  onClick={CreateWall} onMouseMove={e => mouseMove(e)} >
                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" />
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)" />
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {wallCoordinates.map((coordinates, index) => {
                    return (<Wall start={coordinates.start} end={coordinates.end} key={index}  position={position} />)
                })}
                {  tempWalls ? (<Wall start={tempWalls.start} end={tempWalls.end} position={position} />) : (<></>) }

                
            </svg>

            <Form.Group type="radio">
                <Form.Check type="radio" label="Wall" name="group1"></Form.Check>
                <Form.Check type="radio" label="Aisle" ></Form.Check>
            </Form.Group>

            <Button style = {{marginRight:20}}  onClick={ClearMap} >Clear</Button>
            <Button>Save</Button>

        </div>
    );
}

const Wall = ({ start, end, position }) => {

    const [firstCorner, setFirstCorner] = useState(false);
    const [secondCorner, setSecondCorner] = useState(false);

    useEffect(() => {
        if(position.x < start.x+10 && position.x > start.x-10 &&  position.y < start.y+10 && position.y > start.y-10 )
        {
            setFirstCorner(true);
        }
        else{
            setFirstCorner(false);
        }

        if(position.x < end.x+10 && position.x > end.x-10  && position.y < end.y+10 && position.y > end.y-10  )
        {
            setSecondCorner(true);
        }
        else {
            setSecondCorner(false);
        }
    })

    
    return(
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

            {firstCorner ? (<circle cx = {start.x} cy={start.y} r={4} stroke="white" strokeWidth={1} fill="#283d6d" />) : (<></>)}
            {secondCorner ? (<circle cx = {end.x} cy={end.y} r={4} stroke="white" strokeWidth={1} fill="#283d6d" />):(<></>)}
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



