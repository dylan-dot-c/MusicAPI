// define return templates for different requests

const getResponse = {
    status: null,
    msg: null,
    count: null,
    pagination: {
        pageSize: null,
        totalPages: null,
        currentPage: null,
        nextPage: null,
        previousPage: null,
        totalRows: null
    },
    data: null,
    err: null,
}

// post request Response template

const postResponse = {
     status: null,
     msg: null,
     count: null,
     id: null,
     err: null,
}

const deleteResponse = {
    status: null,
    msg: null,
    count: null,
    err: null,
}

module.exports = {postResponse, getResponse, deleteResponse}