import userImg from "./assets/test/randomUser.jpg";




export const testUser = {
    userImg: userImg,
    displayName: "PeePeePants",
    username: "@testUser",
    date: "Oct 19",
    msg: "Hello world!",
    tweetId: null,
    retweets: 6,
    likes: 4,
    comments: [
        {
            userImg: userImg,
            displayName: "PeePeePants",
            username: "@testUser",
            date: "Oct 20",
            msg: "Foo!",
            tweetId: null,
            retweet: 0,
            likes: 1,
            comments: []
        },
        {
            userImg: userImg,
            displayName: "PeePeePants",
            username: "@testUser",
            date: "Oct 21",
            msg: "Bar!",
            tweetId: null,
            retweet: 0,
            likes: 0,
            comments: []
        }
    ]
}