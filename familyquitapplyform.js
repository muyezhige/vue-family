// ====== dialog组件begin ======
var dialog = null;
Vue.component("dialog-component", {
	template: '\
	<div v-show="show==data.isShow">\
		<div class="modal" v-bind:class="data.theme">\
			<div class="modal-body" v-html="data.content"></div>\
			<div class="modal-footer">\
				<a href="javascript:;" class="btn" v-on:click="btn_true_funs">{{data.btn_true_text}}</a>\
				<a href="javascript:;" class="btn" v-on:click="btn_cancle_funs" v-show="alert==data.isAlert">{{data.btn_cancle_text}}</a>\
			</div>\
		</div>\
		<div class="modal-mark"></div>\
	</div>\
	',
	props: ["data"],
	data: function(){
		return {
	    	show: true,
	    	alert: false
	    };
	},
	methods: {
		btn_true_funs: function(){
			dialog.isShow = false;
			dialog.btn_true_funs && dialog.btn_true_funs();
		},
		btn_cancle_funs: function(){
			dialog.isShow = false;
			dialog.btn_cancle_funs && dialog.btn_cancle_funs();
		}
	}
});

// dialog 组件初始化
dialog = {
	isShow: false,
	isAlert: false,
	theme: "theme-huajiao",
	content: "内容",
	btn_true_text: "确定",
	btn_cancle_text: "取消"
}

function _alert(msg, call){
	dialog.isShow = true;
	dialog.isAlert = true;
	dialog.content = msg;
	dialog.btn_true_funs= call || function(){};
}

function _confirm(msg, call){
	dialog.isShow = true;
	dialog.isAlert = false;
	dialog.content = msg;
	dialog.btn_true_funs= call || function(){};
}
// ====== dialog组件end ======

	Vue.http.options.emulateJSON = true;
	var quitApplyUrl = "/wapanchor/familyQuitApply";// 退出家族

	// 定义共用函数
	var ajaxPost = function(url, data, success, fail){
		vm.$http.post(url, data)
		.then(function(response){
			var json = JSON.parse(response.body);
			if(json.code == "0000"){
				success();	
			}else{
				fail();
				_alert(json.msg);
			}
			
		}, function(){
			fail();
			_alert("网络异常，请稍候重试~");
		});
	};
	
	var vm = new Vue({
		el: "#exit_form",
		data: {
			mod_dialog: dialog, //mod_dialog 是dialog组件中的挂载对象。必需。
			formData: {},
			isDisabled: false
		},
		methods: {
			verifyBlur: function(e){
				var _target = e.target;
				var val  = _target.value;
				var name = _target.getAttribute("name");
				switch(name){
					case "apply_title" :
						if(!val){
							_target.setAttribute("class", "error");
						}
						break;
					case "apply_description" :
						if(!val){
							_target.setAttribute("class", "error");
						}
						break;
					case "mobile" :
						if(!val || !/^1[^01269]\d{9}$/i.test(val)){
							_target.setAttribute("class", "error");
						}
						break;
					case "email" :
						if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/gi.test(val)){
							_target.setAttribute("class", "error");
						}
						break;
					default: 
				}
			},
			verifyFocus: function(e){
				e.target.removeAttribute("class");
			},
			submitForm: function(){
				console.log(vm.formData);
				if(vm.isDisabled){
					return;
				}
				var flag = true;
				var inputList = document.querySelectorAll("input[type=text], input[type=tel], textarea");
				[].slice.call(inputList).forEach(function(item, index){
					if(!item.value){
						item.setAttribute("class", "error");
						flag = false;
					}
				});

				if(!flag){
					return;
				}

				vm.formData.apply_image1 = this.$refs.apply_image1.getAttribute("src");
				vm.formData.apply_image2 = this.$refs.apply_image2.getAttribute("src");
				vm.formData.apply_image3 = this.$refs.apply_image3.getAttribute("src");

				if(!vm.formData.apply_image1 || !vm.formData.apply_image2 || !vm.formData.apply_image3){
					_alert("有未上传的截图~");
					return;
				}
				vm.isDisabled = true;
				ajaxPost(quitApplyUrl, vm.formData, function(){
					location.href = "/wapanchor/familyinfo";
				}, function(){
					vm.isDisabled = false;
				});
			}
		}
	});

	// 上传图片组件
	uploadImg.init({
		id : "#exit_form",
		box: ".input-file-btn",
		compressHeight: 720
	});