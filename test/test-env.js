var jsdom = require('jsdom')

global.window = jsdom.jsdom().createWindow('<html><body></body></html>')

global.window.jQuery = global.jQuery = global.$ = require('jquery').create(window)
global.document = window.document

global.addEventListener = window.addEventListener
