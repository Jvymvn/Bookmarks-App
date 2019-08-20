const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks')
    },
    getById(knex, id) {
        return knex.from('bookmarks').select('*').where('id', id).first()
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks')
            //to chain the operations
            .returning('*')
            .then(row => {
                return row[0]
            })
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks')
            .where({ id })
            .delete()
    },
    updateBookmark(knex, id, newArticleFeilds) {
        return knex('bookmarks')
            .where({ id })
            .update(newArticleFeilds)
    }
}

module.exports = BookmarksService