const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
let Post = require('../models/post.model');
const verify = require('./verifyToken');
var AWS = require('aws-sdk');

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET = process.env.BUCKET;

//GET: '/posts/'
router.get('/', (req, res) => {
	Post.find().sort({ createdAt: -1 }).then((posts) => res.json(posts)).catch((err) => res.status(400));
});

//POST: '/posts/add'
router.post('/add', verify, (req, res) => {
	var post = new Post({
		media: null,
		content: req.body.content
	});

	const uploadPost = () => {
		post.save().then(() => res.status(200).json('Post added')).catch((err) => res.status(404));
	};

	if (req.files !== null) {
		if (
			!req.files.media.mimetype.includes('jpeg') &&
			!req.files.media.mimetype.includes('png') &&
			!req.files.media.mimetype.includes('gif') &&
			!req.files.media.mimetype.includes('webm') &&
			!req.files.media.mimetype.includes('mp4')
		) {
			return res.status(400).json('File type not supported').send();
		}

		post.media = req.files.media.name = uuidv4() + '.' + req.files.media.mimetype.split('/')[1];

		const s3 = new AWS.S3({
			accessKeyId: ACCESS_KEY_ID,
			secretAccessKey: SECRET_ACCESS_KEY,
			Bucket: BUCKET
		});

		var params = {
			Bucket: BUCKET,
			Key: post.media, // File name you want to save as in S3
			Body: req.files.media.data
		};

		var awsUploadPromise = new Promise((resolve, reject) => {
			s3.upload(params, function(err, data) {
				if (err) {
					return reject(err);
				} else if (data) {
					return resolve(data.Location);
				}
			});
		});

		awsUploadPromise
			.then((data) => {
				console.log(`File uploaded successfully. ${data.Location}`);
				uploadPost();
			})
			.catch((err) => {
				console.log(`aws s3 upload ERROR: ${err}`);
				res.status(400).json('Unable to upload media');
			});
	} else {
		uploadPost();
	}
});

router.post('/remove/:id', verify, (req, res) => {
	Post.findById(req.params.id)
		.then((res) => {
			console.log(res);

			if (res.media === null) return removePost();

			const s3 = new AWS.S3({
				accessKeyId: ACCESS_KEY_ID,
				secretAccessKey: SECRET_ACCESS_KEY,
				Bucket: BUCKET
			});

			var params = { Bucket: BUCKET, Key: res.media };

			s3.deleteObject(params, (err, data) => {
				if (err) throw err;

				return removePost();
			});
		})
		.catch((err) => {
			res.send(err);
		});

	const removePost = () => {
		Post.findByIdAndDelete(req.params.id)
			.then(() => {
				res.send('Post removed');
			})
			.catch((err) => {
				res.send(err);
			});
	};
});

module.exports = router;
