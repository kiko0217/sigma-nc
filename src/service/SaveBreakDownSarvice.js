import axios from 'axios'

export default class SaveBreakDownService {

    getSaveBreakdown() {
        return axios.get('/api/save-break-down').then(res => res.data.response);
    }
    createSaveBreakdown(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/save-break-down/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}