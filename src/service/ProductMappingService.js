import axios from 'axios'

export default class ProductMappingService {

    getProductMappings() {
        return axios.get('assets/layout/data/product_mapping.json').then(res => res.data.Data);
    }
}