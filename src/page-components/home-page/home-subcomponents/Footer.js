import "../../styles.css";




const Footer = () => {




    return (
        <div className="footer" >
            <div className="footerCentered">
                <span className="footerMsg">
                    <h2 className="titleFont">Don't miss what's not happpening!</h2>
                    <h3 className="defaultFont">People on Tweeter are (definitely) last to know.</h3>
                </span>
                <button className="loginBtn">Log in</button>
                <button className="signupBtn">Sign up</button>
            </div>
        </div>
    )
}

export default Footer;