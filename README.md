# nightmare-jasmine [![Build Status][build]](https://circleci.com/gh/coatue/nightmare-jasmine) [![npm]](https://www.npmjs.com/package/nightmare-jasmine) [![apache2]](https://opensource.org/licenses/Apache-2.0)

> [Jasmine](https://github.com/jasmine/jasmine) wrapper for [Nightmare](https://github.com/segmentio/nightmare)

[build]: https://img.shields.io/circleci/project/coatue/nightmare-jasmine.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/nightmare-jasmine.svg?style=flat-square
[apache2]: https://img.shields.io/npm/l/nightmare-jasmine.svg?style=flat-square

## Installation

```sh
npm install --save-dev nightmare-jasmine
```

## Usage

```ts
import { Context as BaseContext, run } from 'nightmare-jasmine'

run({
  params: {
    username: 'foo'
  },
  specFiles: [
    './hooks/beforeAll.js',
    './hooks/beforeEach.js',
    './specs/*.js'
  ]
})
```

## API

```ts
run(options: Options)
  .then(() => console.log('Success!'))
  .catch(e => console.error('Error!', e))
```

`Options`:

| Name                | Type        | Required? | Description                        |
|---------------------|-------------|-----------|------------------------------------|
| `baseDir`           | `string`    | No        | Directory that spec files should be resolved relative to |
| `isDebug`           | `boolean`   | No        | Show browser?                      |
| `params`            | `Object`    | No        | Additional params to pass to tests |
| `specFiles`         | `string[]`  | Yes       | Glob array of spec files           |

## Example spec

```ts
describe('nightmare-jasmine', () => {
  it('should route to #/foo', async function(this: Context) {
    const url = await this.nightmare.wait('#myElement').evaluate(() => window.location.href)
    expect(url).toBe('http://localhost:4000/#/foo')
  })
})
```

## Usage notes

- If the process exits due to a Jasmine error, it will stay open for up to 30 secs (or whatever `nightmare.options.waitTimeout` is set to). This is because nightmare `.wait()` uses timeouts, which are not cleared when `.halt()` is called. (see https://github.com/segmentio/nightmare/issues/863)