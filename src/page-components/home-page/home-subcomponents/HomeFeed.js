import "../../styles.css";
import Tweet from "./Tweet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useState, useEffect } from "react"
import uniqid from "uniqid";




const HomeFeed = () => {

    const [tweets, setTweets] = useState([]);

    useEffect( () => {
        let tempArray = [];
        getDocs(collection(db, "tweets")).then( (snapshot) => {
            snapshot.forEach( (tweet) => {
                tempArray.push(tweet.data());
            });
            return tempArray;
        }).then( async (returnedArray) => {
            setTweets(returnedArray);
        })
    }, []);

    useEffect( () => {
        console.log(tweets);
    }, [tweets])

    return (
        <div className="homeFeed" >
            {tweets.map( tweet => <Tweet tweetInfo={tweet} /> )}
        </div>
    )
}

export default HomeFeed;