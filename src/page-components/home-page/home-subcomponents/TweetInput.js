import { useState, useRef, useEffect } from "react";
import { db, storage } from "../../../firebase-config";
import uniqid from "uniqid";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "@firebase/firestore";
import { uploadBytes, ref } from "@firebase/storage";






const TweetInput = (props) => {

    //States used for storing the tweet info like the message and/or image
    const [msg, setMsg] = useState("");
    const [bonusRows, setBonusRows] = useState(0);
    const [image, setImage] = useState("");
    const [user, setUser] = useState({});

    //This hook is for styling the file input
    const hiddenFileInput = useRef(null);

    //State used for storing the submit btn style 
    const [submitStyle, setSubmitStyle] = useState({});

    //State for saving whether if the new tweet is a real tweet or comment
    const [isComment, setIsComment] = useState(props.isComment);

    //These hooks are for greying out the submit btn until something is inputted into the form
    useEffect( () => {
        if (msg === "") {
            setSubmitStyle({opacity: 0.5, pointerEvents: "none"})
        }
        else if (msg !== "") {
            setSubmitStyle({opacity: 1, pointerEvents: "auto"});
        }
    }, [msg]);

    useEffect( () => {
        if (image === "") {
            setSubmitStyle({opacity: 0.5, pointerEvents: "none"})
        }
        else if (image !== "") {
            setSubmitStyle({opacity: 1, pointerEvents: "auto"});
        }
    }, [image]);

    //This hook is used to retrieve the user info from firestore
    useEffect( () => {
        const userRef = doc(db, "users", props.userId);
        getDoc(userRef).then( (userInfo) => {
            setUser(userInfo.data());
        })
    }, [props.userId])

    //This function is for automatically adjusting the textarea size to fit the text
    const onMsgChange = (e) => {
        if (e.target.scrollHeight > e.target.offsetHeight + 5) {
			setBonusRows(bonusRows + 1);
		} else if (e.target.value.length < 50) {
			setBonusRows(0);
		} else if (Math.floor(e.target.value.length / 10) < Math.floor(msg.length / 10) && !(Math.floor(msg.length / 10) % 5)) {
			setBonusRows(bonusRows - 1);
		}
		setMsg(e.target.value);
    }

    const handleImageClick = (e) => {
        e.preventDefault();
        console.log("handle image click");
        hiddenFileInput.current.click();
    }

    const handleImageChange = (e) => {
        const fileUploaded = e.target.files[0];
        setImage(fileUploaded);
    }

    const handleSubmitTweet = async (e) => {
        e.preventDefault();
        const newTweetId = uniqid();
        const tweetRef = doc(db, "tweets", newTweetId);
        //For tweets that only have a msg and no image
        if (msg !== "" && image === "") {
            await setDoc(tweetRef, {
                comments: [],
                containsImg: false,
                date: Timestamp.fromDate(new Date()),
                id: newTweetId,
                isRetweet: false,
                likes: 0,
                msg: msg,
                retweets: 0,
                retweeter: "",
                retweetId: "",
                tweeterId: props.userId,
                parentTweet: props.parentTweet
            })
        }
        //For tweets that only have an image and no msg
        else if (msg === "" && image !== "") {
            await setDoc(tweetRef, {
                comments: [],
                containsImg: true,
                date: Timestamp.fromDate(new Date()),
                id: newTweetId,
                isRetweet: false,
                likes: 0,
                msg: "",
                retweeter: "",
                retweetId: "",
                retweets: 0,
                tweeterId: props.userId,
                parentTweet: props.parentTweet
            });
            const imageRef = ref(storage, `tweet-images/${newTweetId}`)
            await uploadBytes(imageRef, image);
        }
        //For tweets that have both an image and a msg
        else {
            await setDoc(tweetRef, {
                comments: [],
                containsImg: true,
                date: Timestamp.fromDate(new Date()),
                id: newTweetId,
                isRetweet: false,
                likes: 0,
                msg: msg,
                retweeter: "",
                retweetId: "",
                retweets: 0,
                tweeterId: props.userId,
                parentTweet: props.parentTweet
            });
            const imageRef = ref(storage, `tweet-images/${newTweetId}`)
            await uploadBytes(imageRef, image);
        }
        //Add a condititional to see if the new tweet is a comment; if so, the parentTweet's comment array will be updated
        if (props.parentTweet !== "") {
            const parentTweetRef = doc(db, "tweets", props.parentTweet);
            const tempCommentsArray = await getDoc(parentTweetRef).then( (snapshot) => {
                return snapshot.data().comments;
            })
            tempCommentsArray.push(newTweetId);
            updateDoc(parentTweetRef, {comments: tempCommentsArray});
        }
        const userRef = doc(db, "users", props.userId);
        let userTweets = user.tweets;
        userTweets.push(newTweetId)
        await updateDoc(userRef, {tweets: userTweets});
        window.location.reload();
    }

    return (
        <div className="greyScreen">
            <div className="tweetInput" >
                <div className="tweetHeader" >
                    <button className="closeForm" onClick={props.closeTweet} >x</button>
                </div>
                <hr className="line" />
                <form className="tweetForm" >
                    <div className="imgHolder tweetProfPic" >
                        <img src={props.profPic} alt="User's profile pic" className="tweetUserImg" />
                    </div>
                    <div className="tweetInputRight" >
                        <div className="tweetTextHolder" >
                            <label className="tweetLabel" >
                                <textarea onChange={onMsgChange} value={msg} className="tweetText" overflow="none" cols="50" rows={1 + bonusRows} placeholder="What's Happening?" resize="none" ></textarea>
                            </label>
                        </div>
                        <hr className="line" />
                        <div className="tweetBtnHolder" style={{paddingRight: 0}}>
                            <button className="tweetImgBtn" onClick={handleImageClick} >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(252, 110, 80)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </button>
                            <input onChange={handleImageChange} type="file" ref={hiddenFileInput} style={{display: "none"}} />
                            <button onClick={handleSubmitTweet} className="submitTweet" style={submitStyle}>Tweet</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TweetInput;