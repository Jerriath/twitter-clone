const monthToString = (num) => {
    switch (num) {
        case 0: return "Jan";
        case 1: return "Feb";
        case 2: return "Mar"
        case 3: return "April"
        case 4: return "May"
        case 5: return "June"
        case 6: return "July"
        case 7: return "Aug"
        case 8: return "Sept"
        case 9: return "Oct"
        case 10: return "Nov"
        case 11: return "Dec"
        default:
            console.log("This did not work");
    }
}

const sortOnlyTweets = (tweets) => {
    const filteredArray = tweets.filter( (tweet) => {
        return (tweet.parentTweet === "");
    });
    return filteredArray;
}

export { monthToString, sortOnlyTweets };