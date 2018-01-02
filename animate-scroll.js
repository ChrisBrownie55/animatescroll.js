const BezierEasing = require( './bezier-easing.js' )

window.smoothScroll = function( x, y, cubicBezier, duration ) {

}

Object.defineProperty( HTMLElement.prototype, 'scrollIntoView', {
  value: function ( easing, block = 'center' ) {
    /* easing: type:String or type:Array( Float ) length:4
     * block: type:String
     */
    if ( typeof block !== 'string' )
      throw TypeError( `block is of type: ${ typeof block }; it should be of type: string` )
    if( ![ 'center', 'start', 'end' ].some( s => block === s ) )
      throw new Error( 'ValueError', `block does not contain one of the following values: 'center', 'start', or 'end'` )
    if ( typeof easing === 'string' ) {

    }
  },
  enumerable: false
})

