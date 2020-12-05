import axios from 'axios'

export default class RegionService {

    getRegions() {
        return axios.get('http://34.66.31.229:3000/api/region').then(res => res.data.response);
    }
}