import axios from 'axios'

export default class ReportService {

    getReport() {
        return axios.get('assets/layout/data/report.json').then(res => res.data.Data);
    }
}