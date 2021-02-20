import axios from 'axios'

export default class BreakDownService {
    postBreakDownTanggal(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/break-down/base-tanggal/', data)
            .then(res => resolve(res.data.response ))
            .catch(err => reject(err))
        })
    }
}