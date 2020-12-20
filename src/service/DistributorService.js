import axios from 'axios'

export default class DistributorService {

    getDistributors() {
        return axios.get('http://34.66.31.229:3000/api/distributor').then(res => res.data.response);
    }
    createDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/distributor/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/distributor/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteDistributor(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/distributor/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}