import axios from 'axios'

export default class OutletService {

    getOutlets() {
        return axios.get('http://34.66.31.229:3000/api/outlet').then(res => res.data.response);
    }
    getOutletMinis() {
        return axios.get('http://34.66.31.229:3000/api/outlet/mini').then(res => res.data.response);
    }
    createOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/outlet/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/outlet/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/outlet/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}