import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./page-components/home-page/HomePage";
import ProfilePage from "./page-components/profile-page/ProfilePage";
import SigninPage from "./page-components/signin-page/SigninPage";
import SignupPage from "./page-components/signup-page/SignupPage";


const Routes = () => {

	return (
		<Router>

			<Switch>
				<Route exact path="/signin" component={SigninPage} />
				<Route exact path="/signup" component={SignupPage} />
				<Route exact path="/" component={HomePage} />
				<Route path="/" component={ProfilePage} />
			</Switch>

		</Router>
	);
}

export default Routes;
