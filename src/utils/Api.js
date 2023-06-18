class Api {
    constructor(config) {
        this._commonUrl = config.url;
        this._headers = config.headers;
    }
    _checkResponse(res) {
        if (res.ok) {
            return Promise.resolve(res.json());
        } else {
            return Promise.reject(res.status);
        }
    }

    getUser() {
        return fetch(`https://${this._commonUrl}/users/me`, {
            method: 'GET',
            headers: this._headers
        }).then(this._checkResponse);
    }

    getInitialCards() {
        return fetch(`https://mesto.${this._commonUrl}/cards`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    setUserInfo(data) {
        return fetch(`https://mesto.${this._commonUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse);
    }

    addCard(data) {
        return fetch(`https://mesto.${this._commonUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(data)
        })
            .then(this._checkResponse);
    }

    addPhotoLike(id) {
        return fetch(`https://mesto.${this._commonUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    deletePhotoLike(id) {
        return fetch(`https://mesto.${this._commonUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    changeLikeCardStatus(id, isLiked) {
        return fetch(`https://mesto.${this._commonUrl}/cards/${id}/likes`, {
            method: !isLiked ? "DELETE" : "PUT",
            headers: this._headers,
        }).then( this._checkResponse);
    }

    deleteCard(id) {
        return fetch(`https://mesto.${this._commonUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    setAvatar(data) {
        return fetch(`https://mesto.${this._commonUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify( data )
        })
            .then(this._checkResponse);
    }
}

const api = new Api({
    url: "nomoreparties.co/v1/cohort-64",
    headers: {
        'Content-Type': 'application/json',
        authorization: 'b3214215-bdfc-4688-a4e7-22854e57a120'
    }
})

export default api;