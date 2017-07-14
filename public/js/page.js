/********/
var $graph_axis = $ ( "#time-vs-people .data-field .axis" ),
    $graph_dashed = $ ( "#time-vs-people .data-field .view .dashed" ),
    $graph_data = $ ( "#time-vs-people .data-field .view .data" ),
    $advance_btn = $ ( "#time-vs-people .advance" ),
    $back_btn = $ ( "#time-vs-people .back" ),
    canvas_width_num =  $graph_axis.width (),
    canvas_height_num = $graph_axis.height (),
    today_str = ( new Date () ).getFullYear () + "-" + ( ( new Date () ).getMonth () + 1 ) + "-" + ( new Date () ).getDate (),
    yesterday_str = calendar.getFullDate ( calendar.getPreDay ( calendar.getDayObj ( today_str, "-" ) ), "-" ),
    today_visits_save_obj = {},
    today_visits_obj = {},
    yesterday_visits_obj = {},
    g_axis_obj = new graph ( {
        canvas_width: canvas_width_num,
        canvas_height: canvas_height_num,
        width: 600,
        height: 200,
        x_CI: 24,
        y_CI: 10,
        position_x: 30,
        position_y: 25,
        field: {
            width: 576,
            height: 182
        }
    } ),
    g_dashed_obj = new graph ( {
        canvas_width: canvas_width_num * 2,
        canvas_height: canvas_height_num * 2,
        width: 2400,
        height: 400,
        x_CI: 48,
        y_CI: 10,
        position_x: 65,
        position_y: 45,
        field: {
            width: 2304,
            height: 364
        }
    } ),
    g_data_obj = new graph ( {
        canvas_width: canvas_width_num * 2,
        canvas_height: canvas_height_num * 2,
        width: 1200,
        height: 200,
        x_CI: 48,
        y_CI: 10,
        position_x: 30,
        position_y: 25,
        field: {
            width: 1152,
            height: 182
        }    
    } );

g_axis_obj.addTo ( $graph_axis );
g_axis_obj.open ( "axis" );
g_axis_obj.open ( "num" );
g_axis_obj.setnum_x ( ["0:00", " ", "1:00", " ", "2:00", " ", "3:00", " ", "4:00", " ", "5:00", " ", "6:00", " ", "7:00", " ", "8:00", " ", "9:00", " ", "10:00", " ", "11:00", " ", "12:00"] );
g_axis_obj.setnum_y ( [ " ", "2", " ", "4", " ", "6", " ", "8", " ", "10" ] );

g_dashed_obj.addTo ( $graph_dashed );
g_dashed_obj.ctx.scale ( 0.5, 0.5 );
g_dashed_obj.open ( "dashed" );

g_data_obj.addTo ( $graph_data );
g_data_obj.open ( "data" );
g_data_obj.open ( "block" );

getVisits ( today_str, today_visits_obj, function () { 
    today_visits_obj.data.strokeStyle = "red";
    today_visits_obj.data.fillStyle = "red";
    initVisits ( today_visits_obj.data ); 
    if ( today_visits_obj.data ) {
        today_visits_save_obj.data = today_visits_obj.data
    }
} );

getVisits ( yesterday_str, yesterday_visits_obj, function () { 
    yesterday_visits_obj.data.strokeStyle = "blue";
    yesterday_visits_obj.data.fillStyle = "blue";
    initVisits ( yesterday_visits_obj.data ); 
}, 48 );

$advance_btn.click( function () { graphScroll ( "advance" ) } );
$back_btn.click ( function () { graphScroll ( "back" ) } );

