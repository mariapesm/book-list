export const sendAccountRequest = ({ actionType, username, password, address, email }) => (
	fetch('/user/register', {
		method: 'post',
		body: JSON.stringify({ actionType, username, password, address, email }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
)

export const updateUserInfo = ({ username, userInfo, token }) => (
	fetch('/user/info', {
		method: 'put',
		body: JSON.stringify({ username, userInfo }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)

export const getBookList = () => (
	fetch('/book/posted', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
)

export const getUserBooks = username => (
	fetch('/book/' + username, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
)

export const searchBooks = searchString => (
	fetch('/book/search', {
		method: 'post',
		body: JSON.stringify({ searchString }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
)

export const addNewBook = ({ bookInfo, username, token }) => (
	fetch('/book/userbook', {
		method: 'post',
		body: JSON.stringify({ bookInfo, username }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)

export const removeUserBook = ({ bookId, username, token }) => (
	fetch('/book/userbook', {
		method: 'delete',
		body: JSON.stringify({ bookId, username }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)

export const addToWishList = ({ bookId, username, token }) => (
	fetch('/book/wishlist/add', {
		method: 'put',
		body: JSON.stringify({ bookId, username }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)

export const removeFromWishList = ({ bookId, username, token }) => (
	fetch('/book/wishlist/remove', {
		method: 'put',
		body: JSON.stringify({ bookId, username }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)

export const tradeBook = ({ bookId, username, tradeType, token }) => (
	fetch('/book/trade/' + tradeType, {
		method: 'put',
		body: JSON.stringify({ bookId, username }),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}).then(res => res.json())
)
