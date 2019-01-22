import decode from 'jwt-decode';

class AuthService {
    // Initializing important variables
    constructor() {
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(email, password) {
        // Get a token from api server using the fetch api
        return this.fetch(`/api/login/leoid`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            console.log(res);
            this.setToken(res.token) // Setting the token in localStorage
            return Promise.resolve(res);
        }).catch(err => {
            console.log(err)
            return Promise.reject(err);
        });
    }

    isLoggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return token // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('token', idToken)
    }

    getToken() {
        if (!this.isTokenExpired(localStorage.getItem('token'))) {
            // Retrieves the user token from localStorage
            return localStorage.getItem('token')
        }
        else {
            localStorage.removeItem('token');
            return null;
        }
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.isLoggedIn()) {
            headers['authorization'] = this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}

export default AuthService;