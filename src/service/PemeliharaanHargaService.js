import axios from 'axios'

export default class PemeliharaanHargaService {

    getPemeliharaanHargas() {
        return axios.get('http://34.66.31.229:3000/api/pemeliharaan-harga').then(res => res.data.response)
    }
    createPemeliharaanHarga(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/pemeliharaan-harga/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editPemeliharaanHarga(data) {
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/pemeliharaan-harga/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}