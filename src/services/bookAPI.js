import axios from "../utils/axios-customize"


export const callFetchBook = (query) => {
    const URL_BACKEND = `/api/v1/book?${query}`    
    return axios.get(URL_BACKEND)
}

export const deleteBookAPI = (_id) => { 
    const URL_BACKEND = `/api/v1/book/${_id}`
    return axios.delete(URL_BACKEND)
}

export const callFetchBookById = (id) => {
    return axios.get(`api/v1/book/${id}`)
}


export const callFetchCategory = () => { 
    const URL_BACKEND = `/api/v1/database/category`
    return axios.get(URL_BACKEND)
}

export const callCreateBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.post('/api/v1/book', {
        thumbnail, slider, mainText, author, price, sold, quantity, category
    })
}

export const updateBookAPI = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    
    const URL_BACKEND = `/api/v1/book/${id}`
    const data = {
        id, thumbnail, slider, mainText, author, price, sold, quantity, category
    }
    return axios.put(URL_BACKEND, data)
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}
