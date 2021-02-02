import axios from 'axios';

export default class AchievementProductService {

    getAchievementProduct() {
        return axios.get('assets/layout/data/product_acv.json').then(res => res.data.response);
    }
    getAchievementProductVal() {
        return axios.get('assets/layout/data/product_acv_val.json').then(res => res.data.response);
    }
}
