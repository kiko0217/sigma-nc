import axios from 'axios';

export default class AchievementProductService {
    getAchievementArea() {
        return axios.get('assets/layout/data/area_acv.json').then(res => res.data.response);
    }
}
