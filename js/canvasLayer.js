var scoreEl = document.querySelector('#scoreEl');
var canvas = document.querySelector('#gameCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export {canvas, ctx, scoreEl};