function graphScroll ( type_str ) {
    var $graph_dashed = $ ( "#time-vs-people .data-field .view .dashed" ),
        $graph_data = $ ( "#time-vs-people .data-field .view .data" ),
        block_width_num = $ ( "#time-vs-people" ).width (),
        origin_left_num = 0 - ( block_width_num * 0.872727273 * 0.0625 ), 
        axis_start_num = parseFloat ( $graph_dashed.attr ( "data-x-axis-start" ) );

    if ( type_str == "advance" ) {
        if ( axis_start_num == 12 ) {
            return;
        }
        axis_start_num += 1;
        var move_distance_num = origin_left_num - ( g_axis_obj.field.width * 2 / g_axis_obj.x_CI ) * axis_start_num;   
        
        $graph_dashed.animate ( { left: move_distance_num + "px" }, 500 );
        $graph_data.animate ( { left: move_distance_num + "px" }, 500 );
    }
    else if ( type_str == "back" ) {
        if ( axis_start_num == 0 ) {
            return;
        }
        axis_start_num -= 1;
        var move_distance_num = origin_left_num - ( g_axis_obj.field.width * 2 / g_axis_obj.x_CI ) * axis_start_num;

        $graph_dashed.animate ( { left: move_distance_num + "px" }, 500 );
        $graph_data.animate ( { left: move_distance_num + "px" }, 500 );
    }

    $graph_dashed.attr ( "data-x-axis-start", axis_start_num.toString () ); 
    axisScroll ();
}
function axisScroll ( type_str ) {
    var axis_start_num = parseFloat( $ ( "#time-vs-people .data-field .view .dashed" ).attr ( "data-x-axis-start" ) ),
        new_Axis_num_arr = [];

    new_Axis_num_arr.push ( axis_start_num + ":00" );

    for ( var i = 1; i < 25; i++ ) {
        if ( i % 2 == 0 ) {
            var num_str = axis_start_num + i / 2 + ":00";
            new_Axis_num_arr.push ( num_str ); 
        }
        else {
            new_Axis_num_arr.push ( " " );
        }
    }

    g_axis_obj.setnum_x ( new_Axis_num_arr );
}
function getVisits ( date_str, returnData_obj, callBack, dataEnd_num ) {
    var url_str = setting.base_site_API + "get_visits/" + date_str,
        interval,
        status = false,
        visits_data_obj;

    getData ( {
        metho: "GET",
        url: url_str,
        header: setting.header,
        success: function ( xhr ) {
            var returnData = JSON.parse( xhr.responseText ),
                result = dataEnd_num ? transformVisits ( returnData, dataEnd_num ) : transformVisits ( returnData );

            returnData_obj.data = result ? result : false;
            callBack ();    
        },
        fail: function () {
            alert ( "获取客流数据失败, 请检查网络是否正常，若网络正常请尝试刷新网页" );
        } 
    } );    
}
function transformVisits ( data_obj, dataEnd_num ) {
    var visits_data_end = dataEnd_num ? dataEnd_num : getVisitsDataEnd (),
        returnData_obj = {},
        visits_obj = data_obj.visits;

    returnData_obj.id = data_obj.date;
    returnData_obj.data = [];

    for ( var i = 0; i <= visits_data_end; i++ ) {
        returnData_obj.data[ i ] = {};
        returnData_obj.data[ i ].x = i;
        returnData_obj.data[ i ].y = 0;
    }

    for ( var i = 0; i < visits_obj.length; i++ ) {
        var index = getIndex ( visits_obj[ i ].hour );

        if ( index <= visits_data_end ) {
            returnData_obj.data[ index ].y = visits_obj[ i ].in_count;   
        }
    }

    return returnData_obj;
}
function getVisitsDataEnd () {
    var date_obj = new Date (),
        hour_num = date_obj.getHours (),
        minutes_num = date_obj.getMinutes (),
        total_minutes_num = hour_num * 60 + minutes_num,
        returnData_num = Math.floor( total_minutes_num / 30 );

    return returnData_num;
}
function getIndex ( hour_str ) {
    var total_minutes_num = parseFloat ( hour_str.split ( ":" )[ 0 ] ) * 60 + parseFloat ( hour_str.split ( ":" )[ 1 ] ),
        returnData_num = Math.floor( total_minutes_num / 30 );

    return returnData_num + 1;
}
function initVisits ( data_obj ) {
    var level_num;

    if ( !data_obj ) {
        alert( "客流VS时间初始化失败，客流数据为false" );
        return
    }
    
    g_data_obj.addData ( data_obj );
    level_num = getLevel ( g_data_obj.data_list );
    g_data_obj.setLevel ( level_num );
    setAxisY ( level_num );
    g_data_obj.upData ();    
}
function setAxisY ( level_num ) {
    var new_arr = [];

    for ( var i = 0; i < 10; i++ ) {
        if ( i % 2 != 0 ) {
            new_arr.push ( ( i + 1 ) * level_num + "" );     
        }
        else {
            new_arr.push ( " " );
        }
    }

    g_axis_obj.setnum_y ( new_arr );
}
function upDataVisits ( data_obj, data_save_obj ) {
    var data_arr = data_obj.data,
        data_save_arr = data_save_obj.data,
        data_length_num = data_arr.length,
        data_save_length_num = data_save_arr.length,
        new_data_obj = {};

    new_data_obj.id = data_obj.id;

    if ( data_length_num > data_save_length_num ) {
        new_data_obj.data = [];

        for ( var i = 0; i < ( data_length_num - data_save_length_num ); i++ ) {
            new_data_obj.data[ i ] = {};
            new_data_obj.data[ i ].x = data_arr[ data_save_length_num + i ].x;
            new_data_obj.data[ i ].y = data_arr[ data_save_length_num + i ].y;    
        }   

        g_data_obj.addData ( new_data_obj );
        g_data_obj.upData ( true );
    }
}
function getLevel ( data_list_arr ) {
    var arr = [],
        arr2 = [],
        max_num,
        level_num;

    for ( var i = 0; i < data_list_arr.length; i++ ) {
        $.merge ( arr,  data_list_arr[ i ].data );    
    }   

    for ( var i = 0; i < arr.length; i++ ) {
        arr2.push ( arr[ i ].y );
    } 

    max_num = get_max_nb ( arr2 );
    level_num = Math.ceil ( max_num / 10 );

    if ( level_num == 0 ) {
        level_num = 1;
    }

    return level_num;
}

