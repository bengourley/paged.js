module.exports = Paged

var EventEmitter = require('events').EventEmitter
  , transitionFn = $.fn.transition ? 'transition' : 'animate'

/*
 * Make a tabbed list out of
 * the given element. Requires
 * a certain html structure.
 */
function Paged(container, sections, nofx) {
  this.container = container
  this.sections = sections
  this.current = null
  this.transitionSpeed = nofx ? 0 : 150
}

Paged.prototype = new EventEmitter()

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
  this.goTo(0)

  return this

}

/*
 * Go to tab number `index`
 */
Paged.prototype.goTo = function (index) {

  this.emit('change', index)

  if (this.current === index) return

  var self = this
    , section = this.sections.eq(index)
    , height = section.outerHeight(true)

  this.current = index

  this.sections.not(section)
    .css({ position: 'absolute' })
    [transitionFn]({ opacity: 0 }, this.transitionSpeed)

  setTimeout(function () {
    self.sections.each(function (i) {
      if (i !== self.current) $(this).css({ display: 'none'})
    })
  }, this.transitionSpeed)

  this.container[transitionFn]({ height: height }, 100)

  section.css({ opacity: 0, display: 'block' })
  section[transitionFn]({ opacity: 1 }, this.transitionSpeed)

  return this
}

/*
 * Reset the viewport height
 */
Paged.prototype.reset = function () {
  var section = this.sections.eq(this.current)
    , height = section.outerHeight(true)
  this.container.css({ height: height })
}