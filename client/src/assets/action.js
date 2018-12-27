import { 
	sendAccountRequest, 
	updateUserInfo,
	getBookList, 
	getUserBooks, 
	addNewBook, 
	removeUserBook, 
	addToWishList,
	removeFromWishList, 
	tradeBook,
	searchBooks
} from './client';

// change nav
export const changeNav = curNav => ({
	type: 'CHANGE_NAV',
	curNav
})

// user account actions
export const changeActionType = (actionType) => ({
	type: 'CHANGE_ACTION_TYPE',
	actionType
})

// login logout signup

const accountRequest = ({ actionType, username, password, address, email }) => ({
	type: 'ACCOUNT_REQUEST',
	actionType,
	username,
	password,
	address, 
	email
})

const accountRequestSuccess = ({ userInfo, token }) => ({
	type: 'ACCOUNT_REQUEST_SUCCESS',
	userInfo, 
	token
})

const accountRequestFailure = ({ errorMsg }) => ({
	type: 'ACCOUNT_REQUEST_FAILURE',
	errorMsg
})

export const submitAccountRequest = ({ actionType, username, password, address, email }) => {
	return dispatch => {
		dispatch(accountRequest({ actionType, username, password, address, email }))
		sendAccountRequest({ actionType, username, password, address, email }).then(resp => {
			if(resp.error){
				let errorMsg = typeof resp.error === 'string' ? resp.error : '';
				dispatch(accountRequestFailure({ errorMsg }));
			} else {
				let { userInfo, token } = resp;
				userInfo = userInfo || {};
				token = token || '';
				dispatch(accountRequestSuccess({ userInfo, token }));
			}
		})
	}
}

// update user info

const updateUserInfoRequest = ({ address, email }) => ({
	type: 'UPDATE_UESR_INFO_REQUEST',
	address,
	email
})

const updateUserInfoRequestSuccess = () => ({
	type: 'UPDATE_UESR_INFO_REQUEST_SUCCESS'
})

export const submitUpdateUserInfoRequest = ({ username, userInfo, token }) => {
	return dispatch => {
		let { address, email } = userInfo;
		dispatch(updateUserInfoRequest({ address, email }))
		updateUserInfo({ username, userInfo, token }).then(resp => {
			dispatch(updateUserInfoRequestSuccess());
		})
	}
}

// book flow actions
export const updateFilterString = filterString => ({
	type: 'UPDATE_FILTER_STRING',
	filterString
})

// --- book list request

const bookRequest = () => ({
	type: 'BOOK_REQUEST'
})

const bookRequestSuccess = ({ bookList }) => ({
	type: 'BOOK_REQUEST_SUCCESS',
	bookList
})

const bookRequestFailure = ({ errorMsg }) => ({
	type: 'BOOK_REQUEST_FAILURE',
	errorMsg
})

export const submitBookRequest = () => {
	return dispatch => {
		dispatch(bookRequest());
		getBookList().then(resp => {
			if(resp.error){
				dispatch(bookRequestFailure({ errorMsg: resp.error }));
			} else {
				dispatch(bookRequestSuccess({ bookList: resp }))
			}
		})
	}
}

// --- user book request

const userBookRequest = () => ({
	type: 'USER_BOOK_REQUEST'
})

const userBookRequestSuccess = ({ userBooks }) => ({
	type: 'USER_BOOK_REUQEST_SUCCESS',
	userBooks
})

const userBookRequestFailure = ({ errorMsg }) => ({
	type: 'USER_BOOK_REQUEST_FAILURE',
	errorMsg
})

export const submitUserBookRequest = username => {
	return dispatch => {
		dispatch(userBookRequest())
		getUserBooks(username).then(resp => {
			if(resp.error){
				dispatch(userBookRequestFailure({ errorMsg: resp.error }))
			} else {
				dispatch(userBookRequestSuccess({ userBooks: resp }))
			}
		})
	}
}

// --- add new book request 

const addNewBookRequest = () => ({
	type: 'ADD_NEW_BOOK_REQUEST'
})

const addNewBookRequestSuccess = ({ bookInfo, username }) => ({
	type: 'ADD_NEW_BOOK_REQUEST_SUCCESS',
	bookInfo,
	username
})

const addNewBookRequestFailure = ({ errorMsg }) => ({
	type: 'ADD_NEW_BOOK_REQUEST_FAILURE',
	errorMsg	
})

export const submitAddNewBookRequest = ( bookInfo, userInfo, token ) => {
	let username = userInfo.username;
	return dispatch => {
		dispatch(addNewBookRequest())
		addNewBook({ bookInfo, username, token }).then(resp => {
			if(resp.error){
				dispatch(addNewBookRequestFailure({ errorMsg: resp.error }))
			} else {
				dispatch(addNewBookRequestSuccess({ bookInfo, username }))
			}
		})
	}
}

// --- remove user book

const removeUserBookRequest = () => ({
	type: 'REMOVE_USER_BOOK_REQUEST'
})

const removeUserBookRequestSuccess = ({ bookInfo, username }) => ({
	type: 'REMOVE_USER_BOOK_REQUEST_SUCCESS',
	bookInfo,
	username
})

