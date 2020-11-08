import axios from 'axios'

export default class PemeliharaanHargaService {

    getPemeliharaanHargas() {
        return axios.get('assets/layout/data/pemeliharaan_harga.json').then(res => res.data.Data);
    }
}