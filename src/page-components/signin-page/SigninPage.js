import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase-config";




const SigninPage = () => {

    //States are for holding the input information before submitting
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //State used for holding the errorMsg if there is one
    const [error, setError] = useState(null);

    //Hook used for rerouting back to the homepage
    const history = useHistory();


    useEffect( () => {
        return () => {
            setEmail("");
            setPassword("");
            setError(null);
        }
    }, []);


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
            history.push("/");
        }
        catch (error) {
            e.preventDefault();
            setError(
                <div className="errorMsg" >
                    <p className="defaultFont errorList" >Email or password is incorrect. Please try again.</p>
                </div>
            )
            window.setTimeout(() => {
                setError(null);
            }, 4000)
        }
    }


    return (
        <div className="signupPage">
            <h3 className="titleFont">Sign-in to your account</h3>
            <form onSubmit={handleSubmitRequest} className="signinForm">
                <label>
                    <input onChange={handleEmailChange} className="signinInput" type="email" placeholder="Email" value={email} />
                </label>
                <label>
                    <input onChange={handlePasswordChange} className="signinInput " type="password" placeholder="Password" value={password} />
                </label>
                <p className="defaultFont">Don't have an account? <a href="/signup">Click Here!</a></p>
                <label>
                    <button className="formBtn" type="submit" >Submit</button>
                </label>
                <p className="defaultFont">Return home? <a href="/" >Click here.</a></p>
            </form>
            {error}
        </div>
    )
}

export default SigninPage;