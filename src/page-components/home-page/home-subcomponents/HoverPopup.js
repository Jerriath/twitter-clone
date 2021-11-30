import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase-config";







const HoverPopup = (props) => {

    //These two states keep track of the hover state of the tweet's username (textHovered) and the hover state of the preview (prevHovered) itself
    const [textHovered, setTextHovered] = useState(props.hovered);
    const [prevHovered, setPrevHovered] = useState(false);

    //This state is to store the user's information
    const [userInfo, setUserInfo] = useState({});
    const [userImg, setUserImg] = useState("");

    //This hook updates the textHovered state
    useEffect( () => {
        setTextHovered(props.hovered);
    }, [props.hovered])

    //This hook is for taking the props.userId and retrieving the info and img from backend
    useEffect( () => {
        const userRef = doc(db, "users", props.userId);
        const imgRef = ref(storage, "user-images/" + props.userId);
        getDoc(userRef).then( (userSnapshot) => {
            setUserInfo(userSnapshot.data());
        })
        getDownloadURL(imgRef).then( (imgSrc) => {
            setUserImg(imgSrc);
        })
    }, [props.userId])

    //Hook used for cleanup 
    useEffect( () => {
        return ( () => {
            setTextHovered("");
            setPrevHovered("");
            setUserImg("");
            setUserInfo("");
        })
    }, [])

    //These two functions are to keep track of the prevHovered state
    const mouseEnterHandler = () => {
        setPrevHovered(true);
    }
    const mouseOutHandler = () => {
        setPrevHovered(false);
    }
//Have to add in the rest of the information and also need to get the follow button working like how it works on profile page
    return (
        <div onMouseEnter={mouseEnterHandler} onMouseLeave={mouseOutHandler} style={prevHovered || textHovered ? {display: "flex"} : {display: "none"}} className="hoverPopup">
            <div className="prevHeader">
                <img width="50px" height="50px" className="tweetUserImg" src={userImg} alt="Tweet's User" />
                <button className="formBtn"></button>
            </div>
            <div className="prevUser">
                <p style={{fontSize: "1.5em"}} className="defaultFont tweeterDisplayName">{userInfo.displayName}</p>
                <p className="defaultFont tweeterInfo">{"@" + userInfo.username}</p>
            </div>
            <div className="prevBio">
                <p className="defaultFont">{userInfo.bio ? (userInfo.bio.length > 50 ? userInfo.bio.slice(0, 50) + "..." : userInfo.bio) : ""}</p>
            </div>
            <div className="prevFollows">
                <span>

                </span>
                <span>

                </span>
            </div>
        </div>
    )
}

export default HoverPopup;