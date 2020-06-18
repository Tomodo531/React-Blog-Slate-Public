import React, { useState, createContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
	const [ posts, setPosts ] = useState([]);
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);

	return (
		<GlobalContext.Provider
			value={{ postsState: [ posts, setPosts ], isLoggedInState: [ isLoggedIn, setIsLoggedIn ] }}
		>
			{props.children}
		</GlobalContext.Provider>
	);
};
