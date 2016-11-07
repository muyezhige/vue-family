<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<title>查找家族</title>
	<!-- build:css /wapanchor/css/common-min.css -->
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/common.css">
	<!-- endbuild -->
	<!-- build:css /wapanchor/css/index-min.css -->
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/dialog.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/familyList.css">
	<!-- endbuild -->
</head>
<body>
<div class="loader" v-show="isloading==true">
	<span class="icon-loading"></span>
</div>
<div id="form-info" class="has-result">
	<div class="find-input-box">
		<div class="inputBox">
			<input type="text" v-cloak v-el:input value="{{inputVal}}" v-model="inputVal" placeholder="输入家族名称查找" class="inputKey" v-on:keyup.enter="searchfamily" v-on:input.enter="searchfamily">
			<i class="icon-search"></i>
			<a href="javascript:void(0);" class="close-box" v-on:click="clearInputVal">
				<i class="icon-close"></i>
			</a>
		</div>
		<div class="searchText" v-on:click="searchfamily">搜索</div>
	</div>
	<ul class="findResult"></ul>
	<div v-cloak class="no-result" v-if="hasResult==true">
		搜索无结果~
	</div>
</div>

<section class="tag_box" v-bind:class="{searchPage: isPage}">
	<div class="tagList flex">
		<p v-bind:class="{'active': show == 'default'}" v-on:click="show = 'default'">
			<span>优秀家族</span>
		</p>
		<p v-bind:class="{'active': show == 'other'}" v-on:click="show = 'other'">
			<span>新秀家族</span>
		</p>
	</div>
	<!-- 初始化家族列表 -->
	<div class="tag_content familyList">
		<ul v-show="show == 'default'">
			<list-component v-bind:item="item" :index="$index" v-for="item in items"></list-component>
			<li class="nextPage" v-cloak v-on:click="nextPage('best')" v-if="excellent_next_btn==true">下一页</li>
		</ul>
		<ul v-show="show == 'other'">
			<list-component v-bind:item="item" :index="$index" v-for="item in newItems"></list-component>
			<li v-cloak class="nextPage" v-on:click="nextPage('new')"  v-if="new_next_btn==true">下一页</li>
		</ul>
	</div>
	<!-- 搜索结果 -->
	<div class="tag_content findResult">
		<ul>
			<list-component v-bind:item="item" :index="$index" v-for="item in searchItems"></list-component>
			<li class="nextPage" v-cloak v-on:click="nextPage('search')"  v-if="search_next_btn==true">下一页</li>
		</ul>
	</div>
</section>

<!--dialog 模板组件 -->
<dialog-component v-bind:obj.sync="dialog"></dialog-component>
<template id="dialog-template">
	<div class="modal {{obj.theme}}" v-show="show==obj.isShow">
		<div class="modal-body" v-html="obj.modal_body_html"></div>
		<div class="modal-footer">
			<a href="javascript:;" class="btn" v-on:click="btn_true_funs">{{obj.btn_true_text}}</a>
			<a href="javascript:;" class="btn" v-show="alert==obj.isAlert"  v-on:click="btn_cancle_funs">{{obj.btn_cancle_text}}</a>
		</div>
	</div>
	<div class="modal-mark" v-show="show==obj.isShow"></div>
</template>
<!--dialog 模板组件 -->
<script type="text/javascript" src="/wapanchor/js/vue.min.js"></script>
<script type="text/javascript" src="/wapanchor/js/vue-resource.min.js"></script>
<script type="text/javascript" src="/wapanchor/js/familyList.js?v=21"></script>
</body>
</html>