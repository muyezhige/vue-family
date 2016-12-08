/**
 * @page 家族信息页 {/wapanchor/familyinfo}
 * @version Vue.js 2.0
 * @author j-lihonglei@360.cn
**/
// ====== dialog组件begin ======
var dialog=null;
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
	    }
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
})

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

// 定义常量
Vue.http.options.emulateJSON = true;
var quitApplyUrl = "/wapanchor/familyQuitApply";   // 退出家族
var cancleApplyUrl = "/wapanchor/cancelJoinFamily" // 取消申请
var contractSubmitUrl = "/wapanchor/contractAdd?doadd=1"; //主播签署合同
var familyInfoUrl = "/wapanchor/ajaxFamilyInfo?v=" + Date.now();

// 定义共用函数
var ajaxPost = function(url, data, success){
	vm.$http.post(url, data)
	.then(function(response){
		var json = JSON.parse(response.body);
		if(json.code == "0000"){
			success(json);	
		}else{
			_alert(json.msg);
		}
		
	}, function(){
		_alert("网络异常，请稍候重试~");
	});
}

// 创建vue实例。
var vm = new Vue({
	el: "#exitFamily",
	data: {
		mod_dialog: dialog, //mod_dialog 是dialog组件中的挂载对象。必需。
		model_code: "" // 签署合同的验证码
	},
	methods: {
		exitFuns: function(){
			_confirm("确定要退出该家族吗", function(){
				ajaxPost(quitApplyUrl, {}, function(){
					location.reload(true);
				});
			});
		},
		cancleFuns: function(e){
			var id = e.target.getAttribute("id");

			_confirm("确定要取消申请吗", function(){
				ajaxPost(cancleApplyUrl, {f_id: id}, function(){
					location.href = "/wapanchor/familylist";
				});
			});
		},
		ajaxFamilyInfo: function(){
			ajaxPost(familyInfoUrl, {}, function(json){
				// 1、非认证家族，主播可随意退出 2、认证家族，试用期间，主播也可以随意退出
				if(json.data.family.verify_status == 4 && !json.data.member.is_probationary){
					location.href = "/wapanchor/familyquitintro";
				}else{
					vm.exitFuns();
				}
			});
		},
		contractSubmit: function(e){
			setTimeout(function(){
				vm.$refs.security.blur();
			}, 50);

			var confirmKey = vm.$refs.confirmOk.checked;
			var inputCode  = vm.model_code.toLowerCase();
			var sourceCode = vm.$refs.code.innerHTML.trim().toLowerCase();
			var msg = "";

			if(!confirmKey){
				msg = "您确认签署后，才能提交~";
			}

			if(inputCode != sourceCode){
				msg = "请输入正确的验证码~";
			}

			if(msg){
				_alert(msg);
				return;
			}

			var member_id = e.target.getAttribute("id");
			
			_confirm("确定要签署合同吗", function(){
				ajaxPost(contractSubmitUrl, {code: inputCode, id: member_id}, function(){
					location.reload(true);
				});
			});
		}
	}
})