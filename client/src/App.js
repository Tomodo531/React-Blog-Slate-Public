import React from 'react';
import Profile from './Components/Profile.Comp';
import Feed from './Components/Feed.Comp';
import SlateTest from './Components/SlateForm.Comp';
import Login from './Components/Login.Comp';
import { GlobalProvider } from './Components/Global.Context';
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
		</GlobalProvider>
	);
}

export default App;
