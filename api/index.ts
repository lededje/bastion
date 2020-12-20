import app from './app'

const port = 3000;

app.listen(port, () => {
  console.log(`Bastion is listening on http://localhost:${port}`)
})