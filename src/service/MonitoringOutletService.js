import axios from 'axios';

export default class MonitoringOutletService {
    getMonitoringOutlet() {
        return axios.get('assets/layout/data/mon_out.json').then(res => res.data.response);
    }
}
