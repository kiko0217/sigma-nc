import axios from 'axios'

export default class ProductMappingService {

    getProductMappings() {
        return axios.get('assets/layout/data/product_mapping.json').then(res => res.data.Data);
    }
    getDataFromPdu(filename) {
        return axios.get('assets/layout/data/jsondata/pdu/' + filename).then(res => res.data.Sheet1)
    }
    getDataFromCombiPutra(filename) {
        return axios.get('assets/layout/data/jsondata/ptCombiPutra/' + filename).then(res => res.data.Penjualan)
    }
}