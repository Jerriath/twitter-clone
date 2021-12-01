import "../../styles.css";
import { Link } from "react-router-dom";




const RightPanel = () => {




    return (
        <div className="rightPanel" >
            <div className="rightSpacing">
                <div className="rightSignup">
                    <h2 className="titleFont">New to Tweeter?</h2>
                    <p className="defaultFont">Sign up now to get the same timeline as everyone else.</p>
                    <Link className="redButton" to="/twitter-clone/signup" >
                        <h2 className="buttonFont">Sign Up</h2>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RightPanel;