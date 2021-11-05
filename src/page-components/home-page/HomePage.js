import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import Footer from "./home-subcomponents/Footer";
import HomeFeed from "./home-subcomponents/HomeFeed";
import SignoutPanel from "./home-subcomponents/SignoutPanel";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";
import TweetInput from "./home-subcomponents/TweetInput";
import { auth, storage } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "@firebase/storage";





const HomePage = () => {

    //States to hold the RightPanel and the Footer; will update to null if someone is signed in
    const [footer, setFooter] = useState(<Footer />);
    const [rightPanel, setRightPanel] = useState(<RightPanel />);

    //This state is to hold the tweetInput component; set to null untill the "Tweet" button is clicked
    const [tweetInput, setTweetInput] = useState(null);

    //This state is for holding important information about the user (prof pic and user data) 
    const [userInfo, setUserInfo] = useState(null);
    const [userId, setUserId] = useState();
    const [userImg, setUserImg] = useState("");

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
        }
    }, []);

    //This hook is used to retrieve the current user's prof pic
    useEffect( () => {
        const imageRef = ref(storage, "user-images/" + userId);
        getDownloadURL(imageRef).then( (imageSrc) => {
            setUserImg(imageSrc);
        })
    }, [userId])



    const onTweetHandler = () => {
        console.log(userImg);
        if (userId) {
            setTweetInput(<TweetInput profPic={userImg} />)
        }
        else {
            alert("Please sign in to tweet.");
        }
    }

    return (
        <div className="homepage">
            {tweetInput}
            <LeftPanel onTweetHandler={onTweetHandler} />
            <Header />
            <div className="homeContent">
                <HomeFeed />
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default HomePage;