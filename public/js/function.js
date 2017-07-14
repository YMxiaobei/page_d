function tipBlock (string, width, height, callback_yes, callback_no) {
	var $container = $("<div></div>");
	var $tipBlock = $("<div></div>");
	var $button_yes = $("<button></button>");
	var $button_no = $("<button></button>");
	$container.css({
		"width": "100%",
		"height": "100%",
		"position": "relative",
		"background": "black",
		"opacity": "0.8"
	});
	$tipBlock.css({
		"width": width,
		"height": height,
		"background": "white",
		"position": "absolute",
		"left": "0px",
		"right": "0px",
		"top": "0px",
		"bottom": "0px"
	});
	$container.append($tipBlock);
	$("body").append($container);
	$tipBlock.text(string);
};
function get_response_base64 (formData,response_data,button) {
    var $iframe = $("<iframe name='response_base64_container' style='display:none'></iframe>");
    $("body").append($iframe);
    var pre_name = formData.target;
    formData.target = "response_base64_container";
    $iframe[0].onload = function () {
        response_data.data = this.contentDocument.documentElement.getElementsByTagName('body')[0].innerHTML;
        formData.target = pre_name;
        button.click();
        $(this).remove();
    };
    formData.submit();
}
function ZKJ_strokeTo (ctx, begin, end, fps, speed, callback) {
    var k = (end.y-begin.y)/(end.x-begin.x);
    var x = begin.x;
    var $button = $("<button style='display:none'></button>");
    $button.click(function () {
     if(x>end.x)
         { 
            clearInterval(intervalObj);
            $(this).remove();
                if (callback) {
                     callback();
                } 
         }
    });

    var intervalObj = setInterval(function () {
        ctx.clearRect(begin.x, begin.y, (end.x-begin.x), (end.y-begin.y));
        x+=speed;
        ctx.beginPath();
        ctx.moveTo(begin.x,begin.y);
        ctx.lineTo(x, k*(x-begin.x)+begin.y);
        ctx.stroke();
        ctx.closePath();
        $button.click();
    }, 
    1000/fps);
};
/************/

function drawG(ctx1, ctx2, arr) {
    var i = 0;
    var nb = arr.length;
    var spinerArr = new Array();
   function goOn () {
      if (i<(nb-2))
          {   
              i+=1;
              spinerArr[i] = new spinner(ctx2, arr[i].x, arr[i].y);
              spinerArr[i].open();
              spinerArr[i-1].close();
              ZKJ_strokeTo(ctx1,arr[i],arr[i+1],30,0.5,goOn);
          }
      else
          {
              spinerArr[i+1] = new spinner(ctx2, arr[i+1].x, arr[i+1].y);
              spinerArr[i+1].open();
              spinerArr[i].close();
              setTimeout(function() {
                  spinerArr[i+1].close();
              },2000);
          }
    };;
    spinerArr[0] = new spinner(ctx2,arr[0].x,arr[0].y);
    spinerArr[0].open();
    ZKJ_strokeTo(ctx1,arr[i],arr[i+1],30,0.5,goOn);
};
/***********/

