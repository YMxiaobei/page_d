/*******/

( function () {

var $submit_button = $ ( "#submit" ),
    $file = $ ( "#add-image .image" ),
    returnData_save_obj = {};
   
$file.change ( readyForSubmit );   
$submit_button.click ( function () { registerFace ( setting.registerFace.group_id ) } );

function readyForSubmit () {
	$ ( this ).parent ().addClass ( "submit-ready" );
}
function registerFace ( group_id_num ) {
	var  face_name_Str = $ ( "#register-imformation .name" )[ 0 ].value,
         face_gender_str = $ ( "#register-imformation .gender" )[ 0 ].value,
         face_age_str = $ ( "#register-imformation .age" )[ 0 ].value,
         face_imformation_str = face_name_Str + "-" + face_gender_str + "-" + face_age_str;

    postPerson ( face_imformation_str, group_id_num, returnData_save_obj, function () { postFace ( returnData_save_obj.person_id ) } );
}
function postPerson ( face_imformation_str, group_id_num, returnData_save_obj, callBack ) {
	var group_id_str = group_id_num + "",
	    url_str = setting.base_site_API + "post_person/" + face_imformation_str + "/" + group_id_str;

	getData ( {
        metho: "GET",
        url: url_str,
        success: function ( xhr ) {
            var returnData_obj = JSON.parse ( xhr.responseText );
            alert ( xhr.responseText );
            returnData_save_obj.person_id = returnData_obj.person.person_id;
            if ( callBack ) {
            	callBack ();
            }
        },
        fail: function () {
        	alert ( "人脸注册失败" );
        }
	} )
}
function  postFace ( person_id_num ) {
	var $submit_ready = $ ( "#add-image .submit-ready" );
	for ( var i = 0; i < $submit_ready.length; i++ ) {
		alert ( person_id_num );
	    $submit_ready.eq ( i ).find ( ".person_id" )[ 0 ].value = person_id_num;
	    $submit_ready[ i ].submit ();    
	}
}

} ) ()

/*******/