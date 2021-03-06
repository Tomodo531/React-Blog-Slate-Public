import React from 'react';
import Profile from './Components/Profile.Comp';
import Feed from './Components/Feed.Comp';
import SlateTest from './Components/SlateForm.Comp';
import Login from './Components/Login.Comp';
import Footer from './Components/Footer.Comp';
import { GlobalProvider } from './Context/Global.Context';
import './App.css';

function App() {
	return (
		<GlobalProvider>
			<Login />
			<div className="container">
				<Profile />
				<SlateTest />
				<Feed />
			</div>
			<Footer />
		</GlobalProvider>
	);
}

export default App;
