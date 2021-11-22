import "../styles.css";
import React from "react";
import Header from "../home-page/home-subcomponents/Header";
import Footer from "../home-page/home-subcomponents/Footer";
import SignoutPanel from "../home-page/home-subcomponents/SignoutPanel";
import LeftPanel from "../home-page/home-subcomponents/LeftPanel";
import RightPanel from "../home-page/home-subcomponents/RightPanel";
import TweetInput from "../home-page/home-subcomponents/TweetInput";
import Tweet from "../home-page/home-subcomponents/Tweet";
import { auth, storage, db } from "../../firebase-config";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ref, getDownloadURL } from "@firebase/storage";
import { getDoc, doc } from "@firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";




const TweetPage = (props) => {

    //This hook is used to retrieve info from the link that was clicked to get to this page
    const location = useLocation();

    //This hook is for getting around the fact you can't nest an anchor in an anchor
    const tweetPageLink = useRef(null);

    //States to hold the RightPanel and the Footer; will update to null if someone is signed in
    const [footer, setFooter] = useState(<Footer />);
    const [rightPanel, setRightPanel] = useState(<RightPanel />);

    //This state is to hold the tweetInput component; set to null untill the "Tweet" a is clicked
    const [tweetInput, setTweetInput] = useState(null);

    //This state is for holding what the Header component says in the title and for changing it 
    const [headerMsg, setHeaderMsg] = useState(<h2 className="homeTitle">Home</h2>);

    //These states are for storing the profile information that is displayed at the top of the page
    const [userId, setUserId] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [userInfo, setUserInfo] = useState("");
    const [userImg, setUserImg] = useState("");

    //This is also in the HomePage comp; used to change the right panel depending on auth status
    onAuthStateChanged(auth, (user) => {
        if (user !== null && footer !== null) {
            setRightPanel(<SignoutPanel auth={auth} />);
            setFooter(null);
            setCurrentUserId(auth.currentUser ? auth.currentUser.uid : null);
        }
    });

    //Hook used to update the userId
    useEffect( () => {
        setUserId(location.state?.userId);
        setCurrentUserId(location.state?.currentUserId);
    }, []) 

    //This hook is for retrieving the userInfo and userImg from the profileId passed in as props via location
    useEffect( () => {
        if (userId) {
            const userRef = doc(db, "users", userId);
            getDoc(userRef).then( (user) => {
                setUserInfo(user.data());
            })
            const imageRef = ref(storage, "user-images/" + userId);
            getDownloadURL(imageRef).then( (imageSrc) => {
                setUserImg(imageSrc);
            }); 
        } 
    }, [userId])

    //This hook is used to cleanup the states before unmounting
    useEffect( () => {
        return () => {
            setFooter(null);
            setRightPanel(null);
            setTweetInput(null);
            setUserId("");
            setHeaderMsg(null);
            setUserInfo({});
            setUserImg("");
        }
    }, []);

    const onTweetHandler = () => {
        if (userId) {
            setTweetInput(<TweetInput userId={userId} profPic={userImg} closeTweet={closeTweetHandler}/>)
        }
        else {
            alert("Please sign in to tweet.");
        }
    }

    const closeTweetHandler = () => {
        setTweetInput(null);
    }

    const onProfileHandler = (user) => {
        setUserId(user);
    }
    const onHomeHandler = () => {
        setHeaderMsg(<h2 className="homeTitle">Home</h2>);
    }

    return (
        <div className="homepage">
            {tweetInput}
            <LeftPanel onTweetHandler={onTweetHandler} onProfileHandler={onProfileHandler} onHomeHandler={onHomeHandler} homeClass={"leftOption"} profileClass={"leftOption"} />
            <Header header={headerMsg}/>
            <div className="homeContent">
                <div className="homeFeed">
                    
                </div>
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default TweetPage;