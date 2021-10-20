import userImg from "./assets/test/randomUser.jpg";




export const testUser = {
    imgSrc: userImg,
    displayName: "PeePeePants",
    username: "@testUser",
    date: "Oct 19",
    msg: "Hello world!",
    retweets: 6,
    likes: 4,
    comments: [
        {
            imgSrc: userImg,
            displayName: "PeePeePants",
            username: "@testUser",
            date: "Oct 20",
            msg: "Foo!",
            retweet: 0,
            likes: 1,
            comments: []
        },
        {
            imgSrc: userImg,
            displayName: "PeePeePants",
            username: "@testUser",
            date: "Oct 21",
            msg: "Bar!",
            retweet: 0,
            likes: 0,
            comments: []
        }
    ]
}