import axios from 'axios'

export default class OutletDistributorService {

    getOutletDistributors() {
        return axios.get('assets/layout/data/outlet_distributor.json').then(res => res.data.Data);
    }
}