import { createServer } from 'http'
import { Context as BaseContext, run } from '../'
const getPort: {(): Promise<number>} = require('get-port')

export type Context = BaseContext<{
  credentials: {
    username: string
    password: string
  }
  port: number
}>

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
    run(`http://127.0.0.1:${port}`, {
      params: {
        credentials: {
          username: 'foo',
          password: 'bar'
        },
        port
      },
      isDebug: true,
      specFiles: [
        './test/hooks/beforeEach.js',
        './test/specs/spec.js'
      ]
    })
    .catch(() => {})
    .then(() => server.close())
  )
})
