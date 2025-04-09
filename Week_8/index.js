const express = require('express')
const app = express()
const port = 3001

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {title:'Home'})
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
});