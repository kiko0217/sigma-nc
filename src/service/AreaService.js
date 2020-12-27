import axios from 'axios'

export default class AreaService {

    getAreas() {
        return axios.get('http://34.66.31.229:3000/api/area').then(res => res.data.response);
    }
    getAreaMinis() {
        return axios.get('http://34.66.31.229:3000/api/area/mini').then(res => res.data.response);
    }
    createArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/area/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/area/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/area/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}