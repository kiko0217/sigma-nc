import axios from 'axios'

export default class AreaService {

    getAreas() {
        return axios.get('/api/area').then(res => res.data.response);
    }
    getAreaMinis() {
        return axios.get('/api/area/mini').then(res => res.data.response);
    }
    createArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/area/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/area/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteArea(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/area/destroy', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    getAreaAchievement(data) {
        return new Promise((resolve, reject) => {
            axios.get('/api/area/achievement',{params: data})
            .then(res => resolve(res.data.response))
            .catch(err => reject(err))
        })
    }
}