function spinner ( init_obj ) {
    var ctx = this.ctx = init_obj.ctx,
        x_num = this.x = init_obj.x ? init_obj.x : 0,
        y_num = this.y = init_obj.y ? init_obj.y : 0,
        min_Core_R_num = this.min_Core_R = init_obj.min_Core_R ? init_obj.min_Core_R : 3,
        max_Core_R_num = this.max_Core_R = init_obj.max_Core_R ? init_obj.max_Core_R : 5,  
        outer_sector_R_num = this.outer_sector_R = init_obj.outer_sector_R ? init_obj.outer_sector_R : 9,
        inner_sector_R_num = this.inner_sector_R = init_obj.inner_sector_R ? init_obj.inner_sector_R : 7,
        current_inner_sector_R_num = this.current_outer_sector_R = max_Core_R_num,
        current_outer_sector_R_num = this.current_inner_sector_R = max_Core_R_num + outer_sector_R_num - inner_sector_R_num,
        v1_num = this.v1 = init_obj.v1 ? init_obj.v1 : 1,
        v2_num = this.v2 = init_obj.v2 ? init_obj.v2 : 1,
        fps_num = this.fps = init_obj.fps ? init_obj.fps : 30,
        animation_angle_save_num = this.animation_angle_save = 0,
        sector_angle_save_num = this.sector_angle_save = 120 / 180 * Math.PI,
        current_core_R_num = this.current_core_R = min_Core_R_num,
        status_num = this.status = 1,
        interval_list_arr = this.interval_list = ["","","","",""];
    
    ctx.beginPath ();
    ctx.arc ( x_num, y_num, min_Core_R_num, 0, 2 * Math.PI );
    ctx.fill ();
};
spinner.prototype.animation = function () {
    var status_num = this.status,
        reflash_time_num = 1000 / this.fps,
        thisObj = this,
        step1_fun = this.step1,
        step2_fun = this.step2,
        step3_fun = this.step3,
        step4_fun = this.step4,
        step5_fun = this.step5;

    switch ( status_num ) {
        case 1: {
            this.interval_list[ 0 ] = setInterval ( function () { step1_fun.call ( thisObj ) }, reflash_time_num );
            break;
        }
        case 2: {
            this.interval_list[ 1 ] = setInterval ( function () { step2_fun.call ( thisObj ) }, reflash_time_num );
            break;
        }
        case 3: {
            this.interval_list[ 2 ] = setInterval ( function () { step3_fun.call ( thisObj ) }, reflash_time_num );
            break;
        }
        case 4: {
            this.interval_list[ 3 ] = setInterval ( function () { step4_fun.call ( thisObj ) }, reflash_time_num );
            break;
        }
        case 5: {
            this.interval_list[ 4 ] = setInterval ( function () { step5_fun.call ( thisObj ) }, reflash_time_num );
            break;
        }
        default: {
            break;
        }
    }    
}
spinner.prototype.step1 = function () {
    var current_core_R_num = this.current_core_R,
        final_Core_R_num = this.max_Core_R + this.outer_sector_R - this.inner_sector_R,
        status = this.status,
        pause_b = this.pause,
        ctx = this.ctx,
        x_num = this.x,
        y_num = this.y,
        v_num = this.v1,
        interval_list_arr = this.interval_list;
        
    if ( current_core_R_num < final_Core_R_num ) {
        current_core_R_num += v_num;
        current_core_R_num = current_core_R_num <= final_Core_R_num ? current_core_R_num : final_Core_R_num;
    }

    if ( status == 1 && !pause_b ) {
        if ( current_core_R_num >= final_Core_R_num ) {
            this.status = 2;
        }
        this.clear ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_core_R_num, 0, 2 * Math.PI ); 
        ctx.closePath ();
        ctx.fill ();  
        this.current_core_R = current_core_R_num; 
    }
    else {
        clearInterval ( interval_list_arr[ 0 ] );
        interval_list_arr[ 0 ] = "";
        if ( !pause_b ) {
            this.animation ();   
        } 
    }
    
}
spinner.prototype.step2 = function () {
    var current_inner_sector_R_num = this.current_outer_sector_R,
        current_outer_sector_R_num = this.current_inner_sector_R,
        destination_inner_sector_R_num = this.inner_sector_R,
        destination_outer_sector_R_num = this.outer_sector_R,
        v_num = this.v1,
        status = this.status,
        pause_b = this.pause,
        ctx = this.ctx,
        x_num = this.x,
        y_num = this.y,
        r_num = this.max_Core_R,
        angle_save_num = this.sector_angle_save,
        angle_destination_num = 100 / 180 * Math.PI,
        angle_position_num = 2 * Math.PI / 3,
        ctx = this.ctx,
        interval_list_arr = this.interval_list;  

    if ( current_inner_sector_R_num < destination_inner_sector_R_num ) {
        current_inner_sector_R_num = current_inner_sector_R_num += v_num;
        current_inner_sector_R_num = current_inner_sector_R_num <= destination_inner_sector_R_num ? current_inner_sector_R_num : destination_inner_sector_R_num;
    }
    if ( current_outer_sector_R_num < destination_outer_sector_R_num ) {
        current_outer_sector_R_num += v_num;
        current_outer_sector_R_num = current_outer_sector_R_num <= destination_outer_sector_R_num ? current_outer_sector_R_num : destination_outer_sector_R_num;
    }
    if ( angle_save_num > angle_destination_num ) {
        angle_save_num -= v_num;
        angle_save_num = angle_save_num >= angle_destination_num ? angle_save_num : angle_destination_num;
    }

    if ( status == 2 && !pause_b ) {
        if ( current_inner_sector_R_num >= destination_inner_sector_R_num && 
             current_outer_sector_R_num >= destination_outer_sector_R_num && angle_save_num <= angle_destination_num ) {
            this.status = 3;
        }

        this.clear ();
      
        ctx.beginPath ();
        ctx.arc ( x_num, y_num, r_num, 0, 2 * Math.PI );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, -angle_save_num / 2, angle_save_num / 2, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, angle_save_num / 2, -angle_save_num / 2, true );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, angle_position_num - angle_save_num / 2, angle_position_num + angle_save_num / 2, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, angle_position_num + angle_save_num / 2, angle_position_num - angle_save_num / 2, true );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, 2 * angle_position_num - angle_save_num / 2, 2 * angle_position_num + angle_save_num / 2, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, 2 * angle_position_num + angle_save_num / 2, 2 * angle_position_num - angle_save_num / 2, true );
        ctx.closePath ();
        ctx.fill ();
       
        this.current_outer_sector_R = current_outer_sector_R_num;
        this.current_inner_sector_R = current_inner_sector_R_num;
        this.sector_angle_save = angle_save_num;
    }
    else {
        clearInterval ( interval_list_arr[ 1 ] );
        interval_list_arr[ 1 ] = "";
        if ( !pause_b ) {
            this.animation ();   
        } 
    }
}
spinner.prototype.step3 = function () {
    var outer_sector_R_num = this.outer_sector_R,
        inner_sector_R_num = this.inner_sector_R,
        animation_angle_save_num = this.animation_angle_save,
        sector_angle_save_num = this.sector_angle_save,
        angle_position_num = 2 * Math.PI / 3,
        ctx = this.ctx,
        v_num = this.v2,
        x_num = this.x,
        y_num = this.y,
        r_num = this.max_Core_R,
        status = this.status,
        pause_b = this.pause,
        interval_list_arr = this.interval_list; 

    if ( status == 3 && !pause_b ) {
        animation_angle_save_num += v_num;

        this.clear ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, r_num, 0, 2 * Math.PI );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, outer_sector_R_num, -sector_angle_save_num / 2 + animation_angle_save_num, sector_angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, inner_sector_R_num, sector_angle_save_num / 2 + animation_angle_save_num, -sector_angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, outer_sector_R_num, angle_position_num - sector_angle_save_num / 2 + animation_angle_save_num, angle_position_num + sector_angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, inner_sector_R_num, angle_position_num + sector_angle_save_num / 2 + animation_angle_save_num, angle_position_num - sector_angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();
        ctx.fill (); 

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, outer_sector_R_num, 2 * angle_position_num - sector_angle_save_num / 2 + animation_angle_save_num, 2 * angle_position_num + sector_angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, inner_sector_R_num, 2 * angle_position_num + sector_angle_save_num / 2 + animation_angle_save_num, 2 * angle_position_num - sector_angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();

        ctx.fill ();

        this.animation_angle_save = animation_angle_save_num;
    }
    else {
        clearInterval ( interval_list_arr[ 2 ] );
        interval_list_arr[ 2 ] = "";
        if ( !pause_b ) {
            this.animation ();   
        }
    }
}
spinner.prototype.step4 = function () {
    var current_inner_sector_R_num = this.current_outer_sector_R,
        current_outer_sector_R_num = this.current_inner_sector_R,
        destination_inner_sector_R_num = this.max_Core_R,
        destination_outer_sector_R_num = this.max_Core_R + this.outer_sector_R - this.inner_sector_R,
        v1_num = this.v1,
        v2_num = this.v2,
        status = this.status,
        pause_b = this.pause,
        ctx = this.ctx,
        x_num = this.x,
        y_num = this.y,
        r_num = this.max_Core_R,
        angle_save_num = this.sector_angle_save,
        angle_destination_num = 120 / 180 * Math.PI,
        angle_position_num = 2 * Math.PI / 3,
        animation_angle_save_num = this.animation_angle_save,
        ctx = this.ctx,
        interval_list_arr = this.interval_list;

    if ( current_inner_sector_R_num > destination_inner_sector_R_num ) {
        current_inner_sector_R_num = current_inner_sector_R_num -= v1_num;
        current_inner_sector_R_num = current_inner_sector_R_num >= destination_inner_sector_R_num ? current_inner_sector_R_num : destination_inner_sector_R_num;
    }
    if ( current_outer_sector_R_num > destination_outer_sector_R_num ) {
        current_outer_sector_R_num -= v1_num;
        current_outer_sector_R_num = current_outer_sector_R_num >= destination_outer_sector_R_num ? current_outer_sector_R_num : destination_outer_sector_R_num;
    }
    if ( angle_save_num < angle_destination_num ) {
        angle_save_num += v1_num;
        angle_save_num = angle_save_num <= angle_destination_num ? angle_save_num : angle_destination_num;
    }

    if ( status == 4 && ! pause_b ) {
        if ( current_inner_sector_R_num <= destination_inner_sector_R_num && 
             current_outer_sector_R_num <= destination_outer_sector_R_num && angle_save_num >= angle_destination_num  ) {
            this.status = 5
        }
        
        animation_angle_save_num += v2_num;

        this.clear ();
        ctx.beginPath ();
        ctx.arc ( x_num, y_num, r_num, 0, 2 * Math.PI );
        ctx.closePath ()
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, -angle_save_num / 2 + animation_angle_save_num, angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, angle_save_num / 2 + animation_angle_save_num, -angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, angle_position_num - angle_save_num / 2 + animation_angle_save_num, angle_position_num + angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, angle_position_num + angle_save_num / 2 + animation_angle_save_num, angle_position_num - angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();
        ctx.fill ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_outer_sector_R_num, 2 * angle_position_num - angle_save_num / 2 + animation_angle_save_num, 2 * angle_position_num + angle_save_num / 2 + animation_angle_save_num, false );
        ctx.arc ( x_num, y_num, current_inner_sector_R_num, 2 * angle_position_num + angle_save_num / 2 + animation_angle_save_num, 2 * angle_position_num - angle_save_num / 2 + animation_angle_save_num, true );
        ctx.closePath ();
        ctx.fill ();

        this.animation_angle_save = animation_angle_save_num;
        this.current_outer_sector_R = current_outer_sector_R_num;
        this.current_inner_sector_R = current_inner_sector_R_num;
        this.sector_angle_save = angle_save_num;
    }
    else {
        clearInterval ( interval_list_arr[ 3 ] );
        interval_list_arr[ 3 ] = "";
        this.current_core_R = this.max_Core_R;
        if ( !pause_b ) {
            this.animation ();   
        }
    }
}
spinner.prototype.step5 = function () {
    var current_core_R_num = this.current_core_R,
        final_Core_R_num = this.min_Core_R,
        status = this.status,
        pause_b = this.pause,
        ctx = this.ctx,
        x_num = this.x,
        y_num = this.y,
        v_num = this.v1,
        interval_list_arr = this.interval_list;

    if ( current_core_R_num > final_Core_R_num ) {
        current_core_R_num -= v_num;
        current_core_R_num = current_core_R_num >= final_Core_R_num ? current_core_R_num : final_Core_R_num;
    }  
    if ( status == 5 && !pause_b ) {
        if ( current_core_R_num <= final_Core_R_num ) {
            status = 1;
        }

        this.clear ();

        ctx.beginPath ();
        ctx.arc ( x_num, y_num, current_core_R_num, 0, 2 * Math.PI ); 
        ctx.fill ();  
        this.current_core_R = current_core_R_num; 
    }
    else {
        clearInterval ( interval_list_arr[ 4 ] );
        interval_list_arr[ 4 ] = "";
    }
}
spinner.prototype.clear = function () {
    var width_num = this.outer_sector_R * 2,
        height_num = width_num,
        x_num = this.x - width_num / 2,
        y_num = this.y - height_num / 2,
        ctx = this.ctx;

    ctx.clearRect ( x_num, y_num, width_num, height_num );
}
spinner.prototype.stop = function () {
    var interval_list_arr = this.interval_list;

    this.pause = true;
    for ( var i = 0; i < interval_list_arr.length; i++ ) {
        if ( interval_list_arr[ i ] ) {
            clearInterval ( interval_list_arr[ i ] );
            interval_list_arr[ i ] = "";
        }
    }
}
spinner.prototype.play = function () {
    this.pause = false;
    this.animation ();
}
spinner.prototype.close = function () {
    this.status = 4;
}


/***********/
function draw ( ctx ) {
    this.ctx = ctx;
}

