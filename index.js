const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const port = 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const mongodburl = 'mongodb+srv://sreedev:sreedev@cluster0.5lrqu.mongodb.net/node-socialmedia?retryWrites=true&w=majority';
mongoose.connect(mongodburl,{ useUnifiedTopology: true },{useNewUrlParser:true},(err,data)=>{
	if(data) {
		console.log('mongodb_connected_successfully')
	} else {
		console.log(err)
	}
})

app.use('/',require('./view/router.js'))



app.listen(port,()=>{
	console.log(`server is running on port ${port}`)
})