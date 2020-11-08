import axios from 'axios'

export default class DetailerService {

    getDetailers() {
        return axios.get('assets/layout/data/detailer.json').then(res => res.data.Data);
    }
}