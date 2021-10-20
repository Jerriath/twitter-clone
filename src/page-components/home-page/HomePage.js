import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import Footer from "./home-subcomponents/Footer";
import HomeFeed from "./home-subcomponents/HomeFeed";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";





const HomePage = () => {


    return (
        <div className="homepage">
            <LeftPanel />
            <Header />
            <div className="homeContent">
                <HomeFeed />
                <RightPanel />
            </div>
            <Footer />
        </div>
    )
}

export default HomePage;