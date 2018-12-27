import { combineReducers } from 'redux';

let initialState = {
	account: {
		userInput: {
			username: '',
			password: '',
			address: '',
			email: ''
		},
		userInfo: {
			username: '',
			address: '',
			email: '',
			wishedItemsNum: 0
		},
		actionType: '',
		token: '',
		errorMsg: '',
		submitionStatus: '',
		loading: false
	},
	book: {
		filterString: '',
		searchString: '',
		bookList: [],
		userBooks: [],
		searchResult: [],
		loading: false,
		errorMsg: '',
		wishedItemsNumMsg: ''
	},
	curNav: window.location.pathname.slice(1)
}

const account = (state = initialState.account, action) => {
	switch(action.type){
		case 'CHANGE_ACTION_TYPE':
			return {
				...state,
				actionType: action.actionType,
				errorMsg: '',
				submitionStatus: ''
			};
		case 'ACCOUNT_REQUEST':
			let { username, password, address, email, actionType } = action;
			return {
				...state,
				userInput: { username, password, address, email },
				userInfo: {
					username: '',
					address: '',
					email: ''
				},
				actionType,
				token: '',
				errorMsg: '',
				submitionStatus: '',
				loading: true
			};
		case 'ACCOUNT_REQUEST_SUCCESS':
			let { userInfo, token } = action;
			return {
				...state,
				userInput: {
					username: '',
					password: '',
					address: '',
					email: ''
				},
				userInfo,
				token,
				submitionStatus: state.actionType === 'logout' ? '' : 'success',
				loading: false
			}
		case 'ACCOUNT_REQUEST_FAILURE':
			let { errorMsg } = action;
			return {
				...state,
				errorMsg,
				submitionStatus: 'error',
				loading: false
			}
		case 'UPDATE_UESR_INFO_REQUEST':
			return {
				...state,
				loading: true,
				userInfo: {
					...state.userInfo,
					address: action.address,
					email: action.email,
					wishedItemsNum: action.wishedItemsNum
				}
			}
		case 'UPDATE_UESR_INFO_REQUEST_SUCCESS':
			return {
				...state,
				loading: false
			}
		default: 
			return state;
	}
}

const book = (state = initialState.book, action) => {
	let bookIndex;
	switch(action.type){
		case 'UPDATE_FILTER_STRING': 
			return {
				...state,
				filterString: action.filterString
			}
		case 'BOOK_REQUEST':
			return {
				...state,
				loading: true,
				errorMsg: ''
			}
		case 'BOOK_REQUEST_SUCCESS':
			return {
				...state,
				loading: false,
				bookList: action.bookList
			}
		case 'BOOK_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'BOOK_SEARCH':
			return {
				...state,
				searchString: action.searchString,
				loading: true,
				errorMsg: ''
			}
		case 'BOOK_SEARCH_SUCCESS':
			return {
				...state,
				loading: false,
				errorMsg: '',
				searchResult: action.searchResult
			}
		case 'BOOK_SEARCH_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'USER_BOOK_REQUEST':
			return {
				...state,
				loading: true,
				errorMsg: ''
			}
		case 'USER_BOOK_REUQEST_SUCCESS':
			return {
				...state,
				loading: false,
				userBooks: action.userBooks
			}
		case 'USER_BOOK_REUQEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'ADD_NEW_BOOK_REQUEST': 
			return {
				...state,
				loading: true,
				errorMsg: ''
			}
		case 'ADD_NEW_BOOK_REQUEST_SUCCESS':
			let newBook = {
				...action.bookInfo,
				ownedBy: action.username,
				status: 'listed'
			};
			return {
				...state,
				loading: false,
				userBooks: [...state.userBooks, newBook]
			}
		case 'ADD_NEW_BOOK_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'REMOVE_USER_BOOK_REQUEST':
			return {
				...state,
				loading: true,
				errorMsg: ''
			}
		case 'REMOVE_USER_BOOK_REQUEST_SUCCESS':
			bookIndex = state.userBooks.findIndex(book => book._id === action.bookInfo._id);
			return {
				...state,
				loading: false,
				userBooks: [...state.userBooks.slice(0, bookIndex), ...state.userBooks.slice(bookIndex + 1)]
			}
		case 'REMOVE_USER_BOOK_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'ADD_TO_WISHLIST_REQUEST':
			return {
				...state,
				loading: true,
				wishedItemsNumMsg: ''
			}
		case 'ADD_TO_WISHLIST_REQUEST_SUCCESS':
			return {
				...state,
				loading: false,
				wishedItemsNum: action.wishedItemsNum,
				wishedItemsNumMsg: action.wishedItemsNumMsg
			}
		case 'ADD_TO_WISHLIST_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				wishedItemsNumMsg: action.wishedItemsNumMsg
			}
		case 'REMOVE_WISHLIST_REQUEST':
			return {
				...state,
				loading: true,
				errorMsg: '',
				wishedItemsNumMsg: ''
			}
		case 'REMOVE_WISHLIST_REQUEST_SUCCESS':
			bookIndex = state.userBooks.findIndex(book => book._id === action.bookInfo._id);
			return {
				...state,
				loading: false,
				userBooks: [...state.userBooks.slice(0, bookIndex), ...state.userBooks.slice(bookIndex + 1)],
				wishedItemsNum: action.wishedItemsNum,
			}
		case 'REMOVE_WISHLIST_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		case 'TRADE_REQUEST':
			return {
				...state,
				loading: true,
				errorMsg: ''
			}
		case 'TRADE_REQUEST_SUCCESS':
			bookIndex = state.userBooks.findIndex(book => book._id === action.bookInfo._id);
			let updatedBook = state.userBooks[bookIndex];
			updatedBook.status = action.tradeType === 'confirm' ? 'traded' : 'listed';
			updatedBook.requiredBy = action.tradeType === 'confirm' ? updatedBook.requiredBy : '';
			return {
				...state,
				loading: false,
				userBooks: [
					...state.userBooks.slice(0, bookIndex), 
					updatedBook, 
					...state.userBooks.slice(bookIndex + 1)
				]
			}
		case 'TRADE_REQUEST_FAILURE':
			return {
				...state,
				loading: false,
				errorMsg: action.errorMsg
			}
		default:
			return state;
	}
}

const curNav = (state = initialState.curNav, action) => {
	switch(action.type) {
		case 'CHANGE_NAV': 
			return action.curNav;
		default: 
			return state;
	}
}

export const reducer = combineReducers({ account, book, curNav })
