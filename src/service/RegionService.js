import axios from 'axios'

export default class RegionService {

    getRegions() {
        return axios.get('assets/layout/data/region.json').then(res => res.data.Data);
    }
}