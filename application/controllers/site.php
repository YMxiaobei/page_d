<?php
class site extends CI_Controller {
	public function __construct(){
        parent::__construct();
    }
    public function index () {
    	$this->load->view("open");
    	$this->load->view("header");
    	$this->load->view("homePage");
    	$this->load->view("dataEdit");
    	$this->load->view("dataQuery");
    	$this->load->view("close");
    }
}
?>