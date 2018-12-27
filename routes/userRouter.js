let express = require('express');
let passport = require('passport');
let authenticate = require('../authenticate');
let verify = require('../verify');

let userRouter = express.Router();
let User = require('../models/users');

// signup login and logout - all users
userRouter.route('/register')
	.post((req, res, next) => {
		let { username, password, address, email, actionType } = req.body;
		switch(actionType) {
			case 'signup':
				User.register(new User({username, address, email}), password, (err, user) => {
					if(err){
						return res.status(500).json({ error: err.message });
					}
					user.save((err, user) => {
						if(err){
							return res.status(500).json({ error: err.message });
						}
						passport.authenticate('local')(req, res, () => {
							let token = verify.getToken(user);
							let { username, address, email, wishedItemsNum } = user;
							res.status(200).json({
								message: 'Signup and login Successfully!',
								sucess: true,
								token,
								userInfo: { username, address, email, wishedItemsNum }
							});
						});
					});
				});
				break;
			case 'login':
				passport.authenticate('local', (err, user, info) => {
					if(err){
						return res.status(500).json({
							error: 'Could not log in user'
						})
					}
					if(!user){
						return res.status(401).json({
							error: 'Incorrect username or password'
						})
					}
					req.logIn(user, err => {
						if(err){
							return res.status(500).json({
								error: 'Could not log in user'
							})
						}
						let token = verify.getToken(user);
						let { username, address, email, wishedItemsNum } = user;
						res.status(200).json({
							message: 'Login Successfully!',
							success: true,
							token,
							userInfo: { username, address, email, wishedItemsNum }
						});
					});
				})(req, res, next);
				break;
			case 'logout':
				req.logout();
				res.status(200).json({
					message: 'Logout Successfully!'
				});
				break;
			default: 
				res.json({ error: 'Unrecognized action' });
		}
	})

// update user info (address, email, wishItemsNum) - auth user
userRouter.route('/info')
	.put(verify.verifyUser, (req, res) => {
		let { username, userInfo } = req.body;
		let { address, email, wishedItemsNum } = userInfo;
		if(wishedItemsNum === undefined){
			User.findOneAndUpdate({ username }, { address, email }, (err, user) => {
				if(err) res.json({ error: 'failed to update user information' });
				res.json({ message: 'Successfully updated user information' });
			});
		} else {
			User.findOneAndUpdate({ username }, { wishedItemsNum }, (err, user) => {
				if(err) res.json({ error: 'failed to update user wished items number' });
				res.json({ message: 'Successfully updated user wished items number' });
			});
		}
		
	})

module.exports = userRouter;
