import axios from 'axios'

export default class DetailerService {

    getDetailers() {
        return axios.get('http://34.66.31.229:3000/api/detailer/').then(res => res.data.response);
    }
}