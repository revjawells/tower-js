// remove element e from an array
Array.prototype.remove = function (e) {
	var i = this.indexOf(e);

	if (i > -1) 
  		this.splice(i, 1);
}
