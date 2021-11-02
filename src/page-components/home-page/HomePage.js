import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import Footer from "./home-subcomponents/Footer";
import HomeFeed from "./home-subcomponents/HomeFeed";
import SignoutPanel from "./home-subcomponents/SignoutPanel";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "@firebase/auth";
import { useState, useEffect } from "react";
import uniqid from "uniqid"





const HomePage = () => {

    //States to hold the RightPanel and the Footer; will update to null if someone is signed in
    const [footer, setFooter] = useState(<Footer />);
    const [rightPanel, setRightPanel] = useState(<RightPanel />);

    console.log(uniqid());

    //This observer is used to check if someone is signed in; If yes, the homeFeed and rightPanel will be set to null
    onAuthStateChanged(auth, (user) => {
        if (user !== null && footer !== null) {
            setRightPanel(<SignoutPanel auth={auth} />);
            setFooter(null);
        }
    });

    //This hook is used to cleanup the states before unmounting
    useEffect( () => {
        return () => {
            setFooter(null);
            setRightPanel(null);
        }
    }, []);

    return (
        <div className="homepage">
            <LeftPanel />
            <Header />
            <div className="homeContent">
                <HomeFeed />
                {rightPanel}
            </div>
            {footer}
        </div>
    )
}

export default HomePage;