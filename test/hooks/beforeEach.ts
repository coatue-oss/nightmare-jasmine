import { Context } from '../test'

beforeEach(function(this: Context) {
  this.nightmare.goto(`http://127.0.0.1:${this.params.port}`)
})
