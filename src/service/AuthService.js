import axios from 'axios'

export default class AuthService {
    register(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/auth/register', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    login(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/auth/login', data)
            .then(res => {
                if(res.data.stt === true) {
                    console.log(res.data)
                    let token = 'Bearer '+ res.data.token
                    localStorage.setItem('token', token)
                    axios.defaults.headers.common.Authorization = token
                    resolve(res.data.message)
                } else {
                    reject(res.data.message)
                }
                
            })
            .catch(err => reject(err))
        })
    }
    logout() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('token')
                delete axios.defaults.headers.common.Authorization
                resolve('success logout')
            } catch (error) {
                reject(error)
            }
        })
    }
}