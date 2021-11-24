import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebase-config";
import uniqid from "uniqid";




const Tweet = (props) => {

    //States for storing info related to the tweet (specifically tweeter info); this is needed because the tweeter info needs to be fetched from backend
    const [userImage, setUserImage] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [tweetInfo, setTweetInfo] = useState(props.tweetInfo);
    const [tweeterId, setTweeterId] = useState(props.tweetInfo ? props.tweetInfo.tweeterId : "");
    
    //This state is for storing either null or the image attatched to the tweet
    const [tweetImage, setTweetImage] = useState("");

    //This state is for holding either null or a msg that says this tweet is a retweet or comment
    const [headerMsg, setHeaderMsg] = useState(null);

    //This hook is for getting around the fact you can't nest an anchor in an anchor
    const tweetPageLink = useRef(null);

    //Hook for getting the tweets image if it hasImage is true
    useEffect( () => {
        if (tweetInfo.containsImg && tweetInfo.id !== "") {
            if (tweetInfo.retweetId !== "")
            {
                const tweetImgRef = ref(storage, "tweet-images/", tweetInfo.retweetId);
                getDownloadURL(tweetImgRef).then( (imageSrc) => {
                    setTweetImage(<img className="tweetImg" width="100%" src={imageSrc} alt="User inputted media" />);
                })
            }
            else {
                const tweetImgRef = ref(storage, "tweet-images/" + tweetInfo.id);
                getDownloadURL(tweetImgRef).then( (imageSrc) => {
                    setTweetImage(<img className="tweetImg" width="100%" src={imageSrc} alt="User inputted media" />);
                });
            }
        }
    }, [tweetInfo.containsImg,tweetInfo.id, tweetInfo.retweetId])

    //Hook used to check if tweet is a retweet; if so, setHeaderMsg runs and tweetInfo updates to the original tweetInfo
    useEffect( () => {
        if (tweetInfo.retweeter) {
            const retweeterRef = doc(db, "users", tweetInfo.retweeter);
            getDoc(retweeterRef).then( (retweeter) => {
                setHeaderMsg(`${retweeter.data().displayName} retweeted`);
            })
            const originalTweetRef = doc(db, "tweets", tweetInfo.retweetId);
            getDoc(originalTweetRef).then( (originalTweet) => {
                setTweetInfo(originalTweet.data());
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Hook used to check if tweet is a comment; if so, setCommentMsg runs and shows that the tweet is a comment 
    useEffect( () => {
        if (tweetInfo.parentTweet !== "") {
            const parentRef = doc(db, "tweets", tweetInfo.parentTweet);
            getDoc(parentRef).then( (parentSnapshot) => {
                return parentSnapshot.data().tweeterId;
            }).then( (tweeterId) => {
                const tweeterRef = doc(db, "users", tweeterId);
                getDoc(tweeterRef).then( (tweeterSnapshot) => {
                    setHeaderMsg(`Reply to ${tweeterSnapshot.data().displayName}`)
                })
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Hook used for retrieving the tweeter's info
    useEffect( () => {
        const docRef = doc(db, "users", tweetInfo.tweeterId);
        getDoc(docRef).then( (snapshot) => {return snapshot.data()}).then( (user) => {
            setUsername(user.username);
            setDisplayName(user.displayName);
        });
    }, [tweetInfo.tweeterId])

    //Hook used for getting the tweeter's prof pic
    useEffect( () => {
        const imageRef = ref(storage, "user-images/" + tweetInfo.tweeterId);
        getDownloadURL(imageRef).then( (imageSrc) => {
            setUserImage(imageSrc);
        });
    }, [tweetInfo.tweeterId])


    //Hook used for cleaning up state
    useEffect( () => {
        return ( () => {
            setUserImage("");
            setUsername("");
            setDisplayName("");
            setTweetInfo(null);
            setTweetImage("");
            setHeaderMsg(null);
            setTweeterId("");
        })
    }, [])

    //Function for handling likes
    const handleLike = async (e) => {
        e.stopPropagation();
        if(auth.currentUser) {
            const tweetRef = await doc(db, "tweets", tweetInfo.id);
            const currentUserRef = await doc(db, "users", auth.currentUser.uid);
            const currentUser = (await getDoc(currentUserRef)).data();
            if (currentUser.likes.includes(tweetInfo.id)) {
                console.log("Disliked")
                console.log("Old Likes: " + tweetInfo.likes)
                await updateDoc(tweetRef, {likes: tweetInfo.likes - 1});
                let newLikesArray = currentUser.likes.filter( (value) => {
                    return value !== tweetInfo.id;
                })
                updateDoc(currentUserRef, {likes: newLikesArray});
            }
            else {
                console.log("Liked")
                console.log("Old likes: " + tweetInfo.likes)
                await updateDoc(tweetRef, {likes: tweetInfo.likes + 1});
                let oldLikeArray = currentUser.likes;
                oldLikeArray.push(tweetInfo.id);
                await updateDoc(currentUserRef, {likes: oldLikeArray})
            }
            setTweetInfo((await getDoc(tweetRef)).data());
            //await updateDoc(tweetRef, {likes: tweetInfo.likes++});
        }
    }

    const handleComment = (e) => {
        e.stopPropagation();
        props.onTweetHandler(tweetInfo.id);
    }

    //Function for handling retweets
    const handleRetweet = async (e) => {
        e.stopPropagation();
        try {
            const currentUserRef = doc(db, "users", auth.currentUser.uid);
            const currentUser = (await getDoc(currentUserRef)).data();
            const currentTweetRef = doc(db, "tweets", tweetInfo.id);
            const currentUserTweets = [];
            for (let i = 0; i < currentUser.tweets.length; i++) {
                const someTweet = await getDoc(doc(db, "tweets", currentUser.tweets[i]));
                console.log(someTweet.data());
                currentUserTweets.push(someTweet.data());
            }
            const oldRetweet = currentUserTweets.find( (tweet) => {
                return tweet.retweetId === tweetInfo.id;
            })
            if (oldRetweet) {
                console.log("Found retweet")
                const oldRetweetRef = await doc(db, "tweets", oldRetweet.id);
                await deleteDoc(oldRetweetRef);
                let newTweetsArray = [];
                currentUserTweets.filter( (tweet) => {
                    if (tweet.retweetId === tweetInfo.id) {
                        return false;
                    }
                    else {
                        newTweetsArray.push(tweet.id);
                        return true;
                    }
                })
                await updateDoc(currentUserRef, {tweets: newTweetsArray});
                await updateDoc(currentTweetRef, {retweets: tweetInfo.retweets - 1});
            }
            else {
                const newTweetId = uniqid();
                const newTweetRef = await doc(db, "tweets", newTweetId);
                await setDoc(newTweetRef, {
                    comments: [],
                    containsImg: tweetInfo.containsImg,
                    date: Timestamp.fromDate(new Date()),
                    id: newTweetId,
                    likes: 0,
                    msg: "",
                    retweetId: tweetInfo.id,
                    retweeter: auth.currentUser.uid,
                    retweets: 0,
                    tweeterId: tweetInfo.tweeterId
                })
                let tempTweetsArray = currentUser.tweets;
                currentUser.tweets.push(newTweetId);
                await updateDoc(currentUserRef, {tweets: tempTweetsArray});
                await updateDoc(currentTweetRef, {retweets: tweetInfo.retweets + 1})
            }
            window.location.reload();
        }
        catch (error) {
            console.log(error);
        }
    }

    //Function to handle clicking on the tweetPateLink
    const onTweetPageLinkClick = () => {
        tweetPageLink.current.click();
    }

    //Stoping the propagation because the parent div had an onClick which needs to be prevented
    const goToProfile = (e) => {
        e.stopPropagation();
    }

    return (
        <div onClick={onTweetPageLinkClick} className="tweetHolder">
            <Link ref={tweetPageLink} to={{
                pathname: `/tweet/${tweetInfo.id}`,
                state: {
                    userId: tweeterId,
                    currentUserId: (auth.currentUser ? auth.currentUser.uid : null),
                    tweetInfo: tweetInfo
                }
            }}></Link>
            <h3 className="defaultFont headerMsg">{headerMsg}</h3>
            <div className="tweet">
                <div className="imgHolder">
                    <img className="tweetUserImg" alt="User profile" src={userImage} /> 
                </div>
                <div className="tweetContent">
                    <div onClick={goToProfile} className="tweeterInfoHolder">
                        <Link to={{
                            pathname: `/${username}`,
                            state: {
                                userId: tweeterId,
                                currentUserId: (auth.currentUser ? auth.currentUser.uid : null)
                            }
                        }} >
                            <div className="profileFollowSpan">
                                <h3 className="tweeterDisplayName defaultFont">{displayName}</h3>
                                <h3 className="tweeterInfo defaultFont">{" @" + username}</h3>
                            </div>
                        </Link>
                        <h3 className="tweeterInfo defaultFont">&middot;</h3>
                        <h3 className="tweeterInfo defaultFont">{new Date(tweetInfo.date.seconds * 1000).toLocaleDateString("en-US")}</h3>
                        <h3 className="tweeterInfo defaultFont dots">&middot;&middot;&middot;</h3>
                    </div>
                    <div className="tweetMsgHolder">
                        <p className="tweetMsg">{tweetInfo.msg}</p>
                    </div>

                    <div className="tweetImgHolder">
                        {tweetImage}
                    </div>


                    <div className="tweetBtnHolder">
                        <div onClick={handleComment} className="btnDiv commentDiv">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tweetBtn comment">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <p className="btnFont">{tweetInfo.comments.length ? tweetInfo.comments.length : ""}</p>
                        </div>
                        <div onClick={handleRetweet} className="btnDiv retweetDiv">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tweetBtn retweet">
                                <polyline points="17 1 21 5 17 9"></polyline>
                                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                                <polyline points="7 23 3 19 7 15"></polyline>
                                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            </svg>
                            <p className="btnFont">{tweetInfo.retweets ? tweetInfo.retweets : ""}</p>
                        </div>
                        <div onClick={handleLike} className="btnDiv likeDiv">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="tweetBtn like">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <p className="btnFont">{tweetInfo.likes ? tweetInfo.likes : ""}</p>
                        </div>
                        <div className="btnDiv shareDiv">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="tweetBtn share">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}//The user image and also the tweet images need to be loaded in with a useEffect to optimize load speed

export default Tweet;