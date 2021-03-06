import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { doc, setDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { db, auth, storage } from "../../firebase-config";
import { checkValid, checkConfirmation, checkInputs } from "./signupFunctions";
import uniqid from "uniqid";
import defaultPic from "../../assets/images/default_prof_pic.png";




const SignupPage = () => {

    //Each of these states are for each of the inputs
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    //This state is used to store an array of all existing users to check if the inputted username is valid
    const [usersArray, setUsersArray] = useState([]);

    //This state is used for the second useEffect to clear all the states before unmounting this component
    const [userCreated, setUserCreated] = useState(false);

    //This state is used to display error msgs when an error occured when submitting the form
    const [errorMsg, setErrorMsg] = useState(null);

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

    //This hook is used for cleaning up the DOM before unmounting
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
    }, [userCreated])


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
            if (checkInputs(username, usersArray, password, confirmation)) {
                e.preventDefault();
                const creds = await createUserWithEmailAndPassword(auth, email, password);
                console.log(creds.user);
                //creds.user.sendEmailVerification();
                const docRef = await doc(db, "users", creds.user.uid);
                const imageRef = ref(storage, `user-images/${creds.user.uid}`)
                console.log("Setting document in remote database and uploading user image...");
                if (image === "") {
                    setImage(defaultPic);
                }
                await uploadBytes(imageRef, image);
                await setDoc(docRef, {
                    username: username,
                    bio: "",
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
            else {
                e.preventDefault();
                throw new Error("Username or password confirmation invalid!");
            }
        }
        catch (error) {
            let errorArray = [];
            if (error.toString().includes("auth/email-already-in-use")) {
                errorArray.push("Email is already in use. Please use another.")
            }
            if (!checkValid(username, usersArray)) {
                errorArray.push("Username has already been taken.")
            }
            if (!checkConfirmation(password, confirmation)) {
                errorArray.push("Confirmation does not match password.")
            }
            setErrorMsg(
                <div className="errorMsg" >
                    <ul className="errorList">
                        {errorArray.map( (error) => {
                            return <li key={uniqid()} className="defaultFont" >{error}</li>
                        })}
                    </ul>
                </div>
            )
            window.setTimeout(() => {
                setErrorMsg(null);
            }, 4000)
        }
    }



    return (
        <div className="signupPage">
            <h3 className="titleFont">Create your account</h3>
            <form onSubmit={handleSubmitRequest} className="signupForm">
                <label className="imageInput">
                    <input onChange={handleImageChange} type="file" alt="profile pic" />
                </label>
                <label>
                    <input onChange={handleUserChange} className="formInput" type="text" placeholder="@Username" value={username} required />
                </label>
                <label>
                    <input onChange={handleDisplayChange} className="formInput" type="text" placeholder="Display Name" value={displayName} required />
                </label>
                <label>
                    <input onChange={handleEmailChange} className="formInput" type="email" placeholder="Email" value={email} required />
                </label>
                <label>
                    <input onChange={handlePasswordChange} className="formInput" type="password" placeholder="Password" value={password} minLength="8" required />
                </label>
                <label>
                    <input onChange={handleConfirmationChange} className="formInput" type="password" placeholder="Re-enter Password" value={confirmation} required />
                </label>
                <p className="defaultFont">Already have an account? <a href="/signin">Click Here!</a></p>
                <label>
                    <button className="formBtn" type="submit" >Submit</button>
                </label>
                <p className="defaultFont">Return home? <a href="/" >Click here.</a></p>
            </form>
            {errorMsg}
        </div>
    )
}

export default SignupPage;