const removeUserBookRequestFailure = ({ errorMsg }) => ({
	type: 'REMOVE_USER_BOOK_REQUEST_FAILURE',
	errorMsg	
})

export const submitRemoveUserBookRequest = ( bookInfo, userInfo, token ) => {
	let username = userInfo.username;
	return dispatch => {
		dispatch(removeUserBookRequest())
		removeUserBook({ bookId: bookInfo._id, username, token }).then(resp => {
			if(resp.error){
				dispatch(removeUserBookRequestFailure({ errorMsg: resp.error }))
			} else {
				dispatch(removeUserBookRequestSuccess({ bookInfo, username }))
			}
		})
	}
}

// --- add to wishlist 

const addToWishListRequest = () => ({
	type: 'ADD_TO_WISHLIST_REQUEST'
})

const addToWishListRequestSuccess = ({ wishedItemsNum, wishedItemsNumMsg }) => ({
	type: 'ADD_TO_WISHLIST_REQUEST_SUCCESS',
	wishedItemsNum,
	wishedItemsNumMsg
})

const addToWishListRequestFailure = ({ errorMsg, wishedItemsNumMsg }) => ({
	type: 'ADD_TO_WISHLIST_REQUEST_FAILURE',
	wishedItemsNumMsg	
})

export const submitAddToWishListRequest = ( bookId, userInfo, token ) => {
	let username = userInfo.username;
	return dispatch => {
		dispatch(addToWishListRequest());
		if(userInfo.wishedItemsNum >= 3){
			dispatch(addToWishListRequestFailure({ 
				wishedItemsNumMsg: "rejected" 
			}));
		} else {
			userInfo.wishedItemsNum = userInfo.wishedItemsNum + 1;
			addToWishList({ bookId, username, token }).then(resp => {
				if(resp.error){
					dispatch(addToWishListRequestFailure({ 
						wishedItemsNumMsg: "resp.error" 
					}));
				} else {
					updateUserInfo({ username, userInfo, token }).then(resp => {
						dispatch(addToWishListRequestSuccess({ 
							wishedItemsNum: userInfo.wishedItemsNum, 
							wishedItemsNumMsg: "added" 
						}));
					})
				}
			})
		}
	}
}

// --- remove book from wishlist

const removeWishListRequest = () => ({
	type: 'REMOVE_WISHLIST_REQUEST'
})

const removeWishListRequestSuccess = ({ bookInfo, username, wishedItemsNum }) => ({
	type: 'REMOVE_WISHLIST_REQUEST_SUCCESS',
	bookInfo,
	username,
	wishedItemsNum
})

const removeWishListRequestFailure = ({ errorMsg }) => ({
	type: 'REMOVE_WISHLIST_REQUEST_FAILURE',
	errorMsg	
})

export const submitRemoveWishListRequest = ( bookInfo, userInfo, token ) => {
	let username = userInfo.username;
	return dispatch => {
		dispatch(removeWishListRequest())
		removeFromWishList({ bookId: bookInfo._id, username, token }).then(resp => {
			if(resp.error){
				dispatch(removeWishListRequestFailure({ errorMsg: resp.error }))
			} else {
				userInfo.wishedItemsNum = userInfo.wishedItemsNum - 1;
				updateUserInfo({ username, userInfo, token }).then(resp => {
					dispatch(removeWishListRequestSuccess({ bookInfo, username, wishedItemsNum: userInfo.wishedItemsNum }));
				})
			}
		})
	}
}

// --- trade book (confirm or reject)

const tradeRequest = () => ({
	type: 'TRADE_REQUEST'
})

const tradeRequestSuccess = ({ bookInfo, username, tradeType }) => ({
	type: 'TRADE_REQUEST_SUCCESS',
	bookInfo,
	username,
	tradeType
})

const tradeRequestFailure = ({ errorMsg }) => ({
	type: 'TRADE_REQUEST_FAILURE',
	errorMsg	
})

export const submitTradeRequest = ( bookInfo, username, tradeType, token ) => {
	return dispatch => {
		dispatch(tradeRequest())
		tradeBook({ bookId: bookInfo._id, username, tradeType, token }).then(resp => {
			if(resp.error){
				dispatch(tradeRequestFailure({ errorMsg: resp.error }))
			} else {
				dispatch(tradeRequestSuccess({ bookInfo, username, tradeType }))
			}
		})
	}
}


// --- book search

const bookSearch = searchString => ({
	type: 'BOOK_SEARCH',
	searchString
})

const bookSearchSuccess = ({ searchResult }) => ({
	type: 'BOOK_SEARCH_SUCCESS',
	searchResult
})

const bookSearchFailure = ({ errorMsg }) => ({
	type: 'BOOK_SEARCH_FAILURE',
	errorMsg
})

export const submitBookSearch = searchString => {
	return dispatch => {
		dispatch(bookSearch(searchString));
		searchBooks(searchString).then(resp => {
			if(resp.error){
				dispatch(bookSearchFailure({ errorMsg: resp.error }))
			} else {
				dispatch(bookSearchSuccess({ searchResult: resp }))
			}
		})
	}
}
