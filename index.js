const express = require('express')
const app = express()

// Application code
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})