draw.prototype = {
    dashed: function ( start_x_num, start_y_num, end_x_num, end_y_num ) {
        var length_num = this.length ? this.length : 3,
            span_num = this.span ? this.span : 2,
            x_length_num = end_x_num > start_x_num ? end_x_num - start_x_num : start_x_num - end_x_num,
            y_length_num = end_y_num > start_y_num ? end_y_num - start_y_num : start_y_num - end_y_num,
            x_pen_begin_num = end_x_num > start_x_num ? start_x_num : end_x_num,
            x_pen_end_num = end_x_num > start_x_num ? end_x_num : start_x_num,
            y_pen_begin_num = end_y_num > start_y_num ? start_y_num : end_y_num,
            y_pen_end_num = end_y_num > start_y_num ? end_y_num : start_y_num,
            ctx = this.ctx;
        
        ctx.beginPath ();

        if ( x_length_num == 0 ) {
            while ( y_pen_end_num > y_pen_begin_num ) {
                ctx.moveTo ( x_pen_begin_num, y_pen_begin_num )
                y_pen_begin_num += length_num; 
                if ( y_pen_begin_num < y_pen_end_num ) {
                    ctx.lineTo ( x_pen_begin_num, y_pen_begin_num );
                    y_pen_begin_num += span_num;
                }
                else {
                    ctx.lineTo ( x_pen_begin_num, y_pen_end_num );
                }
            }  
        }

        else if ( y_length_num == 0 ) {
            while ( x_pen_end_num > x_pen_begin_num ) {
                ctx.moveTo ( x_pen_begin_num, y_pen_begin_num )
                x_pen_begin_num += length_num; 
                if ( x_pen_begin_num < x_pen_end_num ) {
                    ctx.lineTo ( x_pen_begin_num, y_pen_begin_num );
                    x_pen_begin_num += span_num;
                }
                else {
                    ctx.lineTo ( x_pen_end_num, y_pen_begin_num );
                }
            }
        }

        else {
            if ( ( end_x_num - start_x_num ) * ( end_y_num - start_y_num ) < 0 ) {
                var save_num = y_pen_begin_num;
                y_pen_begin_num = y_pen_end_num;
                y_pen_end_num = save_num;
            }
            var tan_num = ( y_pen_end_num - y_pen_begin_num ) / ( x_pen_end_num - x_pen_begin_num );
            while ( x_pen_begin_num < x_pen_end_num ) {
                ctx.moveTo ( x_pen_begin_num, y_pen_begin_num );
                x_pen_begin_num += length_num;
                y_pen_begin_num = y_pen_begin_num + length_num * tan_num;
                if ( x_pen_begin_num < x_pen_end_num ) {
                    ctx.lineTo ( x_pen_begin_num, y_pen_begin_num );
                    x_pen_begin_num += span_num;
                    y_pen_begin_num = y_pen_begin_num + span_num * tan_num;
                }
                else {
                    ctx.lineTo ( x_pen_end_num, y_pen_end_num );
                }
            }
        }

        ctx.stroke ();
    },
    animationSolid: function ( init ) {
        var start_x_num = this.start_x = init.start_x,
            start_y_num = this.start_y = init.start_y,
            end_x_num = this.end_x = init.end_x,
            end_y_num = this.end_y = init.end_y, 
            pen_x_num = this.pen_x = start_x_num,
            pen_y_num = this.pen_y = start_y_num,
            x_length_num = this.x_length = end_x_num > start_x_num ? end_x_num - start_x_num : start_x_num - end_x_num,
            y_length_num = this.y_length = end_y_num > start_y_num ? end_y_num - start_y_num : start_y_num - end_y_num,
            draw_line_fun = this.draw_line,
            thisObj = this,
            v_num =  this.v = init.v ? init.v : 0.5,
            k = this.k = end_x_num != start_x_num ? ( end_y_num - start_y_num ) / ( end_x_num - start_x_num ) : 0;

        this.interval = setInterval ( function () { draw_line_fun.call ( thisObj ) }, 1000 / 30 ); 
    },
    draw_line: function () {
        var start_x_num = this.start_x,
            start_y_num = this.start_y,
            end_x_num = this.end_x,
            end_y_num = this.end_y, 
            pen_x_num = this.pen_x,
            pen_y_num = this.pen_y,
            clearRect_start_x = start_x_num < end_x_num ? start_x_num : end_x_num,
            clearRect_start_y = start_y_num < end_y_num ? start_y_num : end_y_num,
            x_length_num = this.x_length,
            y_length_num = this.y_length,
            v_num =  this.v,
            k = this.k,
            interval = this.interval,
            ctx = this.ctx;

        if ( end_x_num > start_x_num && pen_x_num < end_x_num ) {
            pen_x_num += v_num;
            pen_y_num += k * v_num;
            pen_x_num = pen_x_num <= end_x_num ? pen_x_num : end_x_num;
            pen_y_num = k > 0 ? ( pen_y_num <= end_y_num ?  pen_y_num : end_y_num ) : ( pen_y_num >= end_y_num ?  pen_y_num : end_y_num );
        }
        else if ( end_x_num < start_x_num && pen_x_num > end_x_num ) {
            pen_x_num -= v_num;
            pen_y_num -= k * v_num;
            pen_x_num = pen_x_num >= end_x_num ? pen_x_num : end_x_num;
            pen_y_num = k > 0 ? ( pen_y_num >= end_y_num ?  pen_y_num : end_y_num ) : ( pen_y_num <= end_y_num ?  pen_y_num : end_y_num );
        }
        else if ( end_x_num == start_x_num ) {
            if ( end_y_num > start_y_num ) {
                pen_y_num += v_num;
                pen_y_num = pen_y_num <= end_y_num ? pen_y_num : end_y_num;
            }
            else {
                pen_y_num -= v_num;
                pen_y_num = pen_y_num >= end_y_num ? pen_y_num : end_y_num;
            }
        }
        
        ctx.clearRect ( clearRect_start_x, clearRect_start_y, x_length_num, y_length_num );
        ctx.beginPath ();
        ctx.moveTo ( start_x_num, start_y_num );
        ctx.lineTo ( pen_x_num, pen_y_num );
        ctx.stroke ();
        
        this.pen_x = pen_x_num;
        this.pen_y = pen_y_num;
       
        if ( ( pen_x_num == end_x_num && start_x_num != end_x_num ) || ( start_x_num == end_x_num && pen_y_num == end_y_num ) ) {
            clearInterval ( interval );
            if ( this.finish ) {
                this.finish ();
            }
        }
    }
}

/***********/

function graph ( option ) {
    var canvas_width_num = this.canvas_width = option.canvas_width ? option.canvas_width : 330,
        canvas_height_num = this.canvas_height = option.canvas_height ? option.canvas_height : 120,
        canvas_position_x_num = this.canvas_position_x = option.canvas_position_x ? option.canvas_position_x : 0,
        canvas_position_y_num = this.canvas_position_y = option.canvas_position_y ? option.canvas_position_y : 0,
        width_num = this.width = option.width ? option.width : 330,
        height_num = this.height = option.height ? option.height : 120,
        field_obj = this.field = {},
        x_CI_num = this.x_CI = option.x_CI ? option.x_CI : 10,
        y_CI_num = this.y_CI = option.y_CI ? option.y_CI : 5,
        position_x_num = this.position_x = option.position_x ? option.position_x : 0,
        position_y_num = this.position_y = option.position_y ? option.position_y : 0,
        data_list_arr = this.data_list = [],
        status_obj = this.status = {axis: 0, dashed: 0, data: 0, num: 0, block: 0},
        level_num = this.level = 1,
        num_obj = this.num = {}; 
    
    field_obj.width = option.field ? ( option.field.width ? option.field.width : 300 ) : 300;
    field_obj.height = option.field ? ( option.field.height ? option.field.height : 100 ) : 100 
    num_obj.x = [];
    num_obj.y = [];
    for ( var i = 0; i <= x_CI_num; i++ ) {
        num_obj.x.push ( i );
    }
    for ( var i = 1; i <= y_CI_num; i++ ) {
        num_obj.y.push ( i )
    }
    var x_span_num = this.x_span = field_obj.width / x_CI_num,
        y_span_num = this.y_span = field_obj.height / y_CI_num;
}

