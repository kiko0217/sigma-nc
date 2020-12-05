import axios from 'axios'

export default class DistributorService {

    getDistributors() {
        return axios.get('http://34.66.31.229:3000/api/distributor').then(res => res.data.response);
    }
}