import axios from 'axios'

export default class OutletService {

    getOutlets() {
        return axios.get('assets/layout/data/outlet.json').then(res => res.data.Data);
    }
}