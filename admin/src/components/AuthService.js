import decode from 'jwt-decode';
import { api } from "config.json"

const AuthService = {
    isLoggedIn: () => AuthService.getToken() !== null,

    isTokenExpired: token => {
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
    },

    setToken: idToken => {
        // Saves user token to localStorage
        localStorage.setItem('adminToken', idToken)
    },

    getToken: () => {
        if (!AuthService.isTokenExpired(localStorage.getItem('adminToken'))) {
            return localStorage.getItem('adminToken')
        }
        else {
            localStorage.removeItem('adminToken');
            return null;
        }
    },

    getUser: () => {
        return new Promise((resolve, reject) => {
            if (AuthService.isLoggedIn()) {
                AuthService.fetch('/api/user/me')
                    .then(res => res.json())
                    .then(resolve)
                    .catch(reject);
            }
        });
    },

    logout: () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('token');
    },

    fetch: (url, options) => {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (AuthService.isLoggedIn()) {
            headers['Authorization'] = AuthService.getToken()
        }

        return fetch(url, {
            ...options,
            headers
        });
    },

    isAdmin: () => {
        return AuthService
            .fetch(api.host + ":" + api.port + "/api/user/isAdmin")
            .then(res => res.json());
    }
}

export default AuthService;