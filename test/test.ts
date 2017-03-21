import { createServer } from 'http'
import { resolve } from 'path'
import { Context as BaseContext, run } from '../'
const getPort: {(): Promise<number>} = require('get-port')

export type Context = BaseContext<{
  baseURL: string
  credentials: {
    username: string
    password: string
  }
  port: number
}>

const specFiles = [
  './hooks/beforeEach.js',
  './specs/spec.js'
]
.map(_ => resolve(__dirname, _))

getPort().then(port => {

  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          Hello world! ${req.url}
        </body>
      </html>
    `)
    res.end()
  }).listen(port, () =>
    run({
      isDebug: true,
      params: {
        baseURL: `http://127.0.0.1:${port}`,
        credentials: {
          username: 'foo',
          password: 'bar'
        },
        port
      },
      specFiles
    })
    .catch(e => { throw e })
    .then(() => server.close())
  )
})
.catch(e => { throw e })
