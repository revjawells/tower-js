class TextBox 
{
	constructor(where, max = 25)
	{
		this.where = document.getElementById(where);

		this.max = max;
		this.size = 0;

		this.text = [];
	}

	update()
	{
		this.where.innerHTML = "";

		for (var line of this.text) {
			var content = document.createTextNode(line);
			this.where.appendChild(content);
			this.where.appendChild(document.createElement("br"));
		}
	}

	clear()
	{
		this.text = [];
		this.size = 0;
	}

	println(what="")
	{
		this.text.push(what);
		this.size += 1;

		if (this.size > this.max) {
			this.text.shift();
			this.size -= 1;
		}

		this.update();
	}


	export() {
        var out = "";

		for (var line of this.text) {
			out = out.concat(line);
			out = out.concat('\n');
		}

        var data = new Blob([out], {type: 'text/plain'});
        var url = window.URL.createObjectURL(data);
        document.getElementById('export').href = url;	
	}
}
