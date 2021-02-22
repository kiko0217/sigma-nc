import axios from 'axios'

export default class UserService {

    getProfile() {
        return new Promise((resolve, reject) => {
            axios.get('/api/user/profile')
            .then(res => resolve(res.data.response))
            .catch(err => reject(err))
        })
    }

}