import axios from 'axios'

export default class DetailerService {

    getDetailers() {
        return axios.get('http://34.66.31.229:3000/api/detailer/').then(res => res.data.response);
    }
    getDetailerMinis() {
        return axios.get('http://34.66.31.229:3000/api/detailer/mini').then(res => res.data.response);
    }
    createDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/detailer/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/detailer/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteDetailer(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/detailer/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    getTotalDetailers() {
        return axios.get('http://34.66.31.229:3000/api/detailer/total').then(res => res.data.response);
    }
}