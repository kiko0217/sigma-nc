import axios from 'axios'

export default class DistributorService {

    getDistributors() {
        return axios.get('assets/layout/data/distributor.json').then(res => res.data.Data);
    }
}