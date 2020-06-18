import React from 'react';

function calcAge(dateString) {
	var birthday = +new Date(dateString);
	return ~~((Date.now() - birthday) / 31557600000);
}

function Profile() {
	return (
		<div className="profile">
			<img className="profile__image" loading="lazy" src={require('../Images/ProfilePic.jpg')} alt="" />
			<h1 className="profile__name">Martin H. Olesen</h1>
			<p className="profile__desc">
				Hi, I'm Martin a {calcAge('November 16, 1999')} year old danish programming student based in Copenhagen.
				I'm Currently attending TEC Copenhagen and looking for place to intern so feel free to email me at{' '}
				<a
					className="profile__link"
					href="mailto:mho.workmail@gmail.com"
					tagret="_blank"
					aria-label="Opens Email"
				>
					mho.workmail@gmail.com
				</a>. I mostly work with full stack web development in languages such as javascript and C# read more on
				my{' '}
				<a className="profile__link" href="https://bit.ly/2Zrlxbr" target="_blank" rel="noopener noreferrer">
					portfolio
				</a>.
			</p>

			<a className="profile__link" href="https://bit.ly/2Zrlxbr" target="_blank" rel="noopener noreferrer">
				Portfolio
			</a>
			<span> • </span>
			<a className="profile__link" href="https://bit.ly/2TtMyrD" target="_blank" rel="noopener noreferrer">
				LinkedIn
			</a>
			<span> • </span>
			<a className="profile__link" href="https://bit.ly/376diCs" target="_blank" rel="noopener noreferrer">
				GitHub
			</a>
			<span> • </span>
			<a className="profile__link" href="https://bit.ly/2NBdt0K" target="_blank" rel="noopener noreferrer">
				CodePen
			</a>
		</div>
	);
}

export default Profile;
