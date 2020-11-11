const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const File = require('../models/file');
const jwt = require('jsonwebtoken');
const secret_key = 'xxxxxxxxx'



const storage = multer.diskStorage({
	destination : function(req,file,cb) {
		cb(null,'./public/images')
	},
	filename:function(req,file,cb) {
		let image = file.originalname.split('.').pop();
		cb(null,Date.now() +'.' + image)
	}
})

const upload = multer({
	storage : storage
})

router.post('/addpost',upload.single('file'),async(req,res)=>{
	const authtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYTVlM2IxMDYtMDYyOS00OTgzLTg2N2MtNGMzZjZkZWM0MGM1IiwiaWF0IjoxNjA1MDQ5NjI4fQ.fWM0969w5u5HDWOHH9n5Uc7ePkC6hARK0jYd5xO4DSQ';
    const filename = req.file.filename;
    const path = req.file.path;
    const data = await jwt.verify(authtoken,secret_key);
    if(_.isEmpty(authtoken)) {
    	res.json({
    		status : 'error',
            message : 'authtoken is invalid'
    	})
    } 
    if(_.isEmpty(req.file)) {
    	res.json({
    		status : 'error',
    		message:'file is not valid'
    	})
    } 
    else {
    	if(data) {
    		const userfind = await User.findOne({uuid:data.uuid})
    		  if(userfind) {
	        	const fileadd = new File({
	        		useruuid : userfind.uuid,
	        		filename : filename,
	        		path : path,
	        		uuid : uuidv4()
	        	})
	        	const filesave = await fileadd.save();
	        	if(filesave) {
	        		res.json({
	        			status : 'success',
	        			message : 'post_added_sucessfully',
	        			data : filesave
	        		})
	        	} else {
	        		res.json({
	        			status : 'error',
	        			message : 'cant_add'
	        		})
	        	}
        	} else {
        		res.json({
        			status : 'error',
        			message : 'cant_find_user'
        		})
        	}
    	} else {
    		res.json({
    			status : 'error',
    			message : 'token is not valid'
    		})
    	}
    }
})


router.get('/getpost',async(req,res)=>{
	const authtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYTVlM2IxMDYtMDYyOS00OTgzLTg2N2MtNGMzZjZkZWM0MGM1IiwiaWF0IjoxNjA1MDQ5NjI4fQ.fWM0969w5u5HDWOHH9n5Uc7ePkC6hARK0jYd5xO4DSQ';
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'authtoken is invalid'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid:verifytoken.uuid});
			if(usercheck) {
				const file = await File.find({});
				if(file.length>0) {
					res.json({
						data : file
					})
				} else {
					res.json({
						status : 'error',
						message : 'cant find post'
					})
				}
			}
		} else {
			res.json({
				status : 'error',
				message : 'token is invalid'
			})
		}
	}
})


router.get('/deletepost',async(req,res)=>{
	const authtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYTVlM2IxMDYtMDYyOS00OTgzLTg2N2MtNGMzZjZkZWM0MGM1IiwiaWF0IjoxNjA1MDQ5NjI4fQ.fWM0969w5u5HDWOHH9n5Uc7ePkC6hARK0jYd5xO4DSQ';
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'token cant find'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid : verifytoken.uuid});
			if(usercheck) {
				const filefind = await File.findOne({useruuid:usercheck.uuid});
				if(filefind) {
					const deletepost = await File.remove({uuid:filefind.uuid});
					if(deletepost) {
						res.json({
							status : 'success',
							message : 'post removed sucessfully',
							data : deletepost
						})
					} else {
						res.json({
							status : 'error',
							message : 'file cant remove'
						})
					}
				} else {
					res.json({
						status : 'error',
					    message : 'cannot find post'
					})
				}
			} else {
				res.json({
					status : 'error',
					message : 'user is not valid'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'token is not valid'
			})
		}
	}
})

module.exports = router;