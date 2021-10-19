import "../styles.css";
import React from "react";
import Navbar from "./home-subcomponents/Navbar";
import HomeFeed from "./home-subcomponents/HomeFeed";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";





const HomePage = () => {


    return (
        <div className="homepage">
            <Navbar />
            <div className="homeContent">
                <LeftPanel />
                <HomeFeed />
                <RightPanel />
            </div>
        </div>
    )
}

export default HomePage;