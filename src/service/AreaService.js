import axios from 'axios'

export default class AreaService {

    getAreas() {
        return axios.get('http://34.66.31.229:3000/api/area').then(res => res.data.response);
    }
}