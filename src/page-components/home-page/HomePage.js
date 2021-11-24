import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import Footer from "./home-subcomponents/Footer";
import HomeFeed from "./home-subcomponents/HomeFeed";
import SignoutPanel from "./home-subcomponents/SignoutPanel";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";
import TweetInput from "./home-subcomponents/TweetInput";
import { auth, storage, db } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "@firebase/storage";
import { getDoc, doc } from "@firebase/firestore";





const HomePage = () => {

    //States to hold the RightPanel and the Footer; will update to null if someone is signed in
    const [footer, setFooter] = useState(<Footer />);
    const [rightPanel, setRightPanel] = useState(<RightPanel />);

    //This state is to hold the tweetInput component; set to null untill the "Tweet" button is clicked
    const [tweetInput, setTweetInput] = useState(null);

    //This state is for holding important information about the user (prof pic and user data) 
    const [userInfo, setUserInfo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userImg, setUserImg] = useState("");

    //This state is for holding what the Header component says in the title and for changing it 
    const [headerMsg, setHeaderMsg] = useState(<h2 className="homeTitle">Home</h2>);

    //These states are just used to get the buttons to be more interactive
    const [homeClass, setHomeClass] = useState("leftOption selected");
    const [profileClass, setProfileClass] = useState("leftOption");

    //This observer is used to check if someone is signed in; If yes, the homeFeed and rightPanel will be set to null
    onAuthStateChanged(auth, (user) => {
        if (user !== null && footer !== null) {
            setRightPanel(<SignoutPanel auth={auth} />);
            setFooter(null);
            setUserId(auth.currentUser ? auth.currentUser.uid : null);
        }
    });

    //This hook is used to cleanup the states before unmounting
    useEffect( () => {
        return () => {
            setFooter(null);
            setRightPanel(null);
            setTweetInput(null);
            setUserInfo(null);
            setUserId(null);
            setUserImg("");
            setHeaderMsg(null);
        }
    }, []);

    //This hook is used to retrieve the current user's prof pic and userInfo
    useEffect( () => {
        if (userId !== null) {
            const imageRef = ref(storage, "user-images/" + userId);
            getDownloadURL(imageRef).then( (imageSrc) => {
                setUserImg(imageSrc);
            }); 
        }
    }, [userId])

    //This hook is used to retrieve the userInfo from firestore
    useEffect( () => {
        if (userId !== null) {
            const userRef = doc(db, "users", userId);
            getDoc(userRef).then( (user) => {
                setUserInfo(user.data());
            })
        }
    }, [userId])

    //Function for handling normal tweets
    const onTweetHandler = (parentTweet) => {
        if (userId) {
            setTweetInput(<TweetInput parentTweet={parentTweet} userId={userId} profPic={userImg} closeTweet={closeTweetHandler}/>)
        }
        else {
            alert("Please sign in to tweet.");
        }
    }

    const closeTweetHandler = () => {
        setTweetInput(null);
    }

    return (
        <div className="homepage">
            {tweetInput}
            <LeftPanel onTweetHandler={onTweetHandler} userInfo={userInfo} userId={userId} homeClass={homeClass} profileClass={profileClass} />
            <Header header={headerMsg}/>
            <div className="homeContent">
                <HomeFeed onTweetHandler={onTweetHandler}/>
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default HomePage;