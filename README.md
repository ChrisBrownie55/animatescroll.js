# animatescroll.js
A javascript function that allows for programmatic cubic-bezier style scrolling to elements

To use this code, you will have to include the files: **animate-scroll.js** and **bezier-easing.js** inside a script tag like so.
```
<script src='bezier-easing.js'></script>
<script src='animate-scroll.js'></script>
```
Then when you want to use it you simply do:
```
document.querySelector( 'button.btn-classname' ).smoothScrollIntoView( 'easeInOutExpo', 1500, 'start' )
```
