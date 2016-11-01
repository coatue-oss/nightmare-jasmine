import * as Nightmare from 'nightmare'
const objectid: { (): string } = require('objectid') // TODO: type
const Jasmine = require('jasmine')

export interface Context<T extends Object> {
  params: T
  nightmare: Nightmare
}

export interface Options<T extends Object> {
  baseDir?: string
  baseURL?: string
  isDebug?: boolean
  params?: T
  specFiles: string[]
}

export async function run<T extends Object>(options: Options<T>) {

  // create jasmine instance
  const jasmine = new Jasmine({
    projectBaseDir: options.baseDir || '/'
  })

  // support async tests
  require('jasmine-co').install()

  // create nightmare instance
  const nightmare = createNightmare(objectid(), options)

  // configure jasmine
  jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = (nightmare as any).options.waitTimeout
  jasmine.loadConfig({
    spec_files: options.specFiles
  })

  // expose nightmare instance and options to tests
  beforeAll(async function(this: Context<T>) {
    this.nightmare = nightmare
    this.params = options.params || {} as T
  })

  // run our tests
  return new Promise((resolve, reject) => {
    jasmine.onComplete((passed: boolean) => {
      (nightmare as any).halt()
      passed ? resolve() : reject()
    })
    jasmine.execute()
  })
}

/**
 * Takes an ID that is shared across tests in a suite, so we can,
 * for example, log in once and reuse the login between tests.
 */
function createNightmare<T>(partitionId: string, options: Options<T>): Nightmare {

  // TODO: fix typings in DefinitelyTyped
  return new (Nightmare as any)({
    show: options.isDebug,
    switches: {
      'disable-renderer-backgrounding': true
    },
    typeInterval: 20,
    webPreferences: {
      partition: partitionId
    }
  })

  // set header for logging
  .header('X-IS-TEST-RUNNER', 'true')

  // pipe console logs to terminal stdout
  .on('console', (type: 'error' | 'log' | 'warn', input: any, message: string) =>
    (console as any)[type]('[console]', input, message)
  )
}
