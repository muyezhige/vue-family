<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="cache-control" content="no-cache">
	<meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<title>退出家族申请表单</title>
	<!-- build:css /wapanchor/css/common-min.css -->
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/common.css">
	<!-- endbuild -->
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/dialog.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/familyInfo.css?v=20161230">
</head>
<body>
<div id="exit_form">
	<ul class="contact-list exit-apply">
		<li class="flex">
			<span>标题：</span>
			<p class="flex1">
				<input type="text" placeholder="概况说明" name="apply_title" 
				v-model="formData.apply_title"	
				v-on:blur="verifyBlur" 
				v-on:focus="verifyFocus">
			</p>
		</li>
		<li class="question flex">
			<span>问题描述：</span>
			<p class="flex1">
				<textarea placeholder="详细描述你遇到的问题" name="apply_description" 
				v-model="formData.apply_description" 
				v-on:blur="verifyBlur" 
				v-on:focus="verifyFocus"></textarea>
			</p>
		</li>
		<li class="flex upload-img">
			<span>上传截图：</span>
			<p class="flex1 flex">
				<q class="flex1 input-file-btn">
					<img src="" class="imgShow" ref="apply_image1">
					<label for="apply_image1" class="icon-upload"></label>
					<input type="file" id="apply_image1" single accept="image/*" class="uploadFile">
				</q>
				<q class="flex1 input-file-btn">
					<img src="" class="imgShow" ref="apply_image2">
					<label for="apply_image2" class="icon-upload"></label>
					<input type="file" id="apply_image2" single accept="image/*" class="uploadFile">
				</q>
				<q class="flex1 input-file-btn"> 
					<img src="" class="imgShow" ref="apply_image3">
					<label for="apply_image3" class="icon-upload"></label>
					<input type="file" id="apply_image3" single accept="image/*" class="uploadFile">
				</q>
			</p>
		</li>
		<li class="flex">
			<span>手机号：</span>
			<p class="flex1">
				<input type="tel" placeholder="必填" name="mobile" 
				v-model="formData.mobile" 
				v-on:blur="verifyBlur" 
				v-on:focus="verifyFocus">
			</p>
		</li>
		<li class="flex">
			<span>邮箱：</span>
			<p class="flex1">
				<input type="text" placeholder="必填" name="email" 
				v-model="formData.email" 
				v-on:blur="verifyBlur"
				v-on:focus="verifyFocus">
			</p>
		</li>
	</ul>
	
	<div class="submit-box">
		<a class="submit-button" v-bind:class="{disable: isDisabled}" v-on:click="submitForm">确认提交</a>
	</div>
	<!-- 弹窗组件 -->
	<dialog-component v-bind:data="mod_dialog"></dialog-component>
</div>
<script type="text/javascript" src="/wapanchor/js/vue.min.2.0.js"></script>
<script type="text/javascript" src="/wapanchor/js/vue-resource.min.js"></script>
<script type="text/javascript" src="/wapanchor/js/zepto.min.js"></script>
<script type="text/javascript" src="/wapanchor/js/uploadImg.js"></script>
<script type="text/javascript" src="/wapanchor/js/familyquitapplyform.js?v=20161230"></script>
</body>
</html>