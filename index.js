"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Nightmare = require('nightmare');
const objectid = require('objectid'); // TODO: type
const Jasmine = require('jasmine');
function run(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // create jasmine instance
        const jasmine = new Jasmine({
            projectBaseDir: options.baseDir || '/'
        });
        // support async tests
        require('jasmine-co').install();
        // create nightmare instance
        const nightmare = createNightmare(objectid(), options);
        // configure jasmine
        jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = nightmare.options.waitTimeout;
        jasmine.loadConfig({
            spec_files: options.specFiles
        });
        // expose nightmare instance and options to tests
        beforeAll(function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.nightmare = nightmare;
                this.params = options.params || {};
            });
        });
        // run our tests
        return new Promise((resolve, reject) => {
            jasmine.onComplete((passed) => {
                nightmare.halt();
                passed ? resolve() : reject();
            });
            jasmine.execute();
        });
    });
}
exports.run = run;
/**
 * Takes an ID that is shared across tests in a suite, so we can,
 * for example, log in once and reuse the login between tests.
 */
function createNightmare(partitionId, options) {
    // TODO: fix typings in DefinitelyTyped
    return new Nightmare({
        show: options.isDebug,
        switches: {
            'disable-renderer-backgrounding': true
        },
        typeInterval: 20,
        webPreferences: {
            partition: partitionId
        }
    })
        .header('X-IS-TEST-RUNNER', 'true')
        .on('console', (type, input, message) => console[type]('[console]', input, message));
}
//# sourceMappingURL=index.js.map