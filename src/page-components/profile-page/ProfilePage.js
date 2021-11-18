import "../styles.css";
import React from "react";
import Header from "../home-page/home-subcomponents/Header";
import Footer from "../home-page/home-subcomponents/Footer";
import SignoutPanel from "../home-page/home-subcomponents/SignoutPanel";
import LeftPanel from "../home-page/home-subcomponents/LeftPanel";
import RightPanel from "../home-page/home-subcomponents/RightPanel";
import TweetInput from "../home-page/home-subcomponents/TweetInput";
import Tweet from "../home-page/home-subcomponents/Tweet";
import uniqid from "uniqid";
import { monthToString } from "./profilePageFunctions";
import { auth, storage, db } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";
import { getDoc, doc, Timestamp } from "@firebase/firestore";

//This component is almost a mirror of the HomePage component but has a specific profile's info and tweets
const ProfilePage = () => {

    //This hook is used to retrieve info from the link that was clicked to get to this page
    const location = useLocation();

    //This hook is for styling the file input
    const hiddenFileInput = useRef(null);

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
    const [follows, setFollows] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [userImg, setUserImg] = useState("");
    const [headerImg, setHeaderImg] = useState("");
    const [isUsersPage, setIsUsersPage] = useState(false);
    const [userTweets, setUserTweets] = useState([]);

    //These states are just used to get the as to be more interactive
    const [homeClass, setHomeClass] = useState("leftOption");
    const [profileClass, setProfileClass] = useState("leftOption selected");

    //Hook used to update the userId
    useEffect( () => {
        setUserId(location.state?.userId);
        setCurrentUserId(location.state?.currentUserId);
    }, [])

    //This hook is to check if the current user is viewing their own page; if so isUserPage will be set to true
    useEffect( () => {
        if (userId === currentUserId) {
            setIsUsersPage(true);
        }
    }, [userId, currentUserId])

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
                let tempUserInfo = user.data();
                tempUserInfo.joinDate = `${monthToString(tempUserInfo.joinDate.toDate().getMonth())} ${tempUserInfo.joinDate.toDate().getFullYear()}`;
                setUserInfo(tempUserInfo);
                setFollows(tempUserInfo.follows.length);
                setFollowers(tempUserInfo.followers.length);
            })
            const imageRef = ref(storage, "user-images/" + userId);
            getDownloadURL(imageRef).then( (imageSrc) => {
                setUserImg(imageSrc);
            }); 
            try {
                const headerRef = ref(storage, "user-headers/", userId);
                getDownloadURL(headerRef).then( (headerSrc) => {
                    setHeaderImg(headerSrc);
                })
            }
            catch (error) {
                console.log(error);
                setHeaderImg(null);
            }
        } 
    }, [userId])

    //This hook is for retrieving all the tweets from the tweetsArray (contains tweetIds) in the userInfo
    useEffect( () => {
        if (userInfo)
        {
            const tweetIds = userInfo.tweets;
            const tweetsArray = new Array(0);
            for (let i = 0; i < tweetIds.length; i++) {
                const tweetRef = doc(db, "tweets", tweetIds[i]);
                getDoc(tweetRef).then( async (tweet) => {
                    const newData = await tweet.data();
                    tweetsArray.push(newData);
                    if (i === tweetIds.length - 1) {
                        setUserTweets(tweetsArray);
                    }
                })
            }
        } 
    }, [userInfo])

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

    const handleHeaderClick = (e) => {
        console.log("handle image click");
        hiddenFileInput.current.click();
    }

    const handleHeaderChange = async (e) => {
        const fileUploaded = e.target.files[0];
        const headerRef = ref(storage, "user-headers/", userId);
        await uploadBytes(headerRef, fileUploaded);
        window.location.reload();
    }

    return (
        <div className="homepage">
            {tweetInput}
            <LeftPanel onTweetHandler={onTweetHandler} onProfileHandler={onProfileHandler} onHomeHandler={onHomeHandler} homeClass={homeClass} profileClass={profileClass} />
            <Header header={headerMsg}/>
            <div className="homeContent">
                <div className="homeFeed">
                    <div className="profileDiv">
                        <div onClick={isUsersPage ? handleHeaderClick : null} className={headerImg ? "headerDiv" : "emptyHeaderDiv"}>
                            {headerImg ? <img className="headerImg" src={headerImg} alt="Profile's Header" /> : 
                                <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center"}}>
                                    <svg className="emptyHeaderImg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                    <input onChange={handleHeaderChange} type="file" ref={hiddenFileInput} style={{display: "none"}} />
                                </div>
                            }
                        </div>
                        <div className="profileInfoDiv">
                            <img className="profileUserImg" src={userImg} alt="Profile user" />
                            <div className="profileInfo">
                                <h3>{userInfo.displayName}</h3>
                                <p style={{color: "rgb(125, 125, 125)"}} className="profInfoFont">{`@${userInfo.username}`}</p>
                                <p className="profInfoFont">{userInfo.bio}</p>
                                <p style={{color: "rgb(125, 125, 125)"}} className="profInfoFont">{`Joined ${userInfo.joinDate}`}</p>
                            </div>
                            <div className="profileFollowInfo">
                                <span className="profileFollowSpan">
                                    <p style={{marginRight: "0.25em"}}>{`${follows}`}</p>
                                    <p style={{color: "rgb(125, 125, 125)"}}>{"Following"}</p>
                                </span>
                                <span className="profileFollowSpan">
                                    <p style={{marginRight: "0.25em"}}>{`${followers}`}</p>
                                    <p style={{color: "rgb(125, 125, 125)"}}>{"Followers"}</p>
                                </span>
                            </div>
                        </div>
                        <div className="profileBtnsDiv">
                            <a href={`/${userInfo.username}`} className="profileBtn profileBtnSelected">
                                <p className="profileBtnFont">Tweets</p>
                            </a>
                            <a href={`/${userInfo.username}/replies`} className="profileBtn">
                                <p className="profileBtnFont">Tweets & Replies</p>
                            </a>
                            <a href={`/${userInfo.username}/media`} className="profileBtn">
                                <p className="profileBtnFont">Media</p>
                            </a>
                            <a href={`/${userInfo.username}/likes`} className="profileBtn">
                                <p className="profileBtnFont">Likes</p>
                            </a>
                        </div>
                    </div>
                    {userTweets.length !== 0 ? userTweets.map( (tweet) => {
                        return <Tweet tweetInfo={tweet} key={uniqid()} />
                    }) : null}
                </div>
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default ProfilePage;