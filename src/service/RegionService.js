import axios from 'axios'

export default class RegionService {

    getRegions() {
        return axios.get('assets/layout/data/data_1.json').then(res => res.data.Region);
    }
}