import "../../styles.css";
import Tweet from "./Tweet";
import { testUser } from "../../../testVariables.js";




const HomeFeed = () => {


    return (
        <div className="homeFeed" >
            <Tweet tweetInfo={testUser} />
        </div>
    )
}

export default HomeFeed;