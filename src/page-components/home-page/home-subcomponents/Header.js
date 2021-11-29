import "../../styles.css";




const Header = (props) => {

    //Searchbar doesn't do anything; This is just to make it more fun :)
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            window.location.href = ("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        }
    }

    return (
        <div className="header" >
            <span className="homeTitleDiv" >
                {props.header}
            </span>
            <span className="searchBar" >
                <input onKeyDown={handleEnter} className="searchInput" placeholder="Search Tweeter" />
                <svg className="searchImg" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"/></svg>
            </span>
        </div>
    )
}

export default Header;