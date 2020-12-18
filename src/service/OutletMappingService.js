import axios from 'axios'

export default class OuletMappingService {
    getOutletMapping() {
        return axios.get('http://34.66.31.229:3000/api/outlet-map').then(res => res.data.response)
    }
    editcodeNf(data) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/outlet-map/update-outlet-map',{
                outletMapId: data._id,
                outletCode: data.nfCode
            })
            .then(res => {
                resolve(res.data.message)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }
    deleteOutletMapping(dataId) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.get('http://34.66.31.229:3000/api/outlet-map/delete/'+dataId)
            .then(res => {
                resolve(res.data.message)
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}