global_obj.page.today = today_str;
global_obj.page.upData = upDataVisits;
global_obj.page.getVisits = getVisits;
global_obj.page.today_visits = today_visits_obj;
global_obj.page.today_visits_save = today_visits_save_obj;

/********/

( function () {

var slider, 
    $slider_container = $ ( "#face-list .scroll-bar" ),
    $face_list_container = $ ( "#face-list .view .face-list-container" ),
    $view = $ ( "#face-list .view" ),
    $scroll_bar_container = $ ( "#face-list .scroll-bar-container" ),
    $button = $ ( "#face-imformation button" ),
    face_list = {},
    face_list_save = [];

slider = new ZKJ_slider ( {
    $element:$slider_container,
    direction:"V",
    long:349,
    value:100,
    step:1,
    change:function (value) {

    }
} );
slider.setScroll( $view );
getFace ( face_list, function () { initFace ( face_list.data ) } );
setInterval ( function () {
    getFace ( face_list, function () { upDataFace ( face_list.data, face_list_save ) } )
}, 3000 );

$scroll_bar_container.click( function ( e ) {
    if ( $( e.target ).hasClass ( "scroll-bar-container" ) ) {
        scrollToBottom ();
    }
} );
$face_list_container.click ( function ( e ) {
    if ( $( e.target ).hasClass ( "img" ) ) {
        $ ( this ).find ( ".face-container" ).css ( "opacity", "0.2" );
        $ ( e.target ).parent ().parent ().css ( "opacity", "1" );
        $ ( "#face-imformation .possible-returning-customer-container" ).hide ();
        $ ( "#face-imformation" ).show ();
        showFaceImformation ( $ ( e.target ).parent ().parent () );
    }
} );
$button.click ( closeFaceImformation );

function getFace ( data_obj, callBack ) {
    var hour_num = ( new Date () ).getHours () - 0 + 1,
        url_str = setting.base_site_API + "get_faces/" + hour_num; 

    getData ( {
        url: url_str,
        metho: "GET",
        success: function ( xhr ) {
            data_obj.data = JSON.parse ( xhr.responseText );

            if ( callBack ) {
                callBack ()
            }
        },
        fail: function () {
            alert ( "获取人脸数据失败，请检查网络连接是否正常，若网络正常请尝试刷新网页" );
        }
    } )
}
function initFace ( data_obj ) {
    var face_arr = data_obj.faces,
        $face_list_container = $ ( "#face-list .view .face-list-container" );

    for ( var i = 0; i < face_arr.length; i++ ) {
        $face_list_container.append ( createFaceCell ( face_arr [ i ] ) );
        face_list_save.push ( face_arr[ i ].img_path );
    }

    setFaceListHeight ();
    setVCenter ();
}
function createFaceCell ( data_obj ) {
    var possible_returning_customer_arr = data_obj.possible_returning_customers,
        face_type_str = getFaceType ( possible_returning_customer_arr ),
        $div = $ ( '<div class="block face-container" style="width:90px; height:90px;background:black;position:relative;margin-left:8px;margin-top:43px;"><div style="color:white"><p style="text-align:center;margin-top:20px;">进店时间</p><p class="timestamp" style="text-align:center;margin-top:10px;"></p></div><div class="img-container" style="width:90px;height:90px;position:absolute;top:0px;left:0px"><img width="100%" height="100%" class="img"></div><div class="face-type v-center" style="width:92px;height:20px;position:absolute;top:100%;left:-1px;text-align:center;color:white"></div></div>' );
     
    if( data_obj.person_id ) {
        $div.attr ( "data-person-id", data_obj.person_id ); 
    }    
    if ( possible_returning_customer_arr ) {
        $div.attr ( "data-possible_returning_customer1", possible_returning_customer_arr[ 0 ].img_path + "-" + possible_returning_customer_arr[ 0 ].confident_rate );
        $div.attr ( "data-possible_returning_customer2", possible_returning_customer_arr[ 1 ].img_path + "-" + possible_returning_customer_arr[ 1 ].confident_rate );
        $div.attr ( "data-possible_returning_customer3", possible_returning_customer_arr[ 2 ].img_path + "-" + possible_returning_customer_arr[ 2 ].confident_rate );    
    }
        
    switch ( face_type_str ) {
        case "回头客": {
            $div.find ( ".face-type" ).css ( "background-color", "blue" );
            $div.css ( "border", "1px solid blue" );
            $div.find ( ".face-type" ).text ( "回头客" );    
            break;
        }
        case "新客户": {
            $div.find ( ".face-type" ).css ( "background-color", "red" );
            $div.css ( "border", "1px solid red" );
            $div.find ( ".face-type" ).text ( "新客户" );
            break;
        }
        default: {
            break;
        }
    }

    $div.find ( "img" )[ 0 ].src = setting.base_site_img + data_obj.img_path;
    $div.find ( ".timestamp" ).text ( data_obj.timestamp.split ( " " )[ 1 ] );    
    return $div;
}
function getFaceType ( arr ) {
    var confident_rate_set_num = setting.page.confident_rate,
        set_num = setting.page.num,
        current_num = 0;
    
    if ( !arr ) {
        return "新客户";
    }

    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[ i ].confident_rate > confident_rate_set_num ) {
            current_num += 1;    
        }
    }

    if ( current_num >= set_num ) {
        return "回头客";
    }
    else {
        return "新客户";
    }
}
function setFaceListHeight () {
    var view_width_num = $view[ 0 ].offsetWidth,
        $face_container = $ ( "#face-list .face-container" ),
        margin_left_num = parseFloat ( $face_container.css ( "margin-left" ) ),
        margin_top_num = parseFloat ( $face_container.css ( "margin-top" ) ),
        $face_width_num = $face_container.innerWidth () + 2,
        $face_height_num = $face_container.innerHeight () + 1 + $face_container.find ( ".face-type" ).innerHeight (),
        per_line_num = getPerLineNum ( view_width_num, margin_left_num, $face_width_num ),
        face_list_length_num = $ ( "#face-list .face-container" ).length,
        face_list_height_num;

    if ( face_list_length_num % per_line_num == 0 ) {
        var line_num = face_list_length_num / per_line_num;
    }
    else {
        var line_num = Math.floor ( face_list_length_num / per_line_num ) + 1;
    }

    face_list_height_num = line_num * ( $face_height_num + margin_top_num );
    $ ( "#face-list .face-list-container" ).css ( "height", face_list_height_num + "px" );
}
function getPerLineNum ( view_width_num, margin_left_num, $face_width_num ) {
    for ( var i = 1; true; i++ ) {
        if ( $face_width_num * i + margin_left_num * ( i - 1 ) <= view_width_num && $face_width_num * ( i + 1 ) + margin_left_num * i > view_width_num ) {
            return i;
        }
    }
}
function scrollToBottom () {
    slider.setCurrentValue ( 100 );
    slider.move ();    
}
function upDataFace ( data_arr, data_save_arr ) {
    var $face_list_container = $ ( "#face-list .view .face-list-container" );

    for ( var i = 0; i < data_arr.faces.length; i++ ) {
        var img_path_str = data_arr.faces[ i ].img_path;

        if ( !belong_array ( img_path_str, data_save_arr ) ) {
            $face_list_container.prepend ( createFaceCell ( data_arr.faces[ i ] ) );
            face_list_save.push ( img_path_str );
        }
    }

    setVCenter ();
}
function showFaceImformation ( $element ) {
    var person_id_str = $element.attr ( "data-person-id" ),
        timestamp_str = $element.find ( ".timestamp" ).text (),
        face_type_str = $element.find ( ".face-type" ).text (),
        img_path_str = $element.find ( "img" )[ 0 ].src;

    $ ( "#face-imformation .person img" )[ 0 ].src = img_path_str;
    $ ( "#face-imformation .person .txt .person-id span" ).text ( person_id_str ? person_id_str : "null" );
    $ ( "#face-imformation .person .txt .timestamp span" ).text ( timestamp_str );
    $ ( "#face-imformation .person .txt .face-type" ).text ( face_type_str );

    if ( $element.attr ( "data-possible_returning_customer1" ) ) {
        showPossibleReturningCustomer ( $element.attr ( "data-possible_returning_customer1" ), 0 );
    }
    if ( $element.attr ( "data-possible_returning_customer2" ) ) {
        showPossibleReturningCustomer ( $element.attr ( "data-possible_returning_customer1" ), 1 );
    }
    if ( $element.attr ( "data-possible_returning_customer3" ) ) {
        showPossibleReturningCustomer ( $element.attr ( "data-possible_returning_customer1" ), 2 );
    }
}
function showPossibleReturningCustomer ( data_str, index_num ) {
    var img_path_str = setting.base_site_img + data_str.split ( "-" )[ 0 ],
        confident_rate_str = Math.round ( data_str.split ( "-" )[ 1 ] * 100 ) + "%",
        $element = $ ( "#face-imformation .possible-returning-customer-container" ).eq ( index_num );

    $element.find ( "img" )[ 0 ].src = img_path_str;
    $element.find ( "p" ).text ( "相似度" + confident_rate_str );

    if ( parseFloat ( img_path_str ) / 100 > setting.page.confident_rate ) {
        $element.show ();    
    }
}
function closeFaceImformation () {
    $ ( "#face-list .face-container" ).css ( "opacity", "1" );
    $ ( "#face-imformation" ).hide ();
}

} ) ();

/******/

( function () {

var $time = $ ( "#time" );

setInterval ( setTime, 1000 );

function setTime () {
    var date_obj = new Date (),
        hour_num = date_obj.getHours (),
        minute_num = date_obj.getMinutes (),
        hour_str = hour_num < 10 ? "0" + hour_num : hour_num + "",
        minute_str = minute_num < 10 ? "0" + minute_num : minute_num + "",
        today_str = global_obj.page.today,
        upDataVisits = global_obj.page.upData,
        getVisits = global_obj.page.getVisits,
        today_visits_obj = {},
        today_visits_save_obj = global_obj.page.today_visits_save;

    $ ( "#time" ).text ( hour_str + ":" + minute_str );

    if ( minute_num == 10 || minute_num == 40 ) {
        getVisits ( today_str, today_visits_obj, function () { upDataVisits ( today_visits_obj.data, today_visits_save_obj.data ) } );
    }
}

} ) ()

/*******/