import "../../styles.css";
import Tweet from "./Tweet";
import userImg from "../../../assets/test/randomUser.jpg";




const HomeFeed = () => {

    const testUser = {
        imgSrc: userImg,
        displayName: "PeePeePants",
        username: "@testUser",
        date: "Oct 19",
        msg: "Hello world!",
        retweets: 6,
        likes: 4,
        comments: [
            {
                imgSrc: userImg,
                displayName: "PeePeePants",
                username: "@testUser",
                date: "Oct 20",
                msg: "Foo!",
                retweet: 0,
                likes: 1,
                comments: []
            },
            {
                imgSrc: userImg,
                displayName: "PeePeePants",
                username: "@testUser",
                date: "Oct 21",
                msg: "Bar!",
                retweet: 0,
                likes: 0,
                comments: []
            }
        ]
    }


    return (
        <div className="homeFeed" >
            <Tweet tweetInfo={testUser} />
        </div>
    )
}

export default HomeFeed;