import { useState, useEffect } from "react";








const HoverPopup = (props) => {

    const [textHovered, setTextHovered] = useState(props.hovered);
    const [prevHovered, setPrevHovered] = useState(false);

    useEffect( () => {
        setTextHovered(props.hovered);
    }, [props.hovered])

    const mouseEnterHandler = () => {
        setPrevHovered(true);
    }

    const mouseOutHandler = () => {
        setPrevHovered(false);
    }

    return (
        <div onMouseEnter={mouseEnterHandler} onMouseOut={mouseOutHandler} style={prevHovered || textHovered ? {display: "block"} : {display: "none"}} className="hoverPopup">

        </div>
    )
}

export default HoverPopup;