graph.prototype = {
    addData: function ( data_obj ) {
        var id_str = data_obj.id,
            data_save_obj = this.get ( id_str );

        this.upData_save = data_obj;    
        
        if ( data_save_obj ) {
            data_save_obj.fillStyle = data_obj.fillStyle ? data_obj.fillStyle : data_save_obj.fillStyle;
            data_save_obj.strokeStyle = data_obj.strokeStyle ? data_obj.strokeStyle : data_save_obj.strokeStyle;
            if ( data_obj.data ) {
                var preData_arr = this.upData_save.preData = [];
                $.merge ( preData_arr, data_save_obj.data );
                $.merge ( data_save_obj.data, data_obj.data );   
            }   
        }   

        this.data_list.push ( data_obj );
    },
    upData: function ( animation ) {
        if ( animation ) {
            this.upData_animation (); 
        }
        else {
            this.show ();  
        } 
    },
    upData_animation: function () {
        var ctx2 = this.ctx2,
            ctx3 = this.ctx3, 
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            x_span_num = this.x_span,
            y_span_num = this.y_span,
            height_num = this.height,
            upData_save_obj = this.upData_save,
            data_arr = upData_save_obj.data,
            d_obj = new draw ( ctx2 ),
            id_str = upData_save_obj.id,
            data_save_obj = this.get ( id_str ),
            x_begin_num = data_save_obj ? upData_save_obj.preData[ upData_save_obj.preData.length - 1 ].x : data_arr[ 0 ].x,
            y_begin_num = data_save_obj ? upData_save_obj.preData[ upData_save_obj.preData.length - 1 ].y : data_arr[ 0 ].y,
            i = data_save_obj ? 0 : 1,
            b = 0,
            sp_obj = [];
        
        ctx2.strokeStyle = upData_save_obj.strokeStyle ? upData_save_obj.strokeStyle : ( data_save_obj ? data_save_obj.strokeStyle : ctx2.strokeStyle ) ;
        ctx3.fillStyle = upData_save_obj.fillStyle ? upData_save_obj.fillStyle : ( data_save_obj ? data_save_obj.fillStyle : ctx3.fillStyle ) ;
        sp_obj[ b ] = new spinner ( {
            x: x_begin_num * x_span_num + begin_x_num + 5,
            y: begin_y_num + height_num - 5 - y_begin_num * y_span_num,
            ctx: ctx3,
            v1: 1,
            v2: 0.2
        } );
            
        d_obj.finish = function () {
            sp_obj[ b ].close ();
            b+=1;
            sp_obj[ b ] = new spinner ( {
                x: data_arr[ i ].x * x_span_num + begin_x_num + 5,
                y: begin_y_num + height_num - 5 - data_arr[ i ].y * y_span_num,
                ctx: ctx3,
                v1: 1,
                v2: 0.2 
            } );
            sp_obj[ b ].animation ();
            if ( i < data_arr.length - 1 ) {
                i += 1;
                d_obj.animationSolid ( {
                    start_x: data_arr[ i-1 ].x * x_span_num + begin_x_num + 5,
                    start_y:  begin_y_num + height_num - 5 - data_arr[ i-1 ].y * y_span_num,
                    end_x: data_arr[ i ].x * x_span_num + begin_x_num + 5,
                    end_y: begin_y_num + height_num - 5 - data_arr[ i ].y * y_span_num,
                    v: 1    
                } )
            }
            else {
                setTimeout ( function () { sp_obj[ b ].close () }, 2000 );
            }
        }

        sp_obj[ b ].animation ();
        d_obj.animationSolid ( {
            start_x: x_begin_num * x_span_num + begin_x_num + 5,
            start_y: begin_y_num + height_num - 5 - y_begin_num * y_span_num,
            end_x: data_arr[ i ].x * x_span_num + begin_x_num + 5,
            end_y: begin_y_num + height_num - 5 - data_arr[ i ].y * y_span_num,
            v: 1
        } )
    },
    setWidth: function ( newWidth_num ) {
        this.width = newWidth_num;
        this.show ();
    },
    setHeight: function ( newHeight_num ) {
        this.height = newHeight_num;
        this.show ();
    },
    setFieldWidth: function ( newFieldWidth_num ) {
        this.filed.width = newFieldWidth_num;
        this.x_span = this.filed.width / this.x_CI;
        this.show ();
    },
    setFiledHeight: function ( newFieldHeight_num ) {
        this.field.height = newFieldHeight_num;
        this.y_span = this.field.height / this.y_CI;
        this.show ();
    },
    setx_CI: function ( newx_CI_num ) {
        this.x_CI = newx_CI_num;
        this.x_span = this.field.width / this.x_CI;
        this.num.x = [];

        for ( var i = 0; i <= this.x_CI; i++ ) {
            this.num.x.push ( i );
        }

        this.show ();
    },
    sety_CI: function ( newy_CI_num ) {
        this.y_CI = newy_CI_num;
        this.y_span = this.field.height / this.y_CI;
        this.num.y = [];

        for ( var i = 1; i <= this.y_CI; i++ ) {
            this.num.y.push ( i )
        }

        this.show ();
    },
    setnum_x: function ( newnum_x_arr ) {
        this.num.x = [];

        for ( var i = 0; i < newnum_x_arr.length; i++ ) {
            this.num.x.push ( newnum_x_arr[ i ] );
        }

        this.show ();
    },
    setnum_y: function ( newnum_y_arr ) {
        this.num.y = [];

        for ( var i = 0; i <= newnum_y_arr.length; i++ ) {
            this.num.y.push ( newnum_y_arr[ i ] )
        }

        this.show ();
    },
    zoom: function ( ratio_num ) {
        this.width = this.width * ratio_num;
        this.height = this.height * ratio_num;
        this.field.width = this.field.width * ratio_num;
        this.field.height = this.field.height * ratio_num;
        this.x_span = this.field.width / this.x_CI;
        this.y_span = this.field.height / this.y_CI;

        this.show ();
    },
    setLevel: function ( newLevel_num ) {
        this.level = newLevel_num;
    },
    show: function () {
        var ctx = this.ctx;

        ctx.clearRect ( 0, 0, this.canvas_width, this.canvas_height );
        this.container.find ( "div" ).remove ();
        if ( this.status.axis ) {
            this.showAxis ();    
        }
        if ( this.status.dashed ) {
            this.showDashed ();
        }
        if ( this.status.data ) {
            this.showData ();
        }
        if ( this.status.num ) {
            this.showNum (); 
        }
        if ( this.status.block ) {
            this.showDataBlock ()
        }
    },
    showAxis: function () {
        var ctx = this.ctx,
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            width_num = this.width,
            height_num = this.height;
        
        ctx.beginPath ();
        ctx.moveTo ( 5 + begin_x_num, begin_y_num );
        ctx.lineTo ( begin_x_num, 5 + begin_y_num );
        ctx.moveTo ( 5 + begin_x_num, begin_y_num );
        ctx.lineTo ( 10 + begin_x_num, 5 + begin_y_num );
        ctx.moveTo ( 5 + begin_x_num, begin_y_num );
        ctx.lineTo ( 5 + begin_x_num, height_num - 5 + begin_y_num );
        ctx.lineTo ( width_num + begin_x_num, height_num - 5 + begin_y_num );
        ctx.lineTo ( width_num - 5 + begin_x_num, height_num - 10 + begin_y_num );
        ctx.moveTo ( width_num + begin_x_num, height_num - 5 + begin_y_num );
        ctx.lineTo ( width_num - 5 + begin_x_num, height_num + begin_y_num );

        ctx.stroke ();
    },
    showDashed: function () {
        var ctx = this.ctx,
            x_CI_num = this.x_CI,
            y_CI_num = this.y_CI,
            width_num = this.width,
            height_num = this.height,
            x_span_num = this.x_span,
            y_span_num = this.y_span,
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            field_width_num = this.field.width,
            field_height_num = this.field.height,
            x_coordinate_num = height_num - 5 + begin_y_num,
            y_coordinate_num = begin_x_num + 5;
        
        var d = new draw ( ctx );

        for ( var i = 1; i <= y_CI_num; i++ ) {
            d.dashed ( 5 + begin_x_num, x_coordinate_num - i * y_span_num, 5 + begin_x_num + field_width_num, x_coordinate_num - i * y_span_num );
        }
        for ( var i = 1; i <= x_CI_num; i++ ) {
            d.dashed ( y_coordinate_num + i * x_span_num, height_num - 5 + begin_y_num, y_coordinate_num + i * x_span_num, height_num - 5 - field_height_num + begin_y_num );
        }
    },
    showData: function () {
        var ctx = this.ctx,
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            x_span_num = this.x_span,
            y_span_num = this.y_span,
            data_list_arr = this.data_list,
            fillStyle_save_str = ctx.fillStyle,
            strokeStyle_save_str = ctx.strokeStyle,
            x_coordinate_num = begin_y_num + this.height - 5,
            level_num = this.level;
            
        for ( var i = data_list_arr.length - 1; i >= 0; i-- ) {
            var data_arr = data_list_arr[ i ].data;

            ctx.fillStyle = data_list_arr[ i ].fillStyle ? data_list_arr[ i ].fillStyle : ctx.fillStyle;
            ctx.strokeStyle = data_list_arr[ i ].strokeStyle ? data_list_arr[ i ].strokeStyle : ctx.strokeStyle;

            for ( var a = 0; a < data_arr.length; a++ ) {
                var x_num = data_arr[ a ].x * x_span_num + 5 + begin_x_num,
                    y_num = x_coordinate_num - data_arr[ a ].y / level_num * y_span_num;

                ctx.beginPath ();
                ctx.arc ( x_num, y_num, 3, 0, 2 * Math.PI );
                ctx.fill ();
            }
            
            ctx.beginPath ();
            ctx.moveTo ( data_arr[ 0 ].x * x_span_num + begin_x_num + 5, x_coordinate_num - data_arr[ 0 ].y / level_num * y_span_num);
            for ( var a = 1; a < data_arr.length; a++ ) {
                ctx.lineTo ( data_arr[ a ].x * x_span_num + begin_x_num + 5, x_coordinate_num - data_arr[ a ].y / level_num * y_span_num)
            }
            ctx.stroke ();
        }
        
        ctx.fillStyle = fillStyle_save_str.toString ();
        ctx.strokeStyle = strokeStyle_save_str.toString ();
    },
    showDataBlock: function () {
        var $container = this.container,
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            canvas_x_num = this.canvas_position_x,
            canvas_y_num = this.canvas_position_y,
            x_span_num = this.x_span,
            y_span_num = this.y_span,
            data_list_arr = this.data_list,
            x_coordinate_num = begin_y_num + this.height - 5 + canvas_y_num,
            level_num = this.level; 

        for ( var i = 0; i < data_list_arr.length; i ++ ) {
            var data_arr = data_list_arr[ i ].data;
            
            for ( var a = 0; a < data_arr.length; a++ ) {
                var $div_hover = $ ( '<div class="data-hover" style="width:10px;height:10px;position:absolute;"></div>' ),
                    $data_display = $ ( '<div class="data-block" style="width:45px;height:18px;text-align:center;line-height:18px;position:absolute;top:-25px;left:-17.5px;background:white;border:1px solid #dadada;display:none"></div>' ), 
                    left_num = canvas_x_num + begin_x_num + data_arr[ a ].x * x_span_num + 5 - 5,
                    top_num = x_coordinate_num - data_arr[ a ].y / level_num * y_span_num - 5;
                 
                 $container.append ( $div_hover );
                 $div_hover.append ( $data_display );
                 $div_hover.css ( "left", left_num + "px" );
                 $div_hover.css ( "top", top_num + "px" );
                 $data_display.text ( data_arr[ a ].y );
                 $div_hover.hover ( function () {
                    $ ( this ).find ( ".data-block" ).show ();
                 },
                 function () {
                    $ ( this ).find ( ".data-block" ).hide ();
                 } )
            }    
        }
    },
    showNum: function () {
        var x_span_num = this.x_span,
            y_span_num = this.y_span,
            x_arr = this.num.x,
            y_arr = this.num.y,
            x_CI_num = this.x_CI,
            y_CI_num = this.y_CI,
            begin_x_num = this.position_x,
            begin_y_num = this.position_y,
            canvas_begin_x_num = this.canvas_position_x,
            canvas_begin_y_num = this.canvas_position_y,
            field_height_num = this.field.height,
            height_num = this.height,
            $x_num_container = $ ( '<div style="position: absolute;padding-top: 5px"></div>' ),
            $y_num_container = $ ( '<div style="position: absolute;padding-right: 5px"></div>' );

        this.container.append ( $x_num_container );
        this.container.append ( $y_num_container );
        $x_num_container.css ( "width", ( x_span_num * ( x_CI_num + 1 ) ) + "px" );
        $x_num_container.css ( "left", canvas_begin_x_num + begin_x_num + 5 - x_span_num / 2 + "px" );
        $y_num_container.css ( "height", ( y_span_num * y_CI_num ) + "px");
        $y_num_container.css ( "top", canvas_begin_y_num + begin_y_num + ( height_num - field_height_num - 5 ) - y_span_num / 2 + "px" );

        for ( var i = 0; i <= x_CI_num; i++ ) {
            var $cell = $ ( '<div style="text-align: center;float: left;"></div>' );

            $cell.css ( "width", x_span_num + "px" );
            $cell.css ( "height", "1px" );
            $x_num_container.append ( $cell );
        }
        for ( var i = 1; i <= y_CI_num; i++ ) {
            var $cell = $ ( '<div style="text-align: right;"></div>' );

            $cell.css ( "height", y_span_num + "px" );
            $cell.css ( "line-height", y_span_num + "px" );
            $y_num_container.append ( $cell );
        }
        for ( var i = 0; i < x_arr.length; i++ ) {
            $x_num_container.find ( "div" ).eq ( i ).text ( x_arr[ i ] );
        }
        for ( var i = 0; i < y_arr.length; i++ ) {
            $y_num_container.find ( "div" ).eq ( y_CI_num - 1 - i ).text ( y_arr[ i ] );
        }

        var width_num = $y_num_container.innerWidth ();
        $y_num_container.css ( "left", canvas_begin_x_num + begin_x_num + 5 - width_num + "px" );
        $x_num_container.css ( "top", canvas_begin_y_num + begin_y_num + height_num - 5 );
    },
    open: function ( str ) {
        switch ( str ) {
            case "axis": {
                this.status.axis = 1;
                break;
            }
            case "dashed": {
                this.status.dashed = 1;
                break;
            }
            case "data": {
                this.status.data = 1;
                break;
            }
            case "num": {
                this.status.num = 1;
                break;
            }
            case "block": {
                this.status.block = 1;
                break;
            }
            default: {
                break;
            }
        }

        this.show ();
    },
    close: function ( str ) {
        switch ( str ) {
            case "axis": {
                this.status.axis = 0;
                break;
            }
            case "dashed": {
                this.status.dashed = 0;
                break;
            }
            case "data": {
                this.status.data = 0;
                break;
            }
            case "num": {
                this.status.num = 0;
                break;
            }
            case "block": {
                this.status.block = 0;
                break;
            }
            default: {
                break;
            }  
        }

        this.show ();
    },
    openAll: function () {
        this.status.axis = 1;
        this.status.dashed = 1;
        this.status.data = 1;
        this.status.num = 1;
        this.status.block = 1;

        this.show ();
    },
    closeAll: function () {
        this.status.axis = 0;
        this.status.dashed = 0;
        this.status.data = 0;
        this.status.num = 0;
        this.status.block = 0;

        this.show ();
    },
    get: function ( id_str ) {
        var data_list_arr = this.data_list;
        
        for ( var i = 0; i < data_list_arr.length; i++ ) {
            var id_save_str = data_list_arr[ i ].id;
            if ( id_save_str == id_str )
                {
                    return data_list_arr[ i ];
                }
        }

        return false;
    },
    addTo: function ( $element ) {
        var $canvas_arr = new Array ();

        for ( var i = 0; i <= 3; i++ ) {
            $canvas_arr[ i ] = $ ( "<canvas style='position:absolute' ></canvas>" );
        }
        
        for ( var i = 0; i < $canvas_arr.length; i++ ) {
            $element.append ( $canvas_arr[ i ] );
            $canvas_arr[ i ][ 0 ].width = this.canvas_width;
            $canvas_arr[ i ][ 0 ].height = this.canvas_height;
            $canvas_arr[ i ].css ( "left", this.canvas_position_x + "px" );
            $canvas_arr[ i ].css ( "top", this.canvas_position_y + "px" );
        }
        
        this.ctx = $canvas_arr[ 0 ][ 0 ].getContext ( "2d" );
        this.ctx2 = $canvas_arr[ 1 ][ 0 ].getContext ( "2d" );
        this.ctx3 = $canvas_arr[ 2 ][ 0 ].getContext ( "2d" );
        this.container = $element;
    }
}

