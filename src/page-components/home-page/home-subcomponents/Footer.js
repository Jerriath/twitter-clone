import "../../styles.css";
import { Link } from "react-router-dom";




const Footer = () => {




    return (
        <div className="footer" >
            <div className="footerCentered">
                <span className="footerMsg">
                    <h2 className="titleFont">Don't miss what's not happpening!</h2>
                    <h3 className="defaultFont">People on Tweeter are (definitely) last to know.</h3>
                </span>
                <Link className="footerLink" to="/twitter-clone/signin" >
                    <button className="loginBtn">Log in</button>
                </Link>
                <Link className="footerLink" to="/twitter-clone/signup" >
                    <button className="signupBtn">Sign up</button>
                </Link>
            </div>
        </div>
    )
}

export default Footer;