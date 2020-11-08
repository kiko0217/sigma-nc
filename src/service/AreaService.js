import axios from 'axios'

export default class AreaService {

    getAreas() {
        return axios.get('assets/layout/data/area.json').then(res => res.data.Data);
    }
}