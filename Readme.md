# Paged

A module for handling paged/tabbed content.

```
npm install paged
```

### Usage

#### var paged = new Paged(container, sections)

- `container` is a jQuery element that contains your sections
- `sections` is a jQuery set of elements that are the pages/tabs you want to show one at a time


#### paged.goTo(i)

Show the `i`th section

#### paged.reset()

Resets the height of the parent element (useful when the elements change size at different breakpoints)

### Example

First, create some HTML like this:

```html
<div class="js-tabbed-widget">
  <div class="js-tabs">
    <div>
      <h1>Page 1</h1>
      <p>This is page one!</p>
    </div>
    <div>
      <h1>Page 2</h1>
      <p>This is page two!</p>
    </div>
    <div>
      <h1>Page 3</h1>
      <p>This is page three!</p>
    </div>
  </div>
</div>
```

```js
var Paged = require('paged')
  , tabbedWidget = new Paged($('.js-tabbed-widget'), $('.js-tabs').children())

// Init to hide the sections and go to the first tab/page
tabbedWidget.init()

// Paged objects inherit from node's EventEmitter class
tabbedWidget.on('change', function (i) {
  console.log('Page #' + i + ' is now in view')
})

// Show the third tab
tabbedWidet.goTo(2)
```