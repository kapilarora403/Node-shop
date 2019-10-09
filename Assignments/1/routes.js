const reqHandler = (req, res) => {
    const method = req.method
    const url = req.url
    if(url === '/') {
        res.write('<html>')
        res.write('<body><h1>Hello!</h1>')
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="Submit">Send</button>')
        res.write('</body>')
    }
    if(url === '/create-user' && method === 'POST') {
        const body = []
        req.on('data', (chunks) => {
            body.push(chunks)
        })

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody.split('=')[1])
            res.statusCode = 302
            res.setHeader('Location', '/')
            return res.end()
        })
    }
    res.end()
}

module.exports = reqHandler