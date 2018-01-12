/*
 * https://github.com/ChrisBrownie55/animatescroll.js
 * animatescroll.js - use bezier curve to animate scrolling
 * requires bezier-easing.js from https://github.com/gre/bezier-easing
 * by Christopher Brown 2018 – MIT License
 */


// MAKE A PULL REQUEST FOR MORE EASING FUNCTIONS
const easingFunctions = {
  linear: [ 0, 0, 1, 1 ],
  ease: [ .25, .1, .25, 1 ],
  easeIn: [ .42, 0, 1, 1 ],
  easeOut: [ 0,0,.58,1 ],
  easeInOut: [ .42, 0, .58, 1 ],
  easeInExpo: [ 0.95, 0.05, 0.795, 0.035 ],
  easeOutExpo: [ 0.19, 1, 0.22, 1 ],
  easeInOutExpo: [ .99,.08,.14,.97 ]
}

class ValueError extends Error {
  constructor( ...params ) {
    super( ...params )
    
    this.name = 'ValueError'
    
    if ( Error.captureStackTrace )
      Error.captureStackTrace( this, ValueError )
  }
}

function preventEvent( event ) {
  event.preventDefault()
  event.returnValue = false
  return false
}

window.disableScroll = function() {
  window.addEventListener( 'scroll', preventEvent )
  window.addEventListener( 'wheel', preventEvent )
  window.addEventListener( 'touchmove', preventEvent )
}

window.enableScroll = function() {
  window.removeEventListener( 'scroll', preventEvent )
  window.removeEventListener( 'wheel', preventEvent )
  window.removeEventListener( 'touchmove', preventEvent )
}

window.smoothScrollTo = function( x=0, y=0, easing=easingFunctions.linear, duration=250 ) {
  /* x: type:Number
   * y: type:Number
   * easing: type:String or type:Array( Float ) length:4
   * block: type:String
   */
  
  // Check x
  if ( typeof x !== 'number' )
    throw TypeError( `x is of type: ${ typeof x }; it should be of type: number` )
  if ( x > document.body.clientWidth )
    // x is past full width
    x = document.body.clientWidth - window.innerWidth
  else if ( x + window.innerWidth > document.body.clientWidth  )
    // x is less than a screens length away from the end of the document
    x -= ( window.innerWidth - ( document.body.clientWidth - x ) )
  
  // Check y
  if ( typeof y !== 'number' )
    throw TypeError( `y is of type: ${ typeof y }; it should be of type: number` )
  if (y > document.body.clientHeight )
    // y is past full height
    y = document.body.clientHeight - window.innerHeight
  else if ( y + window.innerHeight > document.body.clientHeight )
    // y is less than a screens length away from the end of the document
    y -= ( window.innerHeight - ( document.body.clientHeight - y ) )
  
  // Check easing
  if ( typeof easing !== 'string' && !( easing instanceof Array ) )
    throw TypeError( `easing is of type: ${ typeof easing }; it should be of type: string or array` )
  if ( typeof easing === 'string' ) {
    /* get easing function corresponding to string */
    let easingFunction = easingFunctions[ easing ]
    if ( easingFunction === undefined )
      throw new ValueError( `${ easing } is not an easing function` )
    easing = easingFunction
  } else if ( easing.length !== 4 ) {
    throw new ValueError( `easing requires 4 values not ${ easing.length }`)
  }
  
  // Check duration
  if ( typeof duration !== 'number' )
    throw TypeError( `duration is of type: ${ typeof duration}; it should be of type: number` )
  
  // Stop user from scrolling
  window.disableScroll()
  
  // Run animation loop every 1/60 of a second
  const startTime = new Date()
  const easingFunc = bezier( ...easing ),
        startX = window.scrollX,
        startY = window.scrollY,
        loop = setInterval( () => {
          let elapsed = new Date() - startTime
          
          if ( elapsed >= duration ) {
            window.scrollTo( x, y )
            clearInterval( loop )
            window.enableScroll()
            return
          }
          
          const timePercentage = elapsed / duration,
                scrollPercentage = easingFunc( timePercentage )
          
          window.scrollTo(
            startX + ( ( x - startX ) * scrollPercentage ),
            startY + ( ( y - startY ) * scrollPercentage )
          )
        }, ( 1 / 60 ) * 1000 )
}

Object.defineProperty( HTMLElement.prototype, 'smoothScrollIntoView', {
  value: function ( easing, duration, block = 'center' ) {
    /* easing: type:String or type:Array( Float ) length:4
     * duration: type:Number; duration is in milliseconds
     * block: type:String
     */
    
    // Check block
    if ( typeof block !== 'string' )
      throw TypeError( `block is of type: ${ typeof block }; it should be of type: string` )
    
    let rect = this.getBoundingClientRect(),
        y,
        x
    if ( block === 'start' ) {
      y = window.scrollY + rect.y
      x = window.scrollX + rect.x
    } else if ( block === 'center' ) {
      y = window.scrollY + rect.y - ( rect.height / 2 )
      x = window.scrollX + rect.x - ( rect.width / 2 )
    } else if ( block === 'end' ) {
      y = window.scrollY + rect.y - rect.height
      x = window.scrollX + rect.x - rect.width
    } else {
      throw new ValueError( `block is: '${ block }'; it should be one of the following values: 'center', 'start', or 'end'` )
    }
    window.smoothScrollTo( x, y, easing, duration )
  },
  enumerable: false
})