/************/



/**************/

/*滚动条*/



function getData (palm) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState==4) 
        {    
          if ((xhr.status>=200&&xhr.status<300)||xhr.status == 304)
              {   
                palm.success(xhr);
              }
           else 
              {
                palm.fail(xhr);
              }
        }
  }
  if (palm.metho=="GET"||palm.metho=="get")
      {
          xhr.open(palm.metho,palm.url,true);
          if(palm.header)
              {
                for (var i=0;i<palm.header.length;i++)
                {
                    xhr.setRequestHeader(palm.header[i].name,palm.header[i].content)
                };
              };
          if (palm.beforeSend)
              {
                  palm.beforeSend();
              };
          xhr.send(null);
      }
  else
      {
          xhr.open(palm.metho,palm.url,true);
          if(palm.header)
              {
                for (var i=0;i<palm.header.length;i++)
                {
                    xhr.setRequestHeader(palm.header[i].name,palm.header[i].content)
                };
              };
          var str = null;
          if (palm.Parameters!=undefined)
              {
                  str = JSON.stringify(palm.Parameters);     
              };
          if(palm.beforeSend)
              {
                  palm.beforeSend();
              }
          xhr.send(str);
      }
};



function select_box () {
    var $select = $(".ZKJ-select");
    var $option = $(".ZKJ-option");
}


function create_graph2 () {
                 var $graph_container = $(".graph-container2");
                 var Arr = new Array();
                 for (var i = 0;i<$graph_container.length;i++)
                     {   
                         var $graph_container_a = $graph_container.eq(i);
                         var newObj = new draw_graph2($graph_container_a);
                         Arr.push(newObj);
                     };
                 this.rePain = function () {
                     for (var i = 0;i<Arr.length;i++)
                         {
                             Arr[i].rePain();
                         }
                 }
             };


function draw_graph2 ($graph_container)
    {
            var $canvas = $("<canvas></canvas>");
            var $graph_container_b = $graph_container;
            var d = $graph_container.attr("data-d");
            var json = JSON.parse($graph_container.attr("data-JSON"));
            $canvas.attr("width",d);
            $canvas.attr("height",d);
            $graph_container.append($canvas);
            var begin = 0;
            var ctx = $canvas[0].getContext("2d");
            for (var a = 0;a<json.data.length;a++)
                {  
                  ctx.beginPath();
                  ctx.fillStyle = json.data[a].color;
                  ctx.arc(0.5*parseFloat(d),0.5*parseFloat(d),0.5*parseFloat(d),begin,Math.PI*2*json.data[a].percentage+begin);
                  ctx.lineTo(0.5*parseFloat(d),0.5*parseFloat(d));
                  ctx.closePath();
                  ctx.fill();
                  begin = begin+Math.PI*2*json.data[a].percentage;
                };
            this.rePain = function () {
                var ctx = $canvas[0].getContext("2d");
                ctx.clearRect(0,0,$canvas[0].width,$canvas[0].height);
                var d = $graph_container_b.attr("data-d");
                var json = JSON.parse($graph_container_b.attr("data-JSON"));
                $canvas.attr("width",d);
                $canvas.attr("height",d);
                var begin = 0;
                var ctx = $canvas[0].getContext("2d");
                for (var a = 0;a<json.data.length;a++)
                    {  
                      ctx.beginPath();
                      ctx.fillStyle = json.data[a].color;
                      ctx.arc(0.5*parseFloat(d),0.5*parseFloat(d),0.5*parseFloat(d),begin,Math.PI*2*json.data[a].percentage+begin);
                      ctx.lineTo(0.5*parseFloat(d),0.5*parseFloat(d));
                      ctx.closePath();
                      ctx.fill();
                      begin = begin+Math.PI*2*json.data[a].percentage;
                    };
            };
    }

             
