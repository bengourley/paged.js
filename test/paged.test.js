require('./test-env')

var Paged = require('..')
  , assert = require('assert')
  , EventEmitter = require('events').EventEmitter

describe('modal', function () {

  afterEach(function () {
    $('body').html(
      [ '<div class="js-tabbed-widget">'
      , '  <div class="js-tabs">'
      , '    <div>'
      , '      <h1>Page 1</h1>'
      , '      <p>This is page one!</p>'
      , '    </div>'
      , '    <div>'
      , '      <h1>Page 2</h1>'
      , '      <p>This is page two!</p>'
      , '    </div>'
      , '    <div>'
      , '      <h1>Page 3</h1>'
      , '      <p>This is page three!</p>'
      , '    </div>'
      , '  </div>'
      , '</div>'
      ].join('\n'))
  })

  describe('Paged()', function () {

    it('should be a function', function () {
      assert.equal(typeof Paged, 'function')
    })

    it('should inherit from event emitter', function () {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children())
      assert(paged instanceof Paged)
      assert(paged instanceof EventEmitter)
      assert.equal(typeof paged.on, 'function')
      assert.equal(typeof paged.emit, 'function')
      assert.equal(typeof paged.removeListener, 'function')
      assert.equal(typeof paged.once, 'function')
    })

  })

  describe('init()', function () {

    it('should hide all sections except the first', function () {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.init()
      var display = [ 'block', 'none', 'none' ]
      $('.js-tabs').children().each(function (i) {
        assert.equal($(this).css('display'), display[i])
      })
    })

    it('should emit a change event', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.on('change', function (i) {
        assert.equal(i, 0)
        done()
      })
      paged.init()
    })

  })

  describe('goTo()', function () {

    it('should show the ith page and hide the others', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.init()
      paged.on('change', function (i) {
        setTimeout(function () {
          assert.equal(i, 2)
          var display = [ 'none', 'none', 'block' ]
          $('.js-tabs').children().each(function (i) {
            assert.equal($(this).css('display'), display[i])
          })
          done()
        }, 0)
      })
      paged.goTo(2)
    })

  })

})