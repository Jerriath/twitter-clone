import "../styles.css";
import React from "react";
import Header from "./home-subcomponents/Header";
import LeftPanel from "./home-subcomponents/LeftPanel";
import RightPanel from "./home-subcomponents/RightPanel";
import { auth, storage, db } from "../../firebase-config";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "@firebase/storage";
import { getDoc, doc } from "@firebase/firestore";

//This component isn't actually a page; It is just going to be attached to the HomePage component but will replace the HomeFeed component
const ProfilePage = (props) => {


    return (
        <div>
            
        </div>
    )
}