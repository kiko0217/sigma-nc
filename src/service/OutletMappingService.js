import axios from 'axios'

export default class OuletMappingService {
    getOutletMapping() {
        return axios.get('http://34.66.31.229:3000/api/outlet-map').then(res => res.data.response)
    }
}