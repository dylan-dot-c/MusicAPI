

const defineWhereClause = (query) => {
    // function to get a defined query based on request querys
    const {artist, genre} = query

    const whereClause = {}

    if(artist) {
        whereClause.artist = artist
    }

    if(genre) {
        whereClause.genre = genre
    }

    return whereClause
}

const definePagination = (limit, page, rowCount) => {

    var pageSize = parseInt(limit) || 5
    var totalPages = Math.ceil(rowCount / pageSize)
    var currentPage = Math.abs(page)
    var nextPage = (totalPages > currentPage) ? currentPage + 1 : null
    var previousPage = (currentPage == 1) ? null : currentPage - 1
    var totalRows = rowCount

    return {pageSize, totalPages, currentPage, nextPage, previousPage, totalRows}
}


module.exports = {definePagination, defineWhereClause}