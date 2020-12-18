import axios from 'axios'
import saveAs from 'js-file-download'

export default class ProductMappingService {
    getDataFromEmail(){
        return axios.get('http://34.66.31.229:3000/api/temp').then(res => res.data.response)
    }
    downloadFile(name, subject){
        return axios.post('http://34.66.31.229:3000/download',
            {
                name,
                subject
            },
            {
                responseType: 'blob'
            }
            // responseType: 'blob', // important
        ).then(res => saveAs(res.data, name))
    }
    getJsonMapping(tempId){
        return axios.get('http://34.66.31.229:3000/api/convert/unmapping/'+tempId).then(res => res.data)
    }
    getProductMapping(){
        return axios.get('http://34.66.31.229:3000/api/product-map').then(res => res.data.response)
    }
    mapping(tempId){
        return axios.get('http://34.66.31.229:3000/api/product-map/manual/'+tempId).then(res => res.data.message)
    }
    postEdit(productMap){
        // console.log(productMap)
        return new Promise((resolve, reject) => {
            axios.post('http://34.66.31.229:3000/api/product-map/edit/'+productMap._id, productMap)
            .then(res => resolve(res.data.message))
            .catch(err => reject(err))
        })
    }
    deleteProductMapping(dataId) {
        // console.log(data)
        return new Promise((resolve, reject) => {
            axios.get('http://34.66.31.229:3000/api/product-map/delete/'+dataId)
            .then(res => {
                resolve(res.data.message)
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}