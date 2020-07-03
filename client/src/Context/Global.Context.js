import React, { useState, useReducer, createContext, useEffect } from 'react';
import Axios from 'axios';
import Alert from '../Components/Alert.Comp';
import { reducer as alertReducer } from './Alert.Reducer';

export const GlobalContext = createContext();

var clearAlertsTimeout;

export const GlobalProvider = (props) => {
	const [ posts, setPosts ] = useState([]);
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);

	const [ state, dispatch ] = useReducer(alertReducer, []);

	useEffect(
		() => {
			clearTimeout(clearAlertsTimeout);
			clearAlertsTimeout = setTimeout(() => {
				dispatch({ type: 'CLEAR_ALERTS' });
			}, 5000);
		},
		[ state ]
	);

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = () => {
		Axios.get('/posts')
			.then((res) => {
				setPosts(res.data);
			})
			.catch(() => {
				setPosts({
					error: true,
					msg: 'Unable to get posts 📭'
				});
			});
	};

	return (
		<GlobalContext.Provider
			value={{
				postsState: [ posts, setPosts ],
				isLoggedInState: [ isLoggedIn, setIsLoggedIn ],
				getPosts: getPosts,
				alert: dispatch
			}}
		>
			{props.children}
			<div className="alerts">
				{state.map((alertObj, index) => (
					<Alert key={alertObj.id} index={index} alert={alertObj} dispatch={dispatch} />
				))}
			</div>
		</GlobalContext.Provider>
	);
};
