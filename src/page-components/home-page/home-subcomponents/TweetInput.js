






const TweetInput = (props) => {




    return (
        <div className="greyScreen">
            <div className="tweetInput" >
                <div className="tweetHeader" >
                    <button className="closeForm" >x</button>
                </div>
                <hr className="line" />
                <form className="tweetForm" >
                    <label className="tweetLabel" >
                        <input className="tweetText" type="text" placeholder="What's Happening?" />
                    </label>
                </form>
            </div>
        </div>
    )
}

export default TweetInput;