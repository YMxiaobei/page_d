function mirror_partical (ctx1,ctx2,width,height) {
    function create_partical () {
    	var x = Math.random()*(width-10)+5
    	var y = Math.random()*(height-10)+5;
    	var r = 1+Math.random()*3;
    	var x_direction = 1;
    	var y_direction = 1;
    	this.create = function () {
    		ctx1.beginPath();
    		ctx1.arc(x, y, r, 0, 2*Math.PI);
    		ctx1.closePath();
            ctx2.beginPath();
            ctx2.arc(x, height-y, r, 0, 2*Math.PI);
            ctx2.closePath();
            ctx1.fill();
            ctx2.fill();
    	};
    	this.change_size_position = function (speed) {
    		x = x+speed*x_direction;
    		y = y+speed*y_direction;
    		if (x>width-r||x<0+r)
    		    {
    		    	x_direction*=-1;
    		    };
            if (y>height-r||y<0+r)
                {
                	y_direction*=-1;
                };
    	};
    	this.throw_dice = function () {
    		if(Math.random()>0.5)
    		    {
    		    	x_direction = -1;
    		    };
    		if(Math.random()>0.5)
    		    {
    		    	y_direction = -1;
    		    }
    	};
    	this.getX = function () {
    		return x;
    	};
    	this.getY = function () {
    		return y;
    	}
    };
    var partical_arr = new Array();
    for (var i = 0;i<10;i++)
        {
            partical_arr[i] = new create_partical();
            partical_arr[i].create();
            partical_arr[i].throw_dice();
        };
    this.move = function () {
    	ctx1.clearRect(0,0,width,height);
    	ctx2.clearRect(0,0,width,height);
    	for (var i=0;i<partical_arr.length;i++)
    	    {
    	    	partical_arr[i].change_size_position(0.5);
    	    	partical_arr[i].create();
    	    };
    	for (var a=0;a<partical_arr.length;a++)
    	    {
    	    	var thisX = partical_arr[a].getX();
    	    	var thisY = partical_arr[a].getY();
    	    	for (var b=0;b<partical_arr.length;b++)
    	    	    {
    	    	    	var x = partical_arr[b].getX();
    	    	    	var y = partical_arr[b].getY();
    	    	    	if(Math.abs(x-thisX)<100&&Math.abs(y-thisY)<100)
    	    	    	    {   
    	    	    	    	var distance =Math.sqrt((x-thisX)*(x-thisX)+(y-thisY)*(y-thisY));
    	    	    	    	var t =(1-(distance/Math.sqrt(20000)))*0.2;
    	    	    	    	
    	    	    	    	ctx1.strokeStyle = "rgba(255,255,255,"+t+")";
    	    	    	    	ctx2.strokeStyle = "rgba(255,255,255,"+t+")";
    	    	    	    	ctx1.beginPath();
    	    	    	    	ctx1.moveTo(thisX,thisY);
    	    	    	    	ctx1.lineTo(x,y);
    	    	    	    	ctx1.closePath();
    	    	    	    	ctx1.stroke();
    	    	    	    	ctx2.beginPath();
    	    	    	    	ctx2.moveTo(thisX,height-thisY);
    	    	    	    	ctx2.lineTo(x,height-y);
    	    	    	    	ctx2.closePath();
    	    	    	    	ctx2.stroke();
    	    	    	    };
    	    	    }
    	    }
    };
};
