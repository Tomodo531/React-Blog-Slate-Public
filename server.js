const express = require('express');
const app = express();
const parh = require('path');
const fs = require('fs');
app.use(express.json());

const cors = require('cors');
app.use(
	cors({
		origin: 'http://localhost:3000' || 'http://blog-react-slate.herokuapp.com',
		credentials: true
	})
);

const mongoose = require('mongoose');

//Husk den nu hvis du skal uploade filer (-_-)
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//Husk cookieParser ellers virker withCredentials ikke
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Indeholder connection key
require('dotenv').config();

//Henter DB key
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUniFiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connetion established successfully');
});

const postRouter = require('./routes/posts.router');
const userRouter = require('./routes/user.router');

app.use('/posts', postRouter);
app.use('/user', userRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(_dirname, 'client', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Blog express server running on port: ${port}`);
});
