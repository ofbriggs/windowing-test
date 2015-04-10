import Ember from 'ember';
import $ from 'jquery';
import runLib from '../plugins/requestAnimationFrame';

function changePos(elem, x, y, useTransform){
    if (useTransform){
        elem.style.transform = 'translate3d(%@px,%@px, 0)'.fmt(x, y);
    }
    else {
        elem.style.top = y + "px";
        elem.style.left = x + "px";
    }
}

export default Ember.Component.extend({
    classNames: ['drag-box', 'rows-3'],
    pointerStyle:null,
    track: false,
    startX: 0,
    startY: 0,
    currX:null,
    currY:null,
    moveEvent: null,
    textArr: null,
    useTransform: false,
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
            changePos(this.$()[0], posX, posY, this.useTransform);
            requestAnimationFrame(this.updatePos.bind(this));
        }
        else if (this.track){
            requestAnimationFrame(this.updatePos.bind(this));
        }

    },
    mouseUpHandler: function(e){
        this.track = false;
        this.startY = this.currY = 0;
        this.startX = this.currX = 0;
        this.$().removeClass('dragging').addClass('animate').one('transitionend', function(e){
            this.classList.remove('animate');
        });
        changePos(this.$()[0], 0, 0, this.useTransform);
        $(document.body).removeClass('noselect');
        $(document).off('mouseup');
        $(document).off('mousemove');
    },
    mouseDown: function(e){
        if (e.which === 1){
            this.moveEvent = null;
            this.track = true;
            this.top = e.clientY;
            this.left = e.clientX;
            var cStyle = window.getComputedStyle(this.$()[0]);
            console.log(cStyle.transform);
            this.$().addClass('dragging').removeClass('animate');
            $(document.body).addClass('noselect');
            $(document).on('mouseup', this.mouseUpHandler.bind(this));
            $(document).on('mousemove',function(e){
                this.moveEvent = e;
            }.bind(this));
            requestAnimationFrame(this.updatePos.bind(this));
        }
    }
});
