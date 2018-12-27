let express = require('express');
let fetch = require('node-fetch');
let verify = require('../verify');

let bookRouter = express.Router();
let Book = require('../models/books');

const googleBooksPath = "https://www.googleapis.com/books/v1/volumes?maxResults=40&printType=books&q=";
// need to save in process.env;
const googleApiKey = process.env.GOOGLE_API_KEY;

// get posted book list ( db - Books ) - all users
bookRouter.route('/posted')
	.get((req, res) => {
		Book.find({}, (err, books) => {
			let bookData = books.map(book => ({
				_id: book._id,
				title: book.bookInfo.title,
				subtitle: book.bookInfo.subtitle,
				authors: book.bookInfo.authors,
				publishedDate: book.bookInfo.publishedDate,
				description: book.bookInfo.description,
				categories: book.bookInfo.categories,
				pageCount: book.bookInfo.pageCount,
				googleBookId: book.bookInfo.googleBookId,
				imageUrl: book.bookInfo.imageUrl,
				infoLink: book.bookInfo.infoLink,
				status: book.status,
				ownedBy: book.ownedBy,
				requiredBy: book.requiredBy
			}))
			res.json(bookData);
		})
	})

// get book from a certain user - all users
bookRouter.route('/:user')
	.get((req, res) => {
		Book.find({ ownedBy: req.params.user }, (err, books) => {
			let ownedBookData = books.map(book => ({
				_id: book._id,
				title: book.bookInfo.title,
				subtitle: book.bookInfo.subtitle,
				authors: book.bookInfo.authors,
				publishedDate: book.bookInfo.publishedDate,
				description: book.bookInfo.description,
				categories: book.bookInfo.categories,
				pageCount: book.bookInfo.pageCount,
				googleBookId: book.bookInfo.googleBookId,
				imageUrl: book.bookInfo.imageUrl,
				infoLink: book.bookInfo.infoLink,
				status: book.status,
				ownedBy: book.ownedBy,
				requiredBy: book.requiredBy
			}))
			Book.find({ requiredBy: req.params.user }, (err, books) => {
				requiredBookData = books.map(book => ({
					_id: book._id,
					title: book.bookInfo.title,
					subtitle: book.bookInfo.subtitle,
					authors: book.bookInfo.authors,
					publishedDate: book.bookInfo.publishedDate,
					description: book.bookInfo.description,
					categories: book.bookInfo.categories,
					pageCount: book.bookInfo.pageCount,
					googleBookId: book.bookInfo.googleBookId,
					imageUrl: book.bookInfo.imageUrl,
					infoLink: book.bookInfo.infoLink,
					status: book.status,
					ownedBy: book.ownedBy,
					requiredBy: book.requiredBy
				}))
				let bookData = [...ownedBookData, ...requiredBookData];
				res.json(bookData);
			})
		})
	})

// add new book/remove a book to booklist - auth user
bookRouter.route('/userbook')
	.post(verify.verifyUser, (req, res) => {
		let { bookInfo, username } = req.body;
		let newBook = new Book({ bookInfo, ownedBy: username });
		newBook.save((err, newbook) => {
			if(err){
				res.json({error: 'Some problem with adding this book...'});
			}
			res.json({ message: 'Successfully added this book' });
		})
	})
	.delete(verify.verifyUser, (req, res) => {
		let { bookId, username } = req.body;
		Book.remove({ _id: bookId, ownedBy: username }, (err, resp) => {
			res.json(resp)
		})
	})

// add to/remove from wish list - auth user
bookRouter.route('/wishlist/:operation')
	.put(verify.verifyUser, (req, res) => {
		let { bookId, username } = req.body;
		if(req.params.operation === 'add'){
			Book.findByIdAndUpdate(bookId, {requiredBy: username, status: 'inTrade'}, (err, book) => {
				if(err) res.json({ error: 'Some problem with adding this book to the wishlist...' });
				res.json(book);
			})
		} else if (req.params.operation === 'remove'){
			Book.findOneAndUpdate({ _id: bookId, requiredBy: username }, {requiredBy: '', status: 'listed'}, (err, book) => {
				if(err) res.json({ error: 'Some problem with removing this book from the wishlist...' });
				res.json(book);
			})
		}
		
	})

// update book status to respond to trading requirements - auth user
bookRouter.route('/trade/:operation')
	.put(verify.verifyUser, (req, res) => {
		let { bookId, username } = req.body;
		if(req.params.operation === 'reject'){
			Book.findOneAndUpdate({ _id: bookId, ownedBy: username }, {requiredBy: '', status: 'listed'}, (err, book) => {
				if(err) res.json({ error: 'Some problem with rejecting to trade this book...' });
				res.json(book);
			})
		} else if (req.params.operation === 'confirm'){
			Book.findOneAndUpdate({ _id: bookId, ownedBy: username, status: 'inTrade' }, {status: 'traded'}, (err, book) => {
				if(err) res.json({ error: 'Some problem with confiming to trade this book...' });
				res.json(book);
			})
		}
	})

// search and return result from google book api - all users
bookRouter.route('/search')
	.post((req, res) => {
		let { searchString } = req.body;
		let searchUrl = googleBooksPath + searchString + "&key=" + googleApiKey;
		fetch(searchUrl, {
			headers: {
				'Accept': 'application/json'
			}
		}).then(res => res.json())
		  .then(searchResult => {
		  	if(searchResult.totalItems === 0){
		  		res.json({ error: 'No book found!' })
		  	}
	  		let booksData = searchResult.items.map(book => {
		  		let { title, subtitle, authors, publishedDate, description, categories, pageCount, imageLinks, infoLink } = book.volumeInfo;
		  		let imageUrl = imageLinks && imageLinks.thumbnail.replace(/&zoom=1&edge=curl/, '');
		  		return { 
		  			title, 
		  			subtitle, 
		  			authors, 
		  			publishedDate, 
		  			description, 
		  			categories, 
		  			pageCount, 
		  			googleBookId: book.id, 
		  			imageUrl,
		  			infoLink
		  		};
	  		});
	  		res.json(booksData)
		  });
	})	

module.exports = bookRouter;
