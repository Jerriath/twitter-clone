import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase-config";




const Tweet = (props) => {


    const tweetInfo = props.tweetInfo;

    //States for storing info related to the tweet (specifically tweeter info); this is needed because the tweeter info needs to be fetched from backend
    const [userImage, setUserImage] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    
    //This state is for storing either null or the image attatched to the tweet
    const [tweetImage, setTweetImage] = useState("");

    useEffect( () => {
        if (tweetInfo.containsImg && tweetInfo.id !== "") {
            console.log(tweetInfo.id);
            const tweetImgRef = ref(storage, "tweet-images/" + tweetInfo.id);
            getDownloadURL(tweetImgRef).then( (imageSrc) => {
                setTweetImage(<img className="tweetImg" width="100%" src={imageSrc} alt="User inputted media" />);
            });
        }
    }, [tweetInfo.containsImg,tweetInfo.id])

    useEffect( () => {
        const docRef = doc(db, "users", tweetInfo.tweeterId);
        getDoc(docRef).then( (snapshot) => {return snapshot.data()}).then( (user) => {
            setUsername(user.username);
            setDisplayName(user.displayName);
        });
    }, [tweetInfo.tweeterId])

    useEffect( () => {
        const imageRef = ref(storage, "user-images/" + tweetInfo.tweeterId);
        getDownloadURL(imageRef).then( (imageSrc) => {
            setUserImage(imageSrc);
        });
    }, [tweetInfo.tweeterId])



    return (
        <div className="tweet">
            <div className="imgHolder">
                <img className="tweetUserImg" alt="User profile" src={userImage} /> 
            </div>
            <div className="tweetContent">
                <div className="tweeterInfoHolder">
                    <h3 className="tweeterDisplayName defaultFont">{displayName}</h3>
                    <h3 className="tweeterInfo defaultFont">{username}</h3>
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
                    <div className="btnDiv commentDiv">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tweetBtn comment">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        <p className="btnFont">{tweetInfo.comments.length ? tweetInfo.comments.length : ""}</p>
                    </div>
                    <div className="btnDiv retweetDiv">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tweetBtn retweet">
                            <polyline points="17 1 21 5 17 9"></polyline>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <polyline points="7 23 3 19 7 15"></polyline>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                        <p className="btnFont">{tweetInfo.retweets ? tweetInfo.retweets : ""}</p>
                    </div>
                    <div className="btnDiv likeDiv">
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
    )
}//The user image and also the tweet images need to be loaded in with a useEffect to optimize load speed

export default Tweet;