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
import { monthToString, sortOnlyTweets, sortOnlyMedia } from "./profilePageFunctions";
import { auth, storage, db } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "@firebase/storage";
import { getDoc, doc, Timestamp, updateDoc } from "@firebase/firestore";

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

    //This state is for holding what the Header component and follow btn says in the title and for changing it 
    const [headerMsg, setHeaderMsg] = useState(<h2 className="homeTitle">Home</h2>);
    const [followBtn, setFollowBtn] = useState(<button className="formBtn followBtn" >Follow</button>);

    //These states are for storing the profile information that is displayed at the top of the page
    const [userId, setUserId] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [profilePage, setProfilePage] = useState(null);
    const [currentUserImg, setCurrentUserImg] = useState("");
    const [userInfo, setUserInfo] = useState("");
    const [currentUserInfo, setCurrentUserInfo] = useState("");
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
    }, [location])

    //This hook is to check if the current user is viewing their own page; if so isUserPage will be set to true
    useEffect( () => {
        if (userId === currentUserId && userId !== "" && currentUserId !== "") {
            setIsUsersPage(true);
        }
    }, [userId, currentUserId])

    //This is also in the HomePage comp; used to change the right panel depending on auth status
    onAuthStateChanged(auth, (user) => {
        if (user !== null && footer !== null) {
            setRightPanel(<SignoutPanel auth={auth} />);
            setFooter(null);
        }
    });

    //This hook is for retrieving the userInfo and userImg from the profileId passed in as props via location
    useEffect( () => {
        if (userId && currentUserId) {
            const userRef = doc(db, "users", userId);
            getDoc(userRef).then( (user) => {
                let tempUserInfo = user.data();
                tempUserInfo.joinDate = `${monthToString(tempUserInfo.joinDate.toDate().getMonth())} ${tempUserInfo.joinDate.toDate().getFullYear()}`;
                setUserInfo(tempUserInfo);
                setFollows(tempUserInfo.follows);
                setFollowers(tempUserInfo.followers);
                setHeaderMsg(<h2 className="homeTitle">{tempUserInfo.displayName}</h2>);
            })
            const currentUserRef = doc(db, "users", currentUserId);
            getDoc(currentUserRef).then( (user) => {
                setCurrentUserInfo(user.data());
            })
            const imageRef = ref(storage, "user-images/" + userId);
            const currentImageRef = ref(storage, "user-images/" + currentUserId);
            const headerRef = ref(storage, "user-headers/" + userId);
            getDownloadURL(imageRef).then( (imageSrc) => {
                setUserImg(imageSrc);
            }); 
            getDownloadURL(currentImageRef).then( (imageSrc) => {
                setCurrentUserImg(imageSrc);
            })
            try {
                getDownloadURL(headerRef).then( (headerSrc) => {
                    setHeaderImg(headerSrc);
                }); 
            }
            catch (error) {
                console.log(error);
                setHeaderImg(null);
            }
        } 
    }, [userId, currentUserId])

    //Function for handling Follows
    const handleFollow = async (e) => {
        const userRef = doc(db, "users", userId);
        const user = (await getDoc(userRef)).data();
        const currentUserRef = doc(db, "users", currentUserId);
        const currentUser = (await getDoc(currentUserRef)).data();
        if (user.followers.includes(currentUserId)) {
            console.log("Unfollowed")
            let tempFollowers = user.followers;
            let tempFollows = currentUser.follows;
            console.log(tempFollowers);
            console.log(tempFollows);
            const newFollowers = tempFollowers.filter( follower => follower !== currentUserId);
            const newFollows = tempFollows.filter( follow => follow !== userId);
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
            tempFollows.push(userId)
            console.log(tempFollowers);
            console.log(tempFollows);
            await updateDoc(userRef, {followers: tempFollowers});
            await updateDoc(currentUserRef, {follows: tempFollows});
        }
        window.location.reload();
    }

    //Hook used to changed the followBtnText depending on if currentUser is following or not
    useEffect( () => {
        if (userId === currentUserId) {
            setFollowBtn(null);
        }
        else {
            setFollowBtn(<button onClick={handleFollow} className="formBtn followBtn" >Follow</button>);
        }
        for (let i = 0; i < followers.length; i++) {
            if (followers[i] === currentUserId) {
                setFollowBtn(<button onClick={handleFollow} className="formBtn followBtn following" ></button>);
            }
        }
    }, [followers])

    //This hook is for retrieving all the tweets from the tweetsArray (contains tweetIds) in the userInfo
    useEffect( () => {
        if (userInfo)
        {
            const tweetIds = userInfo.tweets;
            const tweetsArray = new Array(0);
            for (let i = 0; i < tweetIds.length; i++) {
                const tweetRef = doc(db, "tweets", tweetIds[i]);
                getDoc(tweetRef).then( (tweet) => {
                    const newData = tweet.data();
                    tweetsArray.push(newData);
                    if (i === tweetIds.length - 1) {
                        tweetsArray.sort( (a, b) => {
                            return a.date - b.date ? -1 : 1;
                        })
                        setUserTweets(tweetsArray);
                        setProfilePage(location.state?.option);
                    }
                })
            }
        } 
    }, [userInfo, location.state?.option])

    //This hook is for updating the tweetsArray to match what tab the current user is in
    useEffect( () => {
        if (userTweets.length !== 0){
            if (profilePage === 0) {
                setUserTweets(sortOnlyTweets(userTweets));
            }
            else if (profilePage === 1) {
                return;
            }
            else if (profilePage === 2) {
                setUserTweets(sortOnlyMedia(userTweets));
            }
            else if (profilePage === 3) {
                //Done like this to use await on getDoc
                async function sortByLikes() {
                    const likesIds = userInfo.likes;
                    let tempArray = new Array(0);
                    for (let i = 0; i < likesIds.length; i++) {
                        const tweetRef = doc(db, "tweets", likesIds[i]);
                         await getDoc(tweetRef).then( (tweet) => {
                            const newData = tweet.data();
                            tempArray.push(newData);
                            if (i === likesIds.length - 1) {
                                tempArray.sort( (a, b) => {
                                    return a.date - b.date ? -1 : 1;
                                })
                                setUserTweets(tempArray);
                            }
                        })
                    }
                }
                sortByLikes();
            }
        }
    }, [profilePage])

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
            setFollowBtn(null);
        }
    }, []);

    const onTweetHandler = () => {
        if (currentUserId) {
            setTweetInput(<TweetInput userId={currentUserId} profPic={currentUserImg} closeTweet={closeTweetHandler}/>)
        }
        else {
            alert("Please sign in to tweet.");
        }
    }

    const closeTweetHandler = () => {
        setTweetInput(null);
    }

    const handleHeaderClick = (e) => {
        console.log("handle image click");
        hiddenFileInput.current.click();
    }

    const handleHeaderChange = async (e) => {
        const fileUploaded = e.target.files[0];
        try {
            const oldHeaderRef = ref(storage, "user-headers/" + userId);
            await deleteObject(oldHeaderRef);
            const newHeaderRef = ref(storage, "user-headers/" + userId);
            await uploadBytes(newHeaderRef, fileUploaded);
        }
        catch (error) {
            console.log(error);
            const newHeaderRef = ref(storage, "user-headers/" + userId);
            await uploadBytes(newHeaderRef, fileUploaded);
        }
        window.location.reload();
    }

    //I need to change the anchor elements to Links and pass in the same states that were in default profile page
    
    return (
        <div className="homepage">
            {tweetInput}
            <LeftPanel onTweetHandler={onTweetHandler} userId={currentUserId} userInfo={currentUserInfo} homeClass={homeClass} profileClass={profileClass}  />
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
                                </div>
                            }
                            <input onChange={handleHeaderChange} type="file" ref={hiddenFileInput} style={{display: "none"}} />
                        </div>
                        <div className="profileInfoDiv">
                            <img className="profileUserImg" src={userImg} alt="Profile user" />
                            <div className="profileInfo">
                                {followBtn}
                                <h3>{userInfo.displayName}</h3>
                                <p style={{color: "rgb(125, 125, 125)"}} className="profInfoFont">{`@${userInfo.username}`}</p>
                                <p className="profInfoFont">{userInfo.bio}</p>
                                <p style={{color: "rgb(125, 125, 125)"}} className="profInfoFont">{`Joined ${userInfo.joinDate}`}</p>
                            </div>
                            <div className="profileFollowInfo">
                                <span className="profileFollowSpan">
                                    <p style={{marginRight: "0.25em"}}>{`${follows.length}`}</p>
                                    <p style={{color: "rgb(125, 125, 125)"}}>{"Following"}</p>
                                </span>
                                <span className="profileFollowSpan">
                                    <p style={{marginRight: "0.25em"}}>{`${followers.length}`}</p>
                                    <p style={{color: "rgb(125, 125, 125)"}}>{"Followers"}</p>
                                </span>
                            </div>
                        </div>
                        <div className="profileBtnsDiv">
                            <Link className={profilePage === 0 ? "profileBtn profileBtnSelected" : "profileBtn"} to={{
                                pathname: `/${userInfo.username}`,
                                state: {
                                    userId: userId,
                                    currentUserId: currentUserId,
                                    option: 0
                                }
                                

                            }}>
                                <div>
                                    <p className="profileBtnFont">Tweets</p>
                                </div>
                            </Link>
                            <Link className={profilePage === 1 ? "profileBtn profileBtnSelected" : "profileBtn"} to={{
                                pathname: `/${userInfo.username}/replies`,
                                state: {
                                    userId: userId,
                                    currentUserId: currentUserId,
                                    option: 1
                                }

                            }}>
                                <div>
                                    <p className="profileBtnFont">Tweets & Replies</p>
                                </div>
                            </Link>
                            <Link className={profilePage === 2 ? "profileBtn profileBtnSelected" : "profileBtn"} to={{
                                pathname: `/${userInfo.username}/media`,
                                state: {
                                    userId: userId,
                                    currentUserId: currentUserId,
                                    option: 2
                                }

                            }}>
                                <div>
                                    <p className="profileBtnFont">Media</p>
                                </div>
                            </Link>
                            <Link className={profilePage === 3 ? "profileBtn profileBtnSelected" : "profileBtn"} to={{
                                pathname: `/${userInfo.username}/likes`,
                                state: {
                                    userId: userId,
                                    currentUserId: currentUserId,
                                    option: 3
                                }

                            }}>
                                <div>
                                    <p className="profileBtnFont">Likes</p>
                                </div>
                            </Link>
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