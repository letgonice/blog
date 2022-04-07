let express = require('express')
let app = express()
let path = require('path')
let router = require('./router/router.js')
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(router)

app.listen(3400,() => {
    console.log('listen to 3400');
})