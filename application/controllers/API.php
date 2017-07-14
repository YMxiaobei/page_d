<?php
class API extends CI_Controller {
	public function __construct(){
        parent::__construct();
    }
    public function index () {
    	echo "接口调用";
    }
    public function get_visits ($date) {
        $store_id = 9;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/visits?date=".$date;
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
        $returnData = $this->upload_file($url, $header, null, null);
        echo $returnData;
    }
    public function get_hours () {
    	$store_id = 8;
    	$url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/hours";
    	$header = array('Authorization:5582a62985bb0b056875b0991db9350f');
    	$returnData =  $this->upload_file($url, $header, null, null);
    	echo $returnData;
    }
    public function get_faces ($hour) {
        $store_id = 8;
        if($hour)
            {
            	$url = "http://120.76.26.101:8080/api/stores/".$store_id."/faces?hour=".$hour;
            }
        else
            {
            	$url = "http://120.76.26.101:8080/api/stores/".$store_id."/faces";
            };
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
    	$returnData =  $this->upload_file($url, $header, null, null);
    	echo $returnData;
    }
    public function get_name () {
        $store_id = 7;
        $url = "http://120.76.26.101:8080/page/api7.php";
        $returnData = $this->upload_file($url, null, null, null);
        echo $returnData;
    }
    public function delete_daily_sale ($date) {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/daily_sale?date_of_sale=".$date;
        $metho = "DELETE";
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
        $returnData = $this->upload_file($url, $header, null, $metho);
        echo $returnData;
    }
    public function get_daily_sale ($date_of_sale_start, $date_of_sale_end) {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/daily_sale?date_of_sale_start=".$date_of_sale_start."&date_of_sale_end=".$date_of_sale_end;
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
        $returnData = $this->upload_file($url, $header, null, null);
        echo $returnData;
    }
    public function post_daily_sale ($num_of_sales, $total_sales_amount, $date_of_sale) {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/daily_sale";
        $data = '{"num_of_sales":'.$num_of_sales.',"total_sales_amount":'.$total_sales_amount.',"date_of_sale":"'.$date_of_sale.'"}';
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $returnData = $this->upload_file($url, $header, $data, null);
        echo $returnData;
    }
    public function get_promotion ($star, $end) {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/promotion?date_start=".$star."&date_end=".$end;
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
        $returnData = $this->upload_file($url, $header, null, null);
        echo $returnData;
    }
    public function get_hour () {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/hours";
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f');
        $returnData = $this->upload_file($url, $header, null, null);
        echo $returnData;
    }
    public function post_hour ($startStr, $endStr) {
        $store_id = 8;
        $data = '{"start":"'.$startStr.'","end":"'.$endStr.'"}';
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/hours";
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $returnData = $this->upload_file($url, $header, $data, null);
        echo $returnData;
    }
    public function post_promotion ($is_promotion, $date) {
        $store_id = 8;
        $data = '{"is_promotion":"'.$is_promotion.'","date":"'.$date.'"}';
        $url = "http://120.76.26.101:8080/api/admin/stores/".$store_id."/promotion";
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $returnData = $this->upload_file($url, $header, $data, null);
        echo $returnData;
    } 
    public function delete_promotion ($date) {
        $store_id = 8;
        $url = "http://120.76.26.101:8080/api/admin/stores/8/promotion?date=".$date;
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $metho = "DELETE";
        $returnData = $this->upload_file($url, $header, $data, $metho);
        echo $returnData;
    }
    public function post_person ( $person_name, $groups_id ) {
        $host_ip = "120.76.26.101:8081/";
        $app_key = "app_key=123&app_secret=321";
        $url = "http://".$host_ip."faceApi/persons?".$app_key;
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $groups_id_str = "[".$groups_id."]";
        $data = '{"name":"'.$person_name.'","group_ids":'.$groups_id_str.'}';
        $returnData = $this->upload_file ( $url, $header, $data, null );
        echo $returnData;
    }
    public function post_face () {
        $host_ip = "120.76.26.101:8081/";
        $app_key = "app_key=123&app_secret=321";
        $url = "http://".$host_ip."faceApi/persons/faces?".$app_key;
        $person_id = $_POST[ 'person_id' ];
        $tmp_name = $_FILES[ 'image' ][ 'tmp_name' ];
        $img_type = $_FILES[ 'image' ][ 'type' ];
        $img_name = $_FILES[ 'image' ][ 'name' ];
        $metho = "POST";
        $header = array('Authorization:5582a62985bb0b056875b0991db9350f','Content-type: application/json');
        $data = array( 'image'=>'@'.realpath( $tmp_name ).';type='.$img_type.';filename='.$img_name,'person_id'=>$person_id );
        $returnData = $this->upload_file ( $url, $header, $data, null );
        echo $returnData;
    }
    public function upload_file($url, $header, $data, $metho)
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        if ($data)
           {
              curl_setopt($ch, CURLOPT_POST, true);
              curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
           }
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($header)
           {
              curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
           }
        if ($metho)
           {
               curl_setopt ($ch, CURLOPT_CUSTOMREQUEST, $metho);
           }
        $return_data = curl_exec($ch);
        curl_close($ch);
        return $return_data;
    }
};
?>