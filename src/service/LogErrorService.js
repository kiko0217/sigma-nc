import axios from 'axios'

export default class LogErrorService {

    getLogError() {
        return axios.get('/api/log-error').then(res => res.data.response);
    }
}