import "../../styles.css";




const SignoutPanel = (props) => {


    const handleSignOut = () => {
        props.auth.signOut();
        console.log(props.auth.currentUser);
        window.location.reload();
    }

    return (
        <div className="rightPanel" >
            <div className="rightSpacing">
                <div className="rightSignup">
                    <h2 className="titleFont">Welcome to Tweeter!</h2>
                    <p className="defaultFont">Sign out to see the same exact feed.</p>
                    <div onClick={handleSignOut} className="redButton" >
                        <h2 className="buttonFont">Sign Out</h2>                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignoutPanel;