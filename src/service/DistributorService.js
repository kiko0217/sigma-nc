import axios from 'axios'

export default class DistributorService {

    getDistributors() {
        return axios.get('/api/distributor').then(res => res.data.response);
    }
    createDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/distributor/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/distributor/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/distributor/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}