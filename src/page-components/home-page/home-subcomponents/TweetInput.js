import { useState } from "react";






const TweetInput = (props) => {

    const [msg, setMsg] = useState("");
    const [bonusRows, setBonusRows] = useState(0);

    const onMsgChange = (e) => {
        console.log(e.target.value.length);
        console.log(msg.length);
        if (e.target.scrollHeight > e.target.offsetHeight + 5) {
			setBonusRows(bonusRows + 1);
		} else if (e.target.value.length < 50) {
			setBonusRows(0);
		} else if (Math.floor(e.target.value.length / 10) < Math.floor(msg.length / 10) && !(Math.floor(msg.length / 10) % 5)) {
			setBonusRows(bonusRows - 1);
		}
		setMsg(e.target.value);
    }

    return (
        <div className="greyScreen">
            <div className="tweetInput" >
                <div className="tweetHeader" >
                    <button className="closeForm" >x</button>
                </div>
                <hr className="line" />
                <form className="tweetForm" >
                    <div className="imgHolder tweetProfPic" >
                        <img src={props.profPic} alt="User's profile pic" className="tweetUserImg" />
                    </div>
                    <div className="tweetInputRight" >
                        <div className="tweetTextHolder" >
                            <label className="tweetLabel" >
                                <textarea onChange={onMsgChange} value={msg} className="tweetText" overflow="none" cols="50" rows={1 + bonusRows} placeholder="What's Happening?" resize="none" ></textarea>
                            </label>
                        </div>
                        <hr className="line" />
                        <div>
                            
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TweetInput;