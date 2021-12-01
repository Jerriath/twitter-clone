import "../../styles.css";
import Logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";



const LeftPanel = (props) => {

    //State used to store the userInfo
    const [userId, setUserId] = useState("");
    const [profileUrl, setProfileUrl] = useState("");

    //Hook used to update profileUrl
    useEffect( () => {
        if (props.userInfo) {
            setProfileUrl("/" + props.userInfo.username);
        }
    }, [props.userInfo])

    //Hook for updating the userId state
    useEffect( () => {
        setUserId(props.userId);
    }, [props.userId])

    const openTweet = () => {
        props.onTweetHandler("");
    }

    return (
        <div className="leftPanel" >
            <Link className="logo" to="/twitter-clone/">
                <img className="logoImg" src={Logo} alt="Page logo" />
            </Link>
            <Link to="/twitter-clone/" >
                <div className={props.homeClass} >
                    <svg className="optionFont" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="26" height="26"
                        viewBox="0 0 26 26">
                            <path d="M 20 2.03125 C 19.449219 2.03125 19 2.480469 19 3.03125 L 19 7.8125 L 13.71875 2.53125 C 13.328125 2.140625 12.671875 2.140625 12.28125 2.53125 L 0.5625 14.28125 C 0.171875 14.671875 0.171875 15.296875 0.5625 15.6875 C 0.953125 16.078125 1.578125 16.078125 1.96875 15.6875 L 13 4.65625 L 24.0625 15.71875 C 24.257813 15.914063 24.523438 16.03125 24.78125 16.03125 C 25.039063 16.03125 25.273438 15.914063 25.46875 15.71875 C 25.859375 15.328125 25.859375 14.703125 25.46875 14.3125 L 22 10.84375 L 22 3.03125 C 22 2.480469 21.550781 2.03125 21 2.03125 Z M 13 6.5 L 2 17.5 L 2 23 C 2 24.65625 3.34375 26 5 26 L 21 26 C 22.65625 26 24 24.65625 24 23 L 24 17.5 Z M 11 16 L 15 16 C 15.550781 16 16 16.449219 16 17 L 16 23 C 16 23.550781 15.550781 24 15 24 L 11 24 C 10.449219 24 10 23.550781 10 23 L 10 17 C 10 16.449219 10.449219 16 11 16 Z"></path>
                    </svg>
                    <h2 className="optionFont">Home</h2>
                </div>
            </Link>
            <Link to={{
                pathname: "/twitter-clone/" + profileUrl,
                state: {
                    userId: userId,
                    currentUserId: userId,
                    option: 0
                }
                }} >
                <div className={props.profileClass} >
                    <svg className="svg-icon optionFont" viewBox="0 0 20 20">
                        <path strokeWidth="7" d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                    </svg>
                    <h2 className="optionFont">Profile</h2>
                </div>
            </Link>
            <div className="redButton">
                <h2 onClick={openTweet} className="buttonFont">Tweet</h2>
            </div>
        </div>
    )
}

export default LeftPanel;