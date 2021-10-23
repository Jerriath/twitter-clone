import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { doc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth, storage } from "../../firebase-config";
import { checkValid, checkPasswords } from "./signupFunctions";




const SignupPage = () => {

    //Each of these states are for each of the inputs
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    //This state is used to store an array of all existing users to check if the inputted username is valid
    const [usersArray, setUsersArray] = useState([]);

    //This state is used for the second useEffect to clear all the states before unmounting this component
    const [userCreated, setUserCreated] = useState(false);

    //This "useHistory" hook is used for rerouting back to the homepage after clicking submit
    let history = useHistory();




    //This async function is used to retrieve all existing users to make sure the new username is unique
    useEffect( () => {
        let tempArray = [];
        getDocs(collection(db, "users")).then( (querySnapshot) => {
            querySnapshot.forEach( (user) => {
                tempArray.push(user.data());
            });
        }).then( () => {
            setUsersArray(tempArray);
        })
    })

    useEffect( () => {
        if (userCreated) {
            return ( () => {
                setUsername("");
                setDisplayName("");
                setEmail("");
                setPassword("");
                setConfirmation("");
            });
        }
    })


    const handleUserChange = (e) => {
        setUsername(e.target.value);
    }

    const handleDisplayChange = (e) => {
        setDisplayName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmationChange = (e) => {
        setConfirmation(e.target.value);
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleSubmitRequest = async (e) => {
        try {
            if (checkValid(username, usersArray) && checkPasswords(password, confirmation)) {

                e.preventDefault();
                const creds = await createUserWithEmailAndPassword(auth, email, password);
                console.log(creds.user);
                //creds.user.sendEmailVerification();
                const docRef = await doc(db, "users", creds.user.uid);
                console.log("Setting document in remote database...");
                await setDoc(docRef, {
                    username: username,
                    displayName: displayName,
                    likes: [],
                    tweets: [],
                    follows: [],
                    followers: [],
                    joinDate: Timestamp.fromDate(new Date())
                });
                console.log("User set");
                setUserCreated(true);
                history.push("/");
            }
        }
        catch (error) {
            console.log("An error occurred: ");
            console.log(error);
        }
    }



    return (
        <div className="signupPage">
            <h3 className="titleFont">Create your account</h3>
            <form className="signupForm">
                <label className="imageInput">
                    <input onChange={handleImageChange} type="file" alt="profile pic" value={image} />
                </label>
                <label>
                    <input onChange={handleUserChange} className="formInput" type="text" placeholder="@Username" value={username} />
                </label>
                <label>
                    <input onChange={handleDisplayChange} className="formInput" type="text" placeholder="Display Name" value={displayName} />
                </label>
                <label>
                    <input onChange={handleEmailChange} className="formInput" type="email" placeholder="Email" value={email} />
                </label>
                <label>
                    <input onChange={handlePasswordChange} className="formInput" type="password" placeholder="Password" value={password} />
                </label>
                <label>
                    <input onChange={handleConfirmationChange} className="formInput" type="password" placeholder="Re-enter Password" value={confirmation} />
                </label>
                <label>
                    <Link to="/" >
                        <button onClick={handleSubmitRequest} className="formBtn" type="submit" >Submit</button>
                    </Link>
                </label>
            </form>
        </div>
    )
}

export default SignupPage;