function draw_graph3($graph_container,line) {
                 this.name = $graph_container.attr("data-id");
                 var width = parseFloat($graph_container.attr("data-width"));
                 var height = parseFloat($graph_container.attr("data-height"));
                 var fraction = parseFloat($graph_container.attr("data-people-fraction"));
                 var timeRange = parseFloat($graph_container.attr("data-time-range"));
                 var createCanvas = "<canvas width='"+(width+10)*0.5+"' height='"+(height+10)*0.5+"' style='position:absolute; top:0px; left:0px'></canvas>";
                 var $canvas = $(createCanvas);
                 $graph_container.prepend($canvas);
                 var thisObj = this;
                 this.ctx = $canvas[0].getContext("2d");
                 this.ctx.scale(0.5, 0.5);
                 this.ctx.beginPath();
                 this.ctx.moveTo(5,5);
                 this.ctx.lineTo(5,height+5);
                 this.ctx.lineTo(width+5,height+5);
                 this.ctx.moveTo(5,5);
                 this.ctx.lineTo(0,10);
                 this.ctx.moveTo(5,5);
                 this.ctx.lineTo(10,10);
                 this.ctx.moveTo(width+5,height+5);
                 this.ctx.lineTo(width,height);
                 this.ctx.moveTo(width+5,height+5);
                 this.ctx.lineTo(width,height+10); 
                 this.ctx.fillStyle = "#def0f4";
                 var fraction_x = width/(timeRange+1);
                 var fraction_y = height/(fraction+1);
                 if (line)
                     {   
                         for (var i = 1;i<fraction+1;i++)
                             {  
                                if (i%2==0)
                                    {   

                                    }
                                else
                                    {
                                         this.ctx.fillStyle = "#e6efee"
                                         this.ctx.fillRect(5,5+fraction_y*i,width,fraction_y);
                                    }
                             };
                     }
                 else
                     {
                         for (var i = 1;i<fraction+1;i++)
                             {
                                this.ctx.moveTo(5,5+fraction_y*i);
                                this.ctx.lineTo(5,5+fraction_y*i);
                             };
                     };
                 this.ctx.stroke();
                 this.rePain = function () {
                     var width = parseFloat($graph_container.attr("data-width"));
                     var height = parseFloat($graph_container.attr("data-height"));
                     var fraction = parseFloat($graph_container.attr("data-people-fraction"));
                     var timeRange = parseFloat($graph_container.attr("data-time-range"));
                     thisObj.ctx.clearRect(0,0,width*2,height*2);
                     $canvas[0].width = (width+10)*0.5;
                     $canvas[0].height = (height+10)*0.5;
                     thisObj.ctx.scale(0.5, 0.5);
                     thisObj.ctx.beginPath();
                     thisObj.ctx.moveTo(5,5);
                     thisObj.ctx.lineTo(5,height+5);
                     thisObj.ctx.lineTo(width+5,height+5);
                     thisObj.ctx.moveTo(5,5);
                     thisObj.ctx.lineTo(0,10);
                     thisObj.ctx.moveTo(5,5);
                     thisObj.ctx.lineTo(10,10);
                     thisObj.ctx.moveTo(width+5,height+5);
                     thisObj.ctx.lineTo(width,height);
                     thisObj.ctx.moveTo(width+5,height+5);
                     thisObj.ctx.lineTo(width,height+10); 
                     thisObj.ctx.fillStyle = "#def0f4";
                     var fraction_x = width/(timeRange+1);
                     var fraction_y = height/(fraction+1);
                     if (line)
                         {   
                             for (var i = 1;i<fraction+1;i++)
                                 {  
                                    if (i%2==0)
                                        {   

                                        }
                                    else
                                        {
                                             thisObj.ctx.fillStyle = "#e6efee";
                                             thisObj.ctx.fillRect(5,5+fraction_y*i,width,fraction_y);
                                        }
                                 };
                         }
                     else
                         {
                             for (var i = 1;i<fraction+1;i++)
                                 {
                                    thisObj.ctx.moveTo(5,5+fraction_y*i);
                                    thisObj.ctx.lineTo(5,5+fraction_y*i);
                                 };
                         };
                     thisObj.ctx.stroke();
                 }
                 this.createNew = function () {
                     var $newCanvas = $("<canvas width='"+(width+10)*0.5+"' height='"+(height+10)*0.5+"' style='position:absolute; top:0px; left:0px'></canvas>");
                     $graph_container.append($newCanvas);
                     var ctx = $newCanvas[0].getContext("2d");
                     return ctx;
                 }; 
             };



function get_max_nb (data) {
    var nb = 0;
    for (var i=0;i<data.length;i++)
        {
            if(parseFloat(data[i])>nb)
                {
                    nb = parseFloat(data[i]);
                };
        }
    return nb;
}


function next_date(year,month,date)
    {    
        var new_year = year,new_month = month,new_date = date;
        if(month=="01"||month=="03"||month=="05"||month=="07"||month=="08"||month=="10"||month=="12")
            {
                if(date=="31")
                    {
                        new_date = 1;
                        if(month=="12")
                            {
                                new_month = 1;
                                new_year = parseFloat(year)+1;
                            }
                        else
                            {
                                 new_month = parseFloat(month);    
                            }
                    }
                else 
                    {
                        new_date = parseFloat(date)+1;
                    }
            }
       else if(month=="04"||month=="06"||month=="09"||month=="11")
           {
               if(date=="30")
                    {
                        new_date = 1;
                        new_month = parseFloat(month);    
                    }
                else 
                    {
                        new_date = parseFloat(date)+1;
                        
                    }
           }
       else if (month=="02")
           {
                if(parseFloat(year)%4==0)
                    {
                        if (date=="29")
                            {
                                new_date = 1;
                                new_month = parseFloat(month); 
                            }
                        else 
                            {
                                new_date = parseFloat(date)+1;
                            }
                    }
                else
                    {
                        if (date=="28")
                            {
                                new_date = 1;
                                new_month = parseFloat(month); 
                            }
                        else 
                            {
                                new_date = parseFloat(date)+1;
                            }  
                    }
           };
      if(parseFloat(new_date)<10)
          {
              new_date = "0"+parseFloat(new_date);
          };
      if(parseFloat(new_month)<10)
          {
              new_month = "0"+parseFloat(new_month);
          }
      var full_date = new_year+"-"+new_month+"-"+new_date;
      return full_date;
    }


    function compare_date(date1,date2)
        {
            var date1Arr = date1.split("-");
            var date2Arr = date2.split("-");
            if( parseFloat ( date1Arr[0] ) == parseFloat ( date2Arr[ 0 ] ))
                {
                    if( parseFloat ( date1Arr[ 1 ] ) == parseFloat ( date2Arr[ 1 ] ) )
                        {    
                            if( parseFloat ( date1Arr[ 2 ] ) == parseFloat ( date2Arr[ 2 ] ) )
                                {
                                    return 0; 
                                }
                            else if (parseFloat(date1Arr[2])>parseFloat(date2Arr[2]))
                                {
                                    return 1;
                                }
                            else if (parseFloat(date1Arr[2])<parseFloat(date2Arr[2]))
                                {
                                    return 2;
                                }
                        } 
                    else if(parseFloat(date1Arr[1])>parseFloat(date2Arr[1]))
                        {
                            return 1;
                        } 
                    else if (parseFloat(date1Arr[1])<parseFloat(date2Arr[1]))
                        {
                            return 2;
                        }
                }
            else if(parseFloat(date1Arr[0])>parseFloat(date2Arr[0]))
                {
                    return 1;
                }
            else if(parseFloat(date1Arr[0])<parseFloat(date2Arr[0]))
                {
                    return 2;
                }
        }


function belong_array(item,array)
    { 
        for(var i=0;i<array.length;i++)
            {
                if(item==array[i])
                    {
                        return true;
                    }
            }
        return false;
    }


