import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../Context/Global.Context';
import Axios from 'axios';

function Login() {
	const { isLoggedInState } = useContext(GlobalContext);
	const [ isLoggedIn, setIsLoggedIn ] = isLoggedInState;

	const [ signInFormAct, setSignInFormAct ] = useState(false);
	const [ signInError, setSignInError ] = useState('');

	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	useEffect(() => {
		LoggedIn();
	}, []);

	const LoggedIn = () => {
		Axios.post('/user/isLoggedIn', null, { withCredentials: true })
			.then((res) => {
				setIsLoggedIn(res.data.loggedIn);
			})
			.catch((err) => console.log(err));
	};

	const SignOut = () => {
		Axios.post('/user/logout', null, { withCredentials: true })
			.then((res) => {
				setIsLoggedIn(!isLoggedIn);
			})
			.catch((err) => console.log(err));
	};

	const onSubmitSignIn = (e) => {
		e.preventDefault();

		if (email === '' || password === '') return setSignInError('*Please fill out all Fields');

		const LoginInfo = {
			email: email,
			password: password
		};

		Axios.post('/user/login', LoginInfo, { withCredentials: true })
			.then((res) => {
				if (!res.data.err) {
					setSignInFormAct(false);
					setEmail('');
					setPassword('');
					LoggedIn();
					setSignInError('');
				} else {
					setSignInError(res.data.msg);
				}
			})
			.catch((err) => console.log(err));
	};

	if (isLoggedIn) {
		return (
			<div className="signInForm">
				<button className="signInForm__activator" onClick={() => SignOut()}>
					Sign Out
				</button>
			</div>
		);
	} else {
		return (
			<div className="signInForm">
				<button className="signInForm__activator" onClick={() => setSignInFormAct(!signInFormAct)}>
					Sign In
				</button>
				<div
					className="signInForm__form"
					style={signInFormAct ? { opacity: '1', height: '220px' } : { opacity: '0', height: '0px' }}
				>
					<form onSubmit={onSubmitSignIn}>
						<span className="signInForm__error">{signInError}</span>

						<label htmlFor="form__email">Email:</label>
						<input type="text" id="form__email" value={email} onChange={(e) => setEmail(e.target.value)} />

						<label htmlFor="form__password">Password:</label>
						<input
							type="password"
							id="form__password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<br />
						<br />

						<button className="signInForm__button" type="submit">
							Sign In
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
