import "../styles.css";
import React from "react";
import Header from "../home-page/home-subcomponents/Header";
import Footer from "../home-page/home-subcomponents/Footer";
import SignoutPanel from "../home-page/home-subcomponents/SignoutPanel";
import LeftPanel from "../home-page/home-subcomponents/LeftPanel";
import RightPanel from "../home-page/home-subcomponents/RightPanel";
import TweetInput from "../home-page/home-subcomponents/TweetInput";
import { auth, storage, db } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ref, getDownloadURL } from "@firebase/storage";
import { getDoc, doc } from "@firebase/firestore";

//This component is almost a mirror of the HomePage component but has a specific profile's info and tweets
const ProfilePage = () => {

    //This hook is used to retrieve info from the link that was clicked to get to this page
    const location = useLocation();

    //States to hold the RightPanel and the Footer; will update to null if someone is signed in
    const [footer, setFooter] = useState(<Footer />);
    const [rightPanel, setRightPanel] = useState(<RightPanel />);

    //This state is to hold the tweetInput component; set to null untill the "Tweet" button is clicked
    const [tweetInput, setTweetInput] = useState(null);

    //This state is for holding what the Header component says in the title and for changing it 
    const [headerMsg, setHeaderMsg] = useState(<h2 className="homeTitle">Home</h2>);

    //These states are for storing the profile information that is displayed at the top of the page
    const [userId, setUserId] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [userImg, setUserImg] = useState("");
    const [headerImg, setHeaderImg] = useState("");

    //These states are just used to get the buttons to be more interactive
    const [homeClass, setHomeClass] = useState("leftOption");
    const [profileClass, setProfileClass] = useState("leftOption selected");

    //Hook used to update the userId
    useEffect( () => {
        setUserId(location.state?.userId);
    }, [])

    //This is also in the HomePage comp; used to change the right panel depending on auth status
    onAuthStateChanged(auth, (user) => {
        if (user !== null && footer !== null) {
            setRightPanel(<SignoutPanel auth={auth} />);
            setFooter(null);
            setUserId(auth.currentUser ? auth.currentUser.uid : null);
        }
    });

    //I want to have a hook to check if auth.currentUser.uid is the same as the profileId passed in; if so, headerImg will be clickable and allow you to add a headerImg

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
            try {
                const headerRef = ref(storage, "header-images/", userId);
                getDownloadURL(headerRef).then( (headerSrc) => {
                    setHeaderImg(headerSrc);
                })
            }
            catch (error) {
                console.log(error);

            }
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
            setHomeClass("");
            setProfileClass("");
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
            <LeftPanel onTweetHandler={onTweetHandler} onProfileHandler={onProfileHandler} onHomeHandler={onHomeHandler} homeClass={homeClass} profileClass={profileClass} />
            <Header header={headerMsg}/>
            <div className="homeContent">
                <div className="homeFeed">
                    <div className="profileDiv">
                        <div className="headerDiv">
                            
                        </div>
                        <div className="profileInfoDiv">
                            
                        </div>
                        <div className="profileBtns">

                        </div>
                    </div>
                </div>
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default ProfilePage;