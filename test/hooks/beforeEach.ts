import { Context } from '../test'

beforeEach(function(this: Context) {
  this.nightmare.goto(this.params.baseURL)
})
