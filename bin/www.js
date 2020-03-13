const app = require('../src/app')
const config = require('../src/config/index')
const port = process.env.PORT || config.port


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
