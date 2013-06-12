module.exports = Paged

var EventEmitter = require('events').EventEmitter
  , inherits = require('inherits')
  , transitionFn = $.fn.transition ? 'transition' : 'animate'

/*
 * Make a tabbed list out of
 * the given element. Requires
 * a certain html structure.
 */
function Paged(container, sections, nofx) {
  EventEmitter.call(this)
  this.container = container
  this.sections = sections
  this.current = null
  this.transitionSpeed = nofx ? 0 : 150
  this.loop = true
}

inherits(Paged, EventEmitter)

/*
 * Set required styles and
 * go to the first tabbed pane
 */
Paged.prototype.init = function () {

  this.container.css({ position: 'relative' })
  this.sections.css(
    { display: 'none'
    , opacity: 0
    , position: 'absolute'
    })
  this.goTo(0, true)

  return this

}

/*
 * Go to tab number `index`
 */
Paged.prototype.goTo = function (index, nofx) {

  // Do no work on invalid input
  if (index < 0 || index >= this.sections.length) return

  this.emit('change', index)

  if (this.current === index) return

  var section = this.sections.eq(index)
    , height = section.outerHeight(true)

  this.current = index

  if (this.transitionSpeed > 0 && !nofx) {

    this.sections.not(section)
      .css({ position: 'absolute' })
      [transitionFn]({ opacity: 0 }, this.transitionSpeed)

    setTimeout($.proxy(function () {
      this.sections.each($.proxy(function (i, el) {
        if (i !== this.current) $(el).css({ display: 'none' })
      }, this))
    }, this), this.transitionSpeed)

    this.container[transitionFn]({ height: height }, 100)

    section.css({ opacity: 0, display: 'block' })
    section[transitionFn]({ opacity: 1 }, this.transitionSpeed)

  } else {

    this.sections.not(section).css({ position: 'absolute', display: 'none' })
    section.css({ opacity: 1, display: 'block' })
    this.container.css({ height: height })

  }

  return this
}

/*
 * Convenience method for moving to the next section.
 * Adds loop functionality if `this.loop` is true.
 */
Paged.prototype.next = function () {
  if (this.current === this.sections.length - 1) {
    if (this.loop) {
      return this.goTo(0)
    } else {
      return
    }
  }
  return this.goTo(this.current + 1)
}

/*
 * Convenience method for moving to the previous section.
 * Adds loop functionality if `this.loop` is true.
 */
Paged.prototype.prev = function () {
  if (this.current === 0) {
    if (this.loop) {
      return this.goTo(this.sections.length - 1)
    } else {
      return
    }
  }
  return this.goTo(this.current - 1)
}

/*
 * Reset the viewport height
 */
Paged.prototype.reset = function () {
  var section = this.sections.eq(this.current)
    , height = section.outerHeight(true)
  this.container.css({ height: height })
}