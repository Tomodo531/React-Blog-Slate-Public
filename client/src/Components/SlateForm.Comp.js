// Import React dependencies.
import React, { useMemo, useState, useCallback, useContext } from 'react';
// Import the Slate editor factory.
import { createEditor, Transforms, Editor, Text } from 'slate';
import escapeHtml from 'escape-html';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';
import { FaLink, FaBold, FaCode, FaHeading, FaImages, FaTimes } from 'react-icons/fa';
import Axios from 'axios';
import { GlobalContext } from './Global.Context';

const MarkCoverter = (children) => {
	var result = '';

	children.forEach((child) => {
		if (child.bold) {
			result += '<strong>' + child.text + '</strong>';
		} else if (child.headline) {
			result += '<h2>' + child.text + '</h2>';
		} else if (child.link) {
			result += '<a href="' + child.text + '">' + child.text + '</a>';
		} else if (child.code) {
			result += '<code>' + child.text + '</code>';
		} else {
			result += child.text;
		}
	});

	return result;
};

const serialize = (value) => {
	var serializeData = '';

	value.forEach((node) => {
		if (Text.isText(node)) {
			return escapeHtml(node.text);
		}

		serializeData += `<p>${MarkCoverter(node.children)}</p>`;
	});

	return serializeData;
};

// Define our own custom set of helpers.
const CustomEditor = {
	isBoldMarkActive(editor) {
		const [ match ] = Editor.nodes(editor, {
			match: (n) => n.bold === true,
			universal: true
		});

		return !!match;
	},

	isHeadlineMarkActive(editor) {
		const [ match ] = Editor.nodes(editor, {
			match: (n) => n.headline === true,
			universal: true
		});

		return !!match;
	},

	isCodekMarkActive(editor) {
		const [ match ] = Editor.nodes(editor, {
			match: (n) => n.code === true,
			universal: true
		});

		return !!match;
	},

	isLinkMarkActive(editor) {
		const [ match ] = Editor.nodes(editor, {
			match: (n) => n.link === true,
			universal: true
		});

		return !!match;
	},

	toggleBoldMark(editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor);
		Transforms.setNodes(editor, { bold: isActive ? null : true }, { match: (n) => Text.isText(n), split: true });
	},

	toggleHeadlineMark(editor) {
		const isActive = CustomEditor.isHeadlineMarkActive(editor);
		Transforms.setNodes(
			editor,
			{ headline: isActive ? null : true },
			{ match: (n) => Text.isText(n), split: true }
		);
	},

	toggleCodeMark(editor) {
		const isActive = CustomEditor.isCodekMarkActive(editor);
		Transforms.setNodes(editor, { code: isActive ? null : true }, { match: (n) => Text.isText(n), split: true });
	},

	toggleLinkMark(editor) {
		const isActive = CustomEditor.isLinkMarkActive(editor);
		Transforms.setNodes(editor, { link: isActive ? null : true }, { match: (n) => Text.isText(n), split: true });
	}
};

