import axios from 'axios'

export default class DetailerService {

    getDetailers() {
        return axios.get('/api/detailer/').then(res => res.data.response);
    }
    getDetailerMinis() {
        return axios.get('/api/detailer/mini').then(res => res.data.response);
    }
    createDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/detailer/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/detailer/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/detailer/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    getTotalDetailers() {
        return axios.get('/api/detailer/total').then(res => res.data.response);
    }
}