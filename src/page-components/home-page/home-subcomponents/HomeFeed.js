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
        }).then( () => {
            setTweets(tempArray);
        }).then ( () => {
            console.log(tweets);
        })
    }, []);

    return (
        <div className="homeFeed" >
            {tweets.forEach( (tweet) => {
                return <Tweet tweetInfo={tweet} key={uniqid()} />
            })}
        </div>
    )
}

export default HomeFeed;