/*滑********块 开始*/
 //定义全局变量,记录鼠标按下的是哪一个滑块及鼠标按下时鼠标指针的clientX和clientY值
            var slider_on_global = {
               element:null,
               beginX:0,
               beginY:0,
            };

            var $sliderContainers = $(".ZKJ-slider"); 
      //定义滑块对象的构造函数;
            function ZKJ_slider (option) {
                this.$element = option.$element;
                var ajustment = option.ajustment;
                var leadLong = option.long;//初始化滑块导轨的长度值(要用到this.setLong())
                var value = option.value;//滑块总的value值
                var current_value = 0;//滑块当前的value值
                var thisObj = this;
                var direction = option.direction;//滑块的方向，V代表垂直，H代表横向
                var slider_name = this.$element.attr("data-slider-name");//滑块的名称
                var slider_lead = this.$element.attr("data-slider-lead-name");//导轨的名称
                var $slider = $("<div style='position:absolute;top:0px;cursor:pointer;' id='"+slider_name+"'></div>");//用div元素创建滑块,id为slider_name值
                var $slider_cover = $('<div class="slider-cover" style="width:1000%;height:140%;position:absolute;top:-20%;left:-450%;display:none;"></div>');
                var $slider_lead = $("<div style='position:relative' id='"+slider_lead+"'></div>");//用div元素创建导轨，id为slider_lead值 
                var mousedown_clientX;
                var mousedown_clientY;
                var step = option.step;
                var changeListeners = new Array();//change事件列表,当滑块的currentvalue值改变时会触发change事件
                var runChangeListeners = function (value) {
                  for(var i=0;i<changeListeners.length;i++)
                      {
                        changeListeners[i](value);
                      }
                };

                this.getDirection = function () {return direction;};
                this.getLeadLong = function () {return leadLong;};
                this.getValue = function () {return value;};
                this.getCurrentValue = function () {return current_value;};
                this.setValue = function (newValue) {value = newValue;};
                this.setCurrentValue = function (newCurrentValue){current_value = newCurrentValue;};
                //添加change事件函数，当change事件触发后，被添加的所有change事件函数会按添加的顺序运行
                this.change = function (listener) {
                    if(listener)
                        {
                            changeListeners.push(listener);
                        }
                    else
                        {
                            runChangeListeners(current_value);
                        }
                };
                //改变导轨长度
                this.setLong = function (newLeadLong) {
                    leadLong = newLeadLong;
                    if(direction=="H")
                        {
                            $slider_lead.css("width",leadLong+"px");
                        }
                    else if (direction == "V")
                        {
                            $slider_lead.css("height",leadLong+"px");
                        }
                };
                //根据滑块的currentvalue移动滑块
                this.move = function () {
                    if(direction == "H")
                        {
                            $slider.css("left",(current_value/value)*100+"%"); 
                        }
                    else if (direction == "V")
                        {
                          $slider.css("top",(current_value/value)*100+"%");
                        };
                    runChangeListeners(current_value);
                };
                //让滑块作为滚动条
                this.setScroll = function ($element) {
                    var $view = $element;
                    thisObj.change(function (value) {
                        var height = $view.children(".content-container").height()-$view.height();
                        var top = "-"+height*(value/100)+"px";
                        $view.children(".content-container").css("top",top);
                    })
                };
                this.getSlider_cover = function () {
                    return $slider_cover;
                };

                (function () {
                    var nb = Math.floor(value/step);
                    var long = leadLong/nb;
                    if(direction=="H")
                        {
                          for (var i=0;i<=nb;i++)
                                {
                                    var $div = $("<div style='height:100%;width:"+long+"px"+"'></div>");

                                    $div.attr("data-value",(step*i).toString());
                                    $div.css("float","left");
                                    $slider_lead.append($div);
                                }
                        }  
                    else if (direction=="V")
                       {
                              for (var i=0;i<=nb;i++)
                                {
                                    var $div = $("<div style='width:100%;height:"+long+"px"+"'></div>");

                                    $div.attr("data-value",(step*i).toString());
                                    $slider_lead.append($div);
                                }
                       }
                })();
                
                $slider_lead.append($slider_cover).append($slider);
                this.$element.append($slider_lead);
                this.change(option.change);
                this.setLong(leadLong);
                
                $slider_lead.mousedown(function (e) {
                  if(e.target==$slider[0])
                      {
                          return;    
                      }
                  var current_value = parseFloat($(e.target).attr("data-value"));
                      thisObj.setCurrentValue(current_value);
                      thisObj.move();
                });

                $slider.mousedown(function (e) {
                   slider_on_global.element = thisObj;
                   slider_on_global.beginX = e.clientX;
                   slider_on_global.beginY = e.clientY;
                   $slider_cover.css("display","block");
                });
            };
            
            $(window).mousemove(function (e) {
              if(slider_on_global.element)
                  {
                        var obj = slider_on_global.element;
                        if(obj.getDirection() =="H")
                            {   
                              var advance = parseFloat(e.clientX)-parseFloat(slider_on_global.beginX);
                              slider_on_global.beginX = e.clientX;
                              var leadLong = obj.getLeadLong();
                              var value = obj.getValue();
                              var current_value = obj.getCurrentValue();
                              current_value += advance/leadLong*value;
                              if(current_value>=obj.getValue())
                                  {
                                    current_value = obj.getValue();
                                  }
                              else if(current_value<=0)
                                  {
                                    current_value = 0;
                                  };
                              obj.setCurrentValue(current_value);
                              obj.move();
                            }
                        else if (obj.getDirection() == "V")
                            {   
                              var advance = parseFloat(e.clientY)-parseFloat(slider_on_global.beginY);
                                  slider_on_global.beginY = e.clientY;
                              var leadLong = obj.getLeadLong();
                              var value = obj.getValue();
                              var current_value = obj.getCurrentValue();
                                  current_value += advance/leadLong*value;
                              if(current_value>=obj.getValue())
                                  {
                                    current_value = obj.getValue();
                                  }
                              else if(current_value<=0)
                                  {
                                    current_value = 0;
                                  };
                                  obj.setCurrentValue(current_value);
                                  obj.move();
                            }
                  }
            });
            $(window).mouseup(function () {
              if(slider_on_global.element)
                  { 
                    slider_on_global.element.getSlider_cover().css("display","none");
                    slider_on_global.element = null;
                    slider_on_global.switch = "off";
                  }
            });
  /*滑********块 结束*/


  function calendar ( lines_nb_num, year_num, month_num, date_num, day_num ) {
      var thisObj = this,
          Obj_obj = {},
          calendar_arr = Obj_obj.calendar = [],
          length_num = lines_nb_num*7,
          currentDay_obj = {
              year: year_num,
              month: month_num,
              date: date_num,
              day: day_num
          }

      Obj_obj.type = calendar.getType ( month_num );
      Obj_obj.month = month_num;
      Obj_obj.year = year_num;
      Obj_obj.length = length_num;
      Obj_obj.calendar = calendar.getMonth ( currentDay_obj, length_num );

      this.fullYearCalendar = calendar.getFullYear(Obj_obj);
      this.length = length_num;
  }

  calendar.prototype = {
      getNestYear: function () {
          var fullMonth_obj = calendar.getNestFullMonth ( this.fullYearCalendar[ 11 ] );
          var day_obj = fullMonth_obj.calendar[ fullMonth_obj.calendar.length - 1 ];
          var nestYear_obj = new calendar ( this.length/7, day_obj.year, day_obj.month, day_obj.date, day_obj.day );

          return nestYear_obj;
      },
      getPreYear: function () {
          var fullMonth_obj = calendar.getPreFullMonth ( this.fullYearCalendar[ 0 ] );
          var day_obj = fullMonth_obj.calendar[ 0 ];
          var preYear_obj = new calendar ( this.length/7, day_obj.year, day_obj.month, day_obj.date, day_obj.day );

          return preYear_obj;
      }
  }

  calendar.getFullDate = function ( day_obj, operator_str ) {
      var date_str = day_obj.year + operator_str + day_obj.month + operator_str + day_obj.date;

      return date_str;
  }

  calendar.getDayObj = function ( fullDate_str, operator_str ) {
      var year_num = parseFloat( fullDate_str.split ( operator_str )[ 0 ] ),
          month_num = parseFloat( fullDate_str.split ( operator_str )[ 1 ] ),
          date_num = parseFloat( fullDate_str.split ( operator_str )[ 2 ] ),
          day_num = ( new Date ( year_num, month_num, date_num, 0, 0, 0, 0 ) ).getDay (),
          returnData_obj = {
              year: year_num,
              month: month_num,
              date: date_num,
              day: day_num
          };

      return returnData_obj; 
  }
  
  calendar.getType = function ( month_num ) {
      var big_month_arr = [1,3,5,7,8,10,12];
          small_month_arr = [2,4,6,9,11];
      
      return belong_array(month_num,big_month_arr)?1:(month_num==2)?3:2;
  }

  calendar.getMonth = function ( currentDay_obj, length_num ) {
      var fullMonth_arr = [];
          fullMonth_arr[0] = calendar.getFirstDay ( currentDay_obj );

      for ( var i = 1; i < length_num; i++ ) {
          fullMonth_arr[i] = calendar.getNestDay ( fullMonth_arr[i-1] );
      }

      return fullMonth_arr;
  }

  calendar.getFirstDay = function ( currentDay_obj ) {
      var day_save_obj = currentDay_obj;
      for ( i = currentDay_obj.date; i > 1; i-- ) {
          day_save_obj = calendar.getPreDay ( day_save_obj );
      }

      var currentDate_num = day_save_obj.date,
          currentDay_num = day_save_obj.day,
          currentMonth_num = day_save_obj.month,
          currentYear_num = day_save_obj.year,
          big_month_arr = [1,3,5,7,8,10,12],
          firstDay_obj = {};

      if ( currentDay_num == 0 ) {
          return {
              year: currentYear_num,
              month: currentMonth_num,
              date: currentDate_num,
              day: currentDay_num
          };
      }
      else {
          firstDay_obj.day = 0;
          firstDay_obj.year = currentYear_num;
          firstDay_obj.month = currentMonth_num-1;

          if ( currentMonth_num == 3 ) {       
              if ( calendar.isLeapYear ( currentYear_num ) ) {
                  firstDay_obj.date = 29 - (currentDay_num-1);
                  return firstDay_obj
              }
              else {
                  firstDay_obj.date = 28 - (currentDay_num-1);
                  return firstDay_obj
              }
          }
          else if ( currentMonth_num == 1 ) {
              firstDay_obj.year = currentYear_num-1;
              firstDay_obj.month = 12;
              firstDay_obj.date = 31 - ( currentDay_num-1 );
              return firstDay_obj;
          }
          else if ( belong_array( currentMonth_num, big_month_arr ) ) {   
              firstDay_obj.date =  currentMonth_num == 8 ? 31 - ( currentDay_num-1 ) : 30 - ( currentDay_num-1 );
              return firstDay_obj;
          }
          else {
              firstDay_obj.date = 31 - ( currentDay_num-1 );
              return firstDay_obj;
          }
      }   
  }

  calendar.getPreDay = function ( currentDay_obj ) {
      var currentDate_num = currentDay_obj.date,
          currentDay_num = currentDay_obj.day,
          currentMonth_num = currentDay_obj.month,
          currentYear_num = currentDay_obj.year,
          big_month_arr = [1,3,5,7,8,10,12],
          preDay_obj = {
              year: currentYear_num,
              month: currentMonth_num,
              date: currentDate_num-1,
              day : calendar.getPreWeekDay ( currentDay_num )
          }; 
      
      if ( currentDate_num == 1 ) {
          preDay_obj.month = currentMonth_num - 1;
          if ( currentMonth_num == 3 ) {
              preDay_obj.date = calendar.isLeapYear( currentYear_num )?29:28;
              return preDay_obj;
          }
          else if ( currentMonth_num == 1 ) {
              preDay_obj.year = currentYear_num - 1;
              preDay_obj.month = 12;
              preDay_obj.date = 31;
              return preDay_obj;
          }
          else if ( belong_array ( currentMonth_num, big_month_arr ) ) {
              preDay_obj.date = currentMonth_num == 8?31:30;
              return preDay_obj;
          }
          else {
              preDay_obj.date = 31;
              return preDay_obj;
          }
      }
      else {
          return preDay_obj
      }
  }

  calendar.getPreWeekDay = function ( weekDay_num ) {
      if ( weekDay_num == 0 ) {
          return 6
      }
      else {
          return weekDay_num-1;
      }
  }

  calendar.isLeapYear = function ( year_num ) {
      if ( year_num % 4 == 0 ) {
          if ( year_num % 100 == 0 && year_num % 400 != 0 ) {
              return false;
          }  
          else if ( year_num % 3200 == 0 ) {
              return false;
          }
          else {
              return true;
          }
      }
      else {
          return false;
      }
  }

  calendar.getNestDay = function ( currentDay_obj ) {
      var currentDate_num = currentDay_obj.date,
          currentDay_num = currentDay_obj.day,
          currentMonth_num = currentDay_obj.month,
          currentYear_num = currentDay_obj.year,
          big_month_arr = [1,3,5,7,8,10,12],
          nestDay_obj = {
              year: currentYear_num,
              month: currentMonth_num,
              date: currentDate_num + 1,
              day : calendar.getNestWeekDay ( currentDay_num )
          };

      if ( currentDate_num == 28 && currentMonth_num == 2 && !calendar.isLeapYear ( currentYear_num ) ) {
          nestDay_obj.month = 3;
          nestDay_obj.date = 1;
      }
      else if ( currentDate_num == 29 && currentMonth_num == 2 && calendar.isLeapYear ( currentYear_num ) ) {
          nestDay_obj.month = 3;
          nestDay_obj.date = 1;
      }
      else if ( !belong_array ( currentMonth_num, big_month_arr ) && currentDate_num == 30 ) {
          nestDay_obj.month = currentMonth_num + 1;
          nestDay_obj.date = 1;
      }
      else if ( belong_array ( currentMonth_num, big_month_arr ) && currentDate_num == 31 ) {
          if ( currentMonth_num == 12 ) {
              nestDay_obj.month = 1;
              nestDay_obj.date = 1;
              nestDay_obj.year = currentYear_num + 1;
          }
          else {
              nestDay_obj.month = currentMonth_num + 1;
              nestDay_obj.date = 1;
          }
      }

      return nestDay_obj;
  }

  calendar.getNestWeekDay = function ( weekDay_num ) {
      return weekDay_num == 6?0:weekDay_num+1;
  }

  calendar.getFullYear = function ( currentMonth_obj ) {
      var fullYear_arr = [];

      fullYear_arr[0] = calendar.getFirstFullMonth ( currentMonth_obj );

      for ( var i = 1; i<12; i++ ) {
          fullYear_arr[i] = calendar.getNestFullMonth ( fullYear_arr[ i - 1 ] );
      }

      return fullYear_arr;
  }

  calendar.getFirstFullMonth = function ( currentMonth_obj ) {
      var monthSave_obj = currentMonth_obj;    
  
      if ( currentMonth_obj.month == 1 ) {
          return currentMonth_obj;
      }
      else {
          for ( var i = currentMonth_obj.month; i > 1; i++ ) {
              monthSave_obj = calendar.getPreFullMonth( monthSave_obj );
          }
      }

      return monthSave_obj;
  }
  
  calendar.getPreFullMonth = function ( currentMonth_obj ) {
      var currentMonthType_num = currentMonth_obj.type,
          currentMonthMonth_num = currentMonth_obj.month,
          currentMonthLength_num = currentMonth_obj.length,
          currentMonthYear_num = currentMonth_obj.year,
          currentMonthCalendar_arr = currentMonth_obj.calendar,
          preFullMonth_obj = {
              type: calendar.getType ( currentMonthMonth_num - 1 ),
              month: currentMonthMonth_num - 1,
              year: currentMonthYear_num,
              length: currentMonthLength_num,
              calendar: calendar.getMonth ( calendar.getPreDay ( currentMonthCalendar_arr[ 0 ] ), currentMonthLength_num )
          };

      if ( currentMonthMonth_num == 1 ) {
          preFullMonth_obj.month = 12;
          preFullMonth_obj.type = 1;
          preFullMonth_obj.year = currentMonthYear_num - 1;
      }

      return preFullMonth_obj;
  }

  calendar.getNestFullMonth = function ( currentMonth_obj ) {
      var currentMonthType_num = currentMonth_obj.type,
          currentMonthMonth_num = currentMonth_obj.month,
          currentMonthLength_num = currentMonth_obj.length,
          currentMonthYear_num = currentMonth_obj.year,
          currentMonthCalendar_arr = currentMonth_obj.calendar,
          nestFullMonth_obj = {
              type: calendar.getType ( currentMonthMonth_num + 1 ),
              month: currentMonthMonth_num + 1,
              year: currentMonthYear_num,
              length: currentMonthLength_num,
              calendar: calendar.getMonth ( calendar.getNestDay ( currentMonthCalendar_arr[ currentMonthCalendar_arr.length - 1 ] ), currentMonthLength_num )
          };

      if ( currentMonthMonth_num == 12 ) {
          nestFullMonth_obj.month = 1;
          nestFullMonth_obj.type = 1;
          nestFullMonth_obj.year = currentMonthYear_num + 1;
      }

      return nestFullMonth_obj;
  }

