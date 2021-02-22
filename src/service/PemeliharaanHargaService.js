import axios from 'axios'

export default class PemeliharaanHargaService {

    getPemeliharaanHargas() {
        return axios.get('/api/pemeliharaan-harga').then(res => res.data.response)
    }
    createPemeliharaanHarga(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/pemeliharaan-harga/create', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    editPemeliharaanHarga(data) {
        return new Promise((resolve, reject) => {
            axios.post('/api/pemeliharaan-harga/edit', data)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
}