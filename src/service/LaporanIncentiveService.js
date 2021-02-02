import axios from 'axios';

export default class LaporanIncentiveService {
    getLaporanIncentive() {
        return axios.get('assets/layout/data/incentive.json').then(res => res.data.response);
    }
}
