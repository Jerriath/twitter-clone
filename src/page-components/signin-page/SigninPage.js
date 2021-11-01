import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase-config";




const SigninPage = () => {

    //States are for holding the input information before submitting
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Hook used for rerouting back to the homepage
    const history = useHistory();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            const creds = await signInWithEmailAndPassword(auth, email, password);
            console.log(creds);
            setEmail("");
            setPassword("");
            history.push("/");
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="signupPage">
            <h3 className="titleFont">Sign-in to your account</h3>
            <form className="signinForm">
                <label>
                    <input onChange={handleEmailChange} className="signinInput" type="email" placeholder="Email" value={email} />
                </label>
                <label>
                    <input onChange={handlePasswordChange} className="signinInput " type="password" placeholder="Password" value={password} />
                </label>
                <label>
                    <button onClick={handleSubmitRequest} className="formBtn" type="submit" >Submit</button>
                </label>
            </form>
        </div>
    )
}

export default SigninPage;