import "../../styles.css";
import Tweet from "./Tweet";
import { doc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase-config";
import { testUser } from "../../../testVariables.js";
import { useState, useEffect } from "react"




const HomeFeed = () => {

    const [tweets, setTweets] = useState([]);

    useEffect( () => {
        let tempArray = [];
        getDocs(collection(db, "tweets")).then( (snapshot) => {
            snapshot.forEach( (tweet) => {
                tempArray.push(tweet.data());
            });
        }).then( () => {
            setTweets(tempArray);
        }).then ( () => {
            console.log(tweets);
        })
    })

    return (
        <div className="homeFeed" >
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            <Tweet tweetInfo={testUser} />
            
        </div>
    )
}

export default HomeFeed;