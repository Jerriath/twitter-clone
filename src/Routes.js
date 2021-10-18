import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePage from "./page-components/home-page/HomePage";
import LoginPage from "./page-components/login-page/LoginPage";
import SignupPage from "./page-components/signup-page/SignupPage";


const Routes = () => {

	return (
		<Router>

			<Switch>
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/signup" component={SignupPage} />
				<Route path="/" component={HomePage} />
			</Switch>

		</Router>
	);
}

export default Routes;
