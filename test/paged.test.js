require('./test-env')

var Paged = require('..')
  , assert = require('assert')
  , EventEmitter = require('events').EventEmitter

describe('paged', function () {

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
      paged.goTo(2, true)
    })

    it('should do no work on invalid input', function () {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.init()
      paged.on('change', function (i) {
        assert(false)
      })
      paged.goTo(10, true)
      paged.goTo(-21, true)
      paged.goTo(3, true)
    })

  })

  describe('next()', function () {

    it('should go to the next page', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.init()
      paged.on('change', function (i) {
        assert.equal(i, 1)
        done()
      })
      paged.next()
    })

    it('should loop back to the start if the loop option is set', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.loop = true
      paged.init()
      paged.goTo(paged.sections.length - 1)
      paged.on('change', function (i) {
        assert.equal(i, 0)
        done()
      })
      paged.next()
    })

    it('should not loop if loop options is set to false', function () {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.loop = false
      paged.init()
      paged.goTo(paged.sections.length - 1)
      paged.on('change', function (i) {
        assert(false)
      })
      paged.next()
    })

  })

  describe('prev()', function () {
    it('should go to the previous page', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.init()
      paged.goTo(2)
      paged.on('change', function (i) {
        assert.equal(i, 1)
        done()
      })
      paged.prev()
    })

    it('should loop back to the end if the loop option is set', function (done) {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.loop = true
      paged.init()
      paged.on('change', function (i) {
        assert.equal(i, paged.sections.length - 1)
        done()
      })
      paged.prev()
    })

    it('should not loop if loop option is set to false', function () {
      var paged = new Paged($('.js-tabbed-widget'), $('.js-tabs').children(), true)
      paged.loop = false
      paged.init()
      paged.on('change', function (i) {
        assert(false)
      })
      paged.prev()
    })
  })

})