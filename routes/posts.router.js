const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
let Post = require('../models/post.model');
const verify = require('./verifyToken');
var AWS = require('aws-sdk');

const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const sharp = require('sharp');
var sizeOf = require('image-size');
const isJpg = require('is-jpg');

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET = process.env.BUCKET;

//GET: '/posts/'
router.get('/', (req, res) => {
	Post.find().sort({ pined: -1, createdAt: -1 }).then((posts) => res.json(posts)).catch((err) => res.status(400));
});

async function imageCompression(file) {
	const convertToJpg = async (input) => {
		const inputDimensions = sizeOf(input);
		const largestDimension =
			inputDimensions.width > inputDimensions.height
				? { width: inputDimensions.width > 1000 ? 1000 : inputDimensions.wdith }
				: { height: inputDimensions.height > 1000 ? 1000 : inputDimensions.height };

		if (isJpg(input)) {
			return sharp(input).resize(largestDimension).toBuffer();
		}

		return sharp(input).resize(largestDimension).jpeg().toBuffer();
	};

	if (!file.media.mimetype.includes('gif') && !file.media.mimetype.includes('mp4')) {
		const compressedFile = await imagemin.buffer(file.media.data, {
			plugins: [ convertToJpg, mozjpeg({ quality: 85 }) ]
		});

		return compressedFile;
	} else {
		console.log('file: ', file.media.data);
		return file.media.data;
	}
}

//POST: '/posts/add'
router.post('/add', verify, async (req, res) => {
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

		post.media = req.files.media.name = uuidv4();

		const s3 = new AWS.S3({
			accessKeyId: ACCESS_KEY_ID,
			secretAccessKey: SECRET_ACCESS_KEY,
			Bucket: BUCKET
		});

		var params = {
			Bucket: BUCKET,
			Key: post.media, // File name you want to save as in S3
			Body: await imageCompression(req.files)
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

router.post('/pin/:id', verify, (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			post.pined = !post.pined;

			post.save().then(() => res.status(200).send('Post pined')).catch((err) => res.status(400).send(err));
		})
		.catch((err) => res.status(400).send(err));
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
