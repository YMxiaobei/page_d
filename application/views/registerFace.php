<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script type="text/javascript" src="<?php echo base_url('public/js/js/jquery-1.9.1.min.js') ?>"></script>
    <script type="text/javascript" src="<?php echo base_url('public/js/js/function.js') ?>"></script>
    <script type="text/javascript" src="<?php echo base_url('public/js/js/partical.js') ?>"></script>
    <script type="text/javascript" src="<?php echo base_url('public/js/js/ZKJ_nav_page.js') ?>"></script>
    <script type="text/javascript" src="<?php echo base_url('public/js/js/global.js') ?>"></script>
    <link rel="stylesheet" type="text/css" href="<?php echo base_url('public/css/css/cssreset.css') ?>">
    <style type="text/css">
    	  #main {
    	      width: 1000px;
    	      margin: 0 auto;
    	  }
    	  #add-image {
    	  	  width: 500px;
    	  	  height: 200px;
    	  	  margin-left: auto;
    	  	  margin-right: auto;
    	  }
    	  #add-image h1 {
    	      font-size: 16px;
    	      font-weight: bold;
    	      margin-top: 20px;
    	  }
    	  #add-image .img-preview {
    	      width: 100%;
    	      height: 150px;
    	      border: 1px solid black;
    	      margin-top: 20px;
    	  }
    	  #register-imformation {
    	      width: 500px;
    	      height: 150px;
    	      margin-left: auto;
    	  	  margin-right: auto;
    	  }
    	  #register-imformation h1 {
    	  	  font-size: 16px;
    	      font-weight: bold;
    	      margin-top: 20px; 
    	  }
    </style>
	<title>注册人脸</title>
</head>
<body>
     <div id="main" class="container">
     	 <div id="add-image" class="block">
     	 	 <h1>添加人脸</h1>
     	 	 <div class="img-preview">
     	 	 	 <div class="img1">
     	 	 	 	 <form action="<?php echo base_url('index.php/API/post_face') ?>" method="POST" enctype="multipart/form-data">
     	 	 	           <input type="file" name="image" class="image">
     	 	 	           <input type="hidden" name="person_id" class="person_id">
     	 	         </form>
     	 	 	 </div>
     	 	 	 <div class="img2">
     	 	 	 	 <form action="<?php echo base_url('index.php/API/post_face') ?>" method="POST" enctype="multipart/form-data">
     	 	 	           <input type="file" name="image" class="image">
     	 	 	           <input type="hidden" name="person_id" class="person_id">
     	 	         </form>
     	 	 	 </div>
     	 	 	 <div class="img3">
     	 	 	 	 <form action="<?php echo base_url('index.php/API/post_face') ?>" method="POST" enctype="multipart/form-data">
     	 	 	           <input type="file" name="image" class="image">
     	 	 	           <input type="hidden" name="person_id" class="person_id">
     	 	         </form>
     	 	 	 </div>
     	 	 </div>
     	 </div>
     	 <div id="register-imformation" class="block">
     	 	 <h1>注册信息</h1>
     	 	 <div><p>姓名</p><input type="text" name="" class="name"></div>
     	 	 <div><p>性别</p><input type="text" name="" class="gender"></div>
     	 	 <div><p>年龄</p><input type="text" name="" class="age"></div>
     	 </div>
     	 <div id="submit" class="block">
     	 	 <button>注册</button>
     	 </div>
     </div>
     <script type="text/javascript" src="<?php echo base_url('public/js/registerFace.js') ?>"></script>
</body>
</html>