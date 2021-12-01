import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebase-config";







const HoverPopup = (props) => {

    //These two states keep track of the hover state of the tweet's username (textHovered) and the hover state of the preview (prevHovered) itself
    const [textHovered, setTextHovered] = useState(props.hovered);
    const [prevHovered, setPrevHovered] = useState(false);

    //This state is to store the user's information
    const [userInfo, setUserInfo] = useState({});
    const [userImg, setUserImg] = useState("");

    //State used to store a jsx element depending on if the current user follows the user in popup
    const [followBtn, setFollowBtn] = useState(null);

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

    //Hook used to update what the followBtn looks like depending on the current user's follow status
    useEffect( () => {
        if (userInfo.followers && auth.currentUser) {
            if (props.userId === auth.currentUser.uid) {
                setFollowBtn(null);
            }
            else {
                setFollowBtn(<button onClick={handleFollow} className="formBtn prevFollowBtn">Follow</button>);
            }
            for (let i = 0; i < userInfo.followers.length; i++) {
                if (userInfo.followers[i] === auth.currentUser.uid) {
                    setFollowBtn(<button onClick={handleFollow} className="formBtn prevFollowBtn following" ></button>);
                }
            }
        }
        else {
            setFollowBtn(null);
        }
    }, [userInfo])

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

    //Function for handling Follows
    const handleFollow = async (e) => {
        const userRef = doc(db, "users", props.userId);
        const user = (await getDoc(userRef)).data();
        const currentUserId = auth.currentUser.uid;
        const currentUserRef = doc(db, "users", currentUserId);
        const currentUser = (await getDoc(currentUserRef)).data();
        if (user.followers.includes(currentUserId)) {
            console.log("Unfollowed")
            let tempFollowers = user.followers;
            let tempFollows = currentUser.follows;
            console.log(tempFollowers);
            console.log(tempFollows);
            const newFollowers = tempFollowers.filter( follower => follower !== currentUserId);
            const newFollows = tempFollows.filter( follow => follow !== props.userId);
            console.log(newFollowers);
            console.log(newFollows);
            await updateDoc(userRef, {followers: newFollowers});
            await updateDoc(currentUserRef, {follows: newFollows});
        }
        else {
            console.log("Followed")
            let tempFollowers = user.followers;
            let tempFollows = currentUser.follows;
            console.log(tempFollowers);
            console.log(tempFollows);
            tempFollowers.push(currentUserId);
            tempFollows.push(props.userId)
            console.log(tempFollowers);
            console.log(tempFollows);
            await updateDoc(userRef, {followers: tempFollowers});
            await updateDoc(currentUserRef, {follows: tempFollows});
        }
        window.location.reload();
    }

    return (
        <div onMouseEnter={mouseEnterHandler} onMouseLeave={mouseOutHandler} style={prevHovered || textHovered ? {display: "flex"} : {display: "none"}} className="hoverPopup">
            <div className="prevHeader">
                <img width="50px" height="50px" className="tweetUserImg" src={userImg} alt="Tweet's User" />
                {followBtn}
            </div>
            <div className="prevUser">
                <p style={{fontSize: "1.5em"}} className="defaultFont tweeterDisplayName">{userInfo.displayName}</p>
                <p className="defaultFont tweeterInfo">{"@" + userInfo.username}</p>
            </div>
            <div className="prevBio">
                <p className="defaultFont">{userInfo.bio ? (userInfo.bio.length > 50 ? userInfo.bio.slice(0, 50) + "..." : userInfo.bio) : ""}</p>
            </div>
            <div className="prevFollows">
                <span style={{marginRight: "1em"}}>
                    <p className="defaultFont">{(userInfo.follows ? userInfo.follows.length : 0) + " Following"}</p>
                </span>
                <span>
                    <p className="defaultFont">{(userInfo.followers ? userInfo.followers.length : 0) + " Followers"}</p>
                </span>
            </div>
        </div>
    )
}

export default HoverPopup;