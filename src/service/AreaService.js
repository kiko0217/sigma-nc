import axios from 'axios'

export default class AreaService {

    getAreas() {
        return axios.get('assets/layout/data/data_1.json').then(res => res.data.Area);
    }
}