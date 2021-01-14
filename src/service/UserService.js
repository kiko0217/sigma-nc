import axios from 'axios'

export default class UserService {

    getProfile() {
        return new Promise((resolve, reject) => {
            axios.get('http://34.66.31.229:3000/api/user/profile')
            .then(res => resolve(res.data.response))
            .catch(err => reject(err))
        })
    }

}