import axios from 'axios'

export default class OutletService {

    getOutlets() {
        return axios.get('/api/outlet').then(res => res.data.response);
    }
    getOutletMinis() {
        return axios.get('/api/outlet/mini').then(res => res.data.response);
    }
    createOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/outlet/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/outlet/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteOutlet(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/outlet/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    outletBreakdown(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/outlet/breakdown', data)
            .then(res => resolve(res.data.response ))
            .catch(err => reject(err))
        })
    }
}