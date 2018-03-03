
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.beginPath();
context.strokeStyle = '#900';
context.lineWidth = 4;

canvas.addEventListener('mousedown', function(e) {
	context.moveTo(e.offsetX, e.offsetY);
	canvas.addEventListener('mousemove', move);

})
canvas.addEventListener('mouseup', function(e) {
	canvas.removeEventListener('mousemove', move);
	document.getElementById('sig-input').value = canvas.toDataURL();//to send string with signature (canvas) - use hidden input in html, assign the value of this hidden input to the string (to make string is method canvas.toDataURL())
})

function move(e) {
		context.lineTo(e.offsetX, e.offsetY)
		context.stroke();

}






//w
