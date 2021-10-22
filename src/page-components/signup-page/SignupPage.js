




const SignupPage = () => {


    return (
        <div className="signupPage">
            <h3 className="titleFont">Create your account</h3>
            <form className="signupForm">
                <label>
                    <input type="text" placeHolder="@Username" />
                </label>
                <label>
                    <input type="text" placeHolder="Display Name" />
                </label>
                <label>
                    <input type="email" placeHolder="Email" />
                </label>
                <label>
                    <input type="password" placeHolder="Password" />
                </label>
                <label>
                    <input type="password" placeHolder="Re-enter Password" />
                </label>
                <label>
                    <button type="submit" >Submit</button>
                </label>
            </form>
        </div>
    )
}

export default SignupPage;