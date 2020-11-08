import axios from 'axios'

export default class SkemaDiscountService {

    getSkemaDiscounts() {
        return axios.get('assets/layout/data/skema_diskon.json').then(res => res.data.Data);
    }
}