const App = () => {
	const { postsState, isLoggedInState } = useContext(GlobalContext);
	const [ posts, setPosts ] = postsState;
	const [ isLoggedIn ] = isLoggedInState;

	const editor = useMemo(() => withReact(createEditor()), []);
	const [ value, setValue ] = useState(initialValue);
	const [ file, setFile ] = useState(null);
	const [ filePreview, setFilePreview ] = useState('');
	const [ uploadProcentage, setUploadProcentage ] = useState(0);

	const SubmitPost = (content) => {
		if (content === '<p></p>' && file === null)
			return alert("It's not possible to make a post without text or an image/video");

		const newPost = new FormData();

		newPost.append('content', content);
		newPost.append('media', file);

		Axios.post('/posts/add', newPost, {
			withCredentials: true,
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			onUploadProgress: (e) => {
				setUploadProcentage(parseInt(Math.round(e.loaded * 100 / e.total)));
			}
		})
			.then((res) => {
				console.log(res);
				Transforms.deselect(editor);
				setValue(initialValue);
				clearFileInput();
				setUploadProcentage(0);

				Axios.get('/posts').then((res) => setPosts(res.data)).catch((error) => {
					setPosts({
						error: true,
						msg: 'Unable to get posts 📭'
					});
				});
			})
			.catch((err) => console.log(err));
	};

	const clearFileInput = () => {
		setFilePreview('');
		setFile(null);
	};

	const renderElement = useCallback((props) => {
		switch (props.element.type) {
			case 'code':
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback((props) => {
		return <Leaf {...props} />;
	}, []);

	if (!isLoggedIn) return null;

	return (
		<div className="postform">
			<div className="uploadPrgress" style={uploadProcentage === 0 ? { display: 'none' } : { display: 'flex' }}>
				<h1>{uploadProcentage}%</h1>
			</div>

			<Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
				<div
					className="postform__mediaPreviewContianer"
					style={filePreview === '' ? { display: 'none' } : { display: 'block' }}
				>
					<FaTimes className="postform__mediaPreviewClearButton" onClick={clearFileInput} />

					{filePreview !== '' ? file.type.includes('webm') || file.type.includes('mp4') ? (
						<video controls className="postform__mediaPreview">
							<source src={filePreview} type={`video/${file.type.split('/')[1]}`} />
							Sorry, your browser doesn't support embedded videos.
						</video>
					) : (
						<img className="postform__mediaPreview" loading="lazy" src={filePreview} alt="" />
					) : null}
				</div>

				<div className="postform__toolbar">
					<button
						className="postform__toolbutton"
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleHeadlineMark(editor);
						}}
					>
						<FaHeading />
					</button>

					<button
						className="postform__toolbutton"
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleBoldMark(editor);
						}}
					>
						<FaBold />
					</button>

					<button
						className="postform__toolbutton postform__linkbutton"
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleLinkMark(editor);
						}}
					>
						<FaLink />
					</button>

					<button
						className="postform__toolbutton"
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeMark(editor);
						}}
					>
						<FaCode />
					</button>

					<label htmlFor="postform__fileupload" className="postform__toolbutton">
						<FaImages />
					</label>
					<input
						type="file"
						id="postform__fileupload"
						accept="image/png, image/jpeg, image/gif, video/mp4, video/webm"
						value={file ? '' : file}
						onChange={(e) => {
							setFilePreview(window.URL.createObjectURL(e.target.files[0]));
							setFile(e.target.files[0]);
						}}
					/>

					<button
						className="postform__toolbutton postform__submit"
						onMouseDown={(event) => {
							event.preventDefault();
							SubmitPost(serialize(value));
						}}
					>
						Submit
					</button>
				</div>
				<Editable
					placeholder={"What's on your mind? 🤔"}
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					onKeyDown={(event) => {
						if (!event.ctrlKey) {
							return;
						}

						// Replace the `onKeyDown` logic with our new commands.
						switch (event.key) {
							case 'b': {
								event.preventDefault();
								CustomEditor.toggleBoldMark(editor);
								break;
							}
							default:
						}
					}}
				/>
			</Slate>
		</div>
	);
};

const Leaf = (props) => {
	if (props.leaf.bold && props.leaf.link) {
		return (
			<a {...props.attributes} href={props.children} style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>
				{props.children}
			</a>
		);
	}

	if (props.leaf.bold) {
		return (
			<span {...props.attributes} style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>
				{props.children}
			</span>
		);
	}

	if (props.leaf.headline) {
		return (
			<span {...props.attributes} style={{ fontSize: 1.5 + 'em', fontWeight: 700 }}>
				{props.children}
			</span>
		);
	}

	if (props.leaf.code) {
		return <code {...props.attributes}>{props.children}</code>;
	}

	if (props.leaf.link) {
		return (
			<a {...props.attributes} href={props.children}>
				{props.children}
			</a>
		);
	}

	return <span {...props.attributes}>{props.children}</span>;
};

const CodeElement = (props) => {
	return (
		<pre {...props.attributes}>
			<code>{props.children}</code>
		</pre>
	);
};

const DefaultElement = (props) => {
	return <p {...props.attributes}>{props.children}</p>;
};

const initialValue = [
	{
		type: 'paragraph',
		children: [ { text: '' } ]
	}
];

export default App;
