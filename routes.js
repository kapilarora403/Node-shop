const fs = require('fs')

const requestHandler = (req, res) => {
const url = req.url
    const method = req.method
    if(url === '/') {
        res.write('<html>')
        res.write('<head><title>Enter Message</title></head>')
        res.write('<body>')
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="Submit">Send</button>')
        return res.end()
    }
    if(url === '/message' && method === 'POST') {
        const body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        })
        

        return req.on('end', () =>{
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split('=')[1]
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()


            })
            
        })
        
        

    }
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>My first page</title></head>')
    res.write('<body>Hello!</body>')
    res.write('</html>')
    res.end()
}

module.exports = requestHandler

//module.exports = { handler: requestHandler, text: 'Some Text'}

//module.exports.handler = requestHandler
//module.exports.text = 'Some Text'

//exports.handler = requestHandler
//exports.text = 'Some Text'