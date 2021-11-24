import "../../styles.css";
import Tweet from "./Tweet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useState, useEffect } from "react"
import uniqid from "uniqid";




const HomeFeed = (props) => {

    const [tweets, setTweets] = useState([]);

    useEffect( () => {
        let tempArray = [];
        getDocs(collection(db, "tweets")).then( (snapshot) => {
            snapshot.forEach( (tweet) => {
                tempArray.push(tweet.data());
            });
            return tempArray;
        }).then( async (returnedArray) => {
            returnedArray.sort( (a, b) => {
                return a.date - b.date ? -1 : 1;
            });
            return returnedArray;
        }).then( (sortedArray) => {
            const filteredArray = sortedArray.filter(tweet => {
                return (tweet.parentTweet === "");
            })
            return filteredArray;
        }).then( (filteredArray) => {
            setTweets(filteredArray);
        })
    }, []);

    return (
        <div className="homeFeed" >
            {tweets.map( (tweet) => {
                return <Tweet onTweetHandler={props.onTweetHandler} tweetInfo={tweet} key={uniqid()} />
            })}
        </div>
    )
}

export default HomeFeed;