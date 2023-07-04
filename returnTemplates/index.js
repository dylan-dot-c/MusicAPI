// define return templates for different requests

const getReturn = {
    status: null,
    msg: null,
    count: null,
    data: null,
    err: null,
}

// post request return template

const postReturn = {
     status: null,
     msg: null,
     count: null,
     id: null,
     err: null,
}

const deleteReturn = {
    status: null,
    msg: null,
    count: null,
    err: null,
}

module.exports = {postReturn, getReturn, deleteReturn}