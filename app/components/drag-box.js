import Ember from 'ember';
import $ from 'jquery';
//
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

export default Ember.Component.extend({
    classNames: ['drag-box'],
    attributeBindings: ['style'],
    pointerStyle:null,
    style:'background:red;',
    track: false,
    startX: 0,
    startY: 0,
    currX:null,
    currY:null,
    moveEvent: null,
    textArr: null,
    updateArr: function(){
        this.get('textArr').pushObject(Math.random());
        Ember.run.later(this, this.updateArr, 800);
    },
    didInsertElement: function(){
        this.set('textArr', []);
        Ember.run.later(this, this.updateArr, 800);
    },
    updatePos: function(){
        var e = this.moveEvent;
        var top = this.top;
        var left = this.left;

        if (this.track && e){
            let posY = this.currY = e.clientY - top + this.startY;
            let posX = this.currX = e.clientX - left + this.startX;
            this.$()[0].style.transform = 'translate3d(%@px,%@px, 0)'.fmt(posX, posY);
            requestAnimationFrame(this.updatePos.bind(this));
        }
        else if (this.track){
            requestAnimationFrame(this.updatePos.bind(this));
        }

    },
    mouseMove: function(e){
        //this.moveEvent = e;
            //window.requestAnimationFrame(this.updatePos.bind(this));
    },
    mouseUp: function(e){
        this.track = false;
        this.startY = this.currY = 0;
        this.startX = this.currX = 0;
        this.$().animate()
        console.log(this.currX,';',this.currY);
        this.$().addClass('return');
        this.$()[0].style.transform = 'translate3d(%@px,%@px, 0)'.fmt(0, 0);
        $(document).off('mousemove');
    },
    m2A: function(str){
        return str.split('(')[1].split(')')[0].split(',');
    },
    mouseDown: function(e){
        this.track = true;
        this.top = e.clientY;
        this.left = e.clientX;
        var cStyle = window.getComputedStyle(this.$()[0]);
        console.log(cStyle.transform);
        var matrix = cStyle.webkitTransform;
        this.$().removeClass('return');
        //console.log("computed:",matrix,":",matrix[5]);
        //$('body').on('mousemove',this.mousemove);
        this.moveEvent = null;
        $(document).on('mousemove',function(e){
            this.moveEvent = e;
        }.bind(this));
        requestAnimationFrame(this.updatePos.bind(this));
    },
    click: function(e){
        console.log(e.clientX,':',e.clientY);
    }
});