/********/
function loading ( init ) {
    var $body = $ ( "body" ),
        $canvas = this.$canvas = $ ( "<canvas width='100%' height='100%' style='position:absolute;left:-50%;top:-50%'></canvas>" ),
        $loading_container = this.$loading_container = $ ( "<div style='width:100%;height:800px;position:absolute;top:0px;left:0px;background:black;opacity:0.9;display:none;z-index:100000'></div>" ),
        $canvas_container = $ ( "<div style='position:absolute; top:50%;left:50%'></div>" ),
        SC_r_num =  this.SC_r = init.SC_r ? init.SC_r : 80,
        r_num = this.r = init.r ? init.r : 10,
        BC_r_num = this.BC_r = init.BC_r ? init.BC_r : 13,
        n_num = this.n = init.n ? init.n : 10,
        k_num = this.k = 2 * Math.PI / n_num,
        x_num = this.x = 0,
        ctx = this.ctx = $canvas[ 0 ].getContext ( "2d" );

    $canvas_container.css ( "width", SC_r_num * 2 + BC_r_num * 2 + "px" );
    $canvas_container.css ( "height", SC_r_num * 2 + BC_r_num * 2 + "px" );
    $canvas[ 0 ].width = SC_r_num * 2 + BC_r_num * 2 + "";
    $canvas[ 0 ].height = SC_r_num * 2 + BC_r_num * 2 + "";
    $body.append ( $loading_container );
    $loading_container.append ( $canvas_container );
    $canvas_container.append ( $canvas );
}

loading.prototype.open = function () {
    var pain_fun = this.pain,
        thisObj = this;
    
    this.$loading_container.show ();
    this.interval =  setInterval ( function () {
        pain_fun.call ( thisObj, thisObj.x );
        thisObj.x += 1;    
    }, 100 )
}
loading.prototype.close = function () {
    clearInterval ( this.interval );
    this.x = 0;
    this.$loading_container.hide ();
}
loading.prototype.pain = function ( p_num ) { 
    var k_num = this.k,
        r_num = this.r,
        n_num = this.n,
        ctx = this.ctx;
        BC_r_num = this.BC_r,
        SC_r_num = this.SC_r,
        center_x_num = SC_r_num + BC_r_num,
        center_y_num = SC_r_num + BC_r_num,
        width_num = this.$canvas[ 0 ].width,
        height_num = this.$canvas[ 0 ].height;
        
    ctx.clearRect (0, 0, width_num, width_num );
    ctx.fillStyle = "white";
    for ( var i = 0; i < n_num; i++ ) {
        var x_num = center_x_num + SC_r_num * Math.cos ( k_num * i );
        var y_num = center_y_num - SC_r_num * Math.sin ( k_num * i );
        if ( p_num % n_num == i ) {
            var c_r_num = BC_r_num; 
        }
        else {
            var c_r_num = r_num; 
        };
        
        ctx.beginPath ();
        ctx.arc ( x_num, y_num, c_r_num, 0, 2 * Math.PI );
        ctx.fill ();
    }
}
/*********/

function setVCenter () {
    var $element_arr = $ ( ".v-center" );
        
    for ( var i = 0; i < $element_arr.length; i++ ) {
        var height_num = $element_arr[ i ].offsetHeight;

        $element_arr.eq ( i ).css ( "line-height", height_num + "px" );
    } 
}

/*********/