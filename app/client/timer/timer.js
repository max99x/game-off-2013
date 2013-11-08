var $ = require('jquery');
var d3 = require('d3');
var template = require('./template');

// TODO: Add comments to this code.
// TODO: Center the timer label.
// TODO: Color timer red when time remaining <25%.
// TODO: Pulsate the timer label when time remaining <25%.
// TODO: Add timer tick sounds, louder when time remaining <25%.
function Timer (options) {
  if (!options.interval) {
    throw new Error('Please set an interval');
  }

  this.$el = $(template);
  this.interval = options.interval;
  this.timeLeft = options.interval;
  this.progressWidth = options.progressWidth || 5;
  this.outerRadius = options.outerRadius || this.$el.height() / 2;
  this.innerRadius = this.outerRadius - this.progressWidth;
  this.d3Container = d3.select(this.$el[0]);
  this.svg = this.d3Container.append('svg').style('width', this.outerRadius * 2);
  this._completeCallback = options.onComplete || function () {};

  this._initialDraw();
}

Timer.prototype._initialDraw = function () {
  this.group = this.svg.append('g').attr(
    'transform',
    'translate(' + this.outerRadius + ',' + this.outerRadius +')'
  );

  this.group.append('path').attr('fill', 'black');
  this._updatePath(1);

  this.group.append('circle')
    .attr('r', this.innerRadius)
    .attr('fill', 'white')
    .attr('stroke', 'grey');


  this.group.append('text')
    .text(this.timeLeft)
    .attr('text-anchor', 'middle');
};

var SEC = 1000;

Timer.prototype.start = function() {
  this.timeout = setTimeout(function () {
    this._decrementTime();
    this._updatePath(this.timeLeft / this.interval);
  }.bind(this), SEC);
};

Timer.prototype.stop = function () {
  if (this.timeout) clearTimeout(this.timeout);
};

Timer.prototype._decrementTime = function() {
  this.timeLeft--;
  this.group.select('text').text(this.timeLeft);
  if (this.timeLeft === 0) {
    this._completeCallback();
  } else {
    this.start();
  }
};

var TWOPI = 2 * Math.PI;

Timer.prototype._updatePath = function (ratioLeft) {
  this.group.select('path').attr(
    'd',
    d3.svg.arc()
      .startAngle(TWOPI)
      .endAngle(TWOPI - (ratioLeft * TWOPI))
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius)
  );
};

module.exports = Timer;
