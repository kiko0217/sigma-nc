import axios from 'axios'

export default class RegionService {

    getRegions() {
        return axios.get('/api/region').then(res => res.data.response);
    }
    getRegionMinis() {
        return axios.get('/api/region/mini').then(res => res.data.response);
    }
    createRegion(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/region/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editRegion(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/region/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteRegion(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/region/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}