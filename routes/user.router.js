const router = require('express').Router();
const User = require('../models/user.model');
//Hashing library
const bcrypt = require('bcryptjs');
//Token Library
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

/* router.post('/register', async (req, res) => {
	const EmailDubCheck = await User.findOne({ email: req.body.email.toLowerCase() });
	if (EmailDubCheck) return res.send('Email is already in use');

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const userModel = new User({
		email: req.body.email.toLowerCase(),
		password: hashedPassword
	});

	userModel
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
}); */

router.post('/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email.toLowerCase() });
	if (!user) return res.json({ err: true, msg: '*Email or password is wrong' }).send();

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.json({ err: true, msg: '*Email or password is wrong' }).send();

	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

	console.log(req.body);
	console.log(token);

	res
		.cookie('auth_token', token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
			// secure: true
		})
		.send();
});

router.post('/logout', verify, (req, res) => {
	res
		.cookie('auth_token', null, {
			maxAge: 0
		})
		.send();
});

router.post('/isLoggedIn', verify, (req, res) => {
	console.log('isLoggedIn = true');
	res.json({ loggedIn: true });
});

module.exports = router;
