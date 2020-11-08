import axios from 'axios'

export default class SelesCoverService {

    getSelesCovers() {
        return axios.get('assets/layout/data/seles_cover.json').then(res => res.data.Data);
    }
}