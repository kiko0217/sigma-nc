import axios from 'axios'

export default class ReportService {

    getCountries() {
        return axios.get('assets/layout/data/report.json').then(res => res.data.data);
    }
}