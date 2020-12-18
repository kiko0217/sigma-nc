import axios from 'axios'

export default class BreakDownService {
    postBreakDownTanggal(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/break-down/base-tanggal/', data)
            .then(res => resolve(res.data.response ))
            .catch(err => reject(err))
        })
    }
}