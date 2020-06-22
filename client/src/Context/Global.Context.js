import React, { useState, createContext, useEffect } from 'react';
import Axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
	const [ posts, setPosts ] = useState([]);
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);

	useEffect(() => {
		getPosts();
	}, [])

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
	}

	return (
		<GlobalContext.Provider
			value={{ postsState: [ posts, setPosts ], isLoggedInState: [ isLoggedIn, setIsLoggedIn ], getPosts: getPosts }}
		>
			{props.children}
		</GlobalContext.Provider>
	);
};
