import axios from 'axios'

export default class OutletService {

    getOutlets() {
        return axios.get('http://34.66.31.229:3000/api/outlet').then(res => res.data.response);
    }
}