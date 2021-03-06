import React, { useEffect, useState, useContext, Fragment } from 'react';
import Interweave from 'interweave';
import Axios from 'axios';
import { FaRegTrashAlt, FaThumbtack } from 'react-icons/fa';
import { GlobalContext } from '../Context/Global.Context';
import 'animate.css';

function Feed() {
	const { postsState, isLoggedInState, getPosts, alert } = useContext(GlobalContext);
	const [ posts, setPosts ] = postsState;
	const [ isLoggedIn ] = isLoggedInState;
	const [ fullImage, setFullImage ] = useState('');

	const removePost = (id) => {
		Axios.post('/posts/remove/' + id, null, { withCredentials: true })
			.then(() => {
				const postRemove = posts.filter((obj) => {
					return obj._id !== id;
				});

				setPosts(postRemove);
				alert({
					type: 'SUCCESS_ALERT',
					alertText: 'Post successfully removed'
				});
			})
			.catch((err) => {
				console.log(err);
				alert({
					type: 'ERROR_ALERT',
					alertText: 'Something went wrong whilst removing post try again later'
				});
			});
	};

	const pinPost = (id) => {
		Axios.post('/posts/pin/' + id, null, { withCredentials: true })
			.then(() => {
				getPosts();
				alert({
					type: 'SUCCESS_ALERT',
					alertText: 'Pin status successfully changed'
				});
			})
			.catch((err) => {
				console.log(err);
				alert({
					type: 'ERROR_ALERT',
					alertText: 'Something went wrong whilst pinning post try again later'
				});
			});
	};

	return (
		<Fragment>
			<div
				className="fullImage"
				onClick={() => setFullImage('')}
				style={fullImage === '' ? { display: 'none' } : { display: 'flex' }}
			>
				<img
					className="fullImage_image animate__animated animate__zoomIn animate__faster"
					src={`https://blog-react-slate.s3.eu-north-1.amazonaws.com/${fullImage}`}
					alt="Image not found"
				/>
			</div>

			{posts.error ? (
				<div className="postError">
					<h1>{posts.msg}</h1>
				</div>
			) : posts.length === 0 ? (
				<div className="noPosts">
					<h1>
						No posts yet{' '}
						<span role="img" aria-label="EmptyMailbox">
							📭
						</span>
					</h1>
				</div>
			) : (
				posts.map((post) => (
					<Post
						post={post}
						isLoggedIn={isLoggedIn}
						removePost={removePost}
						pinPost={pinPost}
						setFullImage={setFullImage}
					/>
				))
			)}
		</Fragment>
	);
}

function Post({ post, isLoggedIn, removePost, pinPost, setFullImage }) {
	return (
		<div className="post animate__animated animate__fadeIn" key={post._id}>
			{post.media !== null ? post.media.includes('webm') || post.media.includes('mp4') ? (
				<video controls className="post__media">
					<source
						src={`https://blog-react-slate.s3.eu-north-1.amazonaws.com/${post.media}`}
						type={`video/${post.media.split('.')[1]}`}
					/>
					Sorry, your browser doesn't support embedded videos.
				</video>
			) : (
				<img
					className="post__media"
					onClick={() => setFullImage(post.media)}
					loading="lazy"
					src={`https://blog-react-slate.s3.eu-north-1.amazonaws.com/${post.media}`}
					alt=""
				/>
			) : null}

			<div className="post__content">
				<Interweave content={post.content} />

				<br />
				<span className="post__date">
					{DateFormat(post.createdAt)}
					{post.pined ? ' (Pinned)' : ''}
				</span>

				{isLoggedIn ? (
					<div className="post__options">
						<FaThumbtack
							className="post__pin"
							style={post.pined ? { fill: '#1a1a1a' } : null}
							onClick={() => pinPost(post._id)}
						/>
						<FaRegTrashAlt
							onClick={() => {
								if (
									window.confirm(
										"Are you sure you wish to delete this post? I've heard it's a good one..."
									)
								)
									removePost(post._id);
							}}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}

var DateFormat = (date) => {
	var dateArray = date.substring(0, 10).split('-');
	var monthArray = [ 'Jan', 'Fed', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

	return dateArray[2] + '. ' + monthArray[dateArray[1].replace(0, '') - 1] + ' ' + dateArray[0];
};

export default Feed;
