const fs = require('fs')

const deleteFile = (filepath) => {
    fs.unlink(filepath, (err) => {
        if(err) {
           return console.log(err)
        }
    })
}

module.exports = deleteFile