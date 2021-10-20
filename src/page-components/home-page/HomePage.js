import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import HomeFeed from "./home-subcomponents/HomeFeed";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";





const HomePage = () => {


    return (
        <div className="homepage">
            <Header />
            <div className="homeContent">
                <LeftPanel />
                <HomeFeed />
                <RightPanel />
            </div>
        </div>
    )
}

export default HomePage;