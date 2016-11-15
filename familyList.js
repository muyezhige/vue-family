(function(){
	var approveText = "<div class='approveText'><h1>该家族为官方认证家族</h1>" +
		"<span>加入认证家族安全风险较低，官方给于双方保护权益。</span>" +
		"<ul>" +
			"<li><i></i>认证家族享受官方快速评级通道。</li>" +
			"<li><i></i>认证家族享受二级评级特殊通道。</li>" +
			"<li><i></i>认证家族享受优质主播推送。</li>" +
			"<li><i></i>认证家族享受参与活动优先权。</li>" +
			"<li><i></i>认证家族享受双方保护利益，并受官方监督。</li>" +
		"</ul></div>";

	var notApproveText = "<div class='notApproveText'><h1>该家族为未认证家族</h1>" +
		"<span>加入未认证家族安全风险较高，官方无法保护双方权益。</span>" +
		"<ul>" +
			"<li><i></i>认证家族享受官方快速评级通道。</li>" +
			"<li><i></i>认证家族享受二级评级特殊通道。</li>" +
			"<li><i></i>认证家族享受优质主播推送。</li>" +
			"<li><i></i>认证家族享受参与活动优先权。</li>" +
			"<li><i></i>认证家族享受双方保护利益，并受官方监督。</li>" +
		"</ul></div>";

	var officialText = "<div class='approveText'><h1>该家族为花椒官方家族</h1>" +
		"<ul>" +
			"<li><i></i>官方家族享受官方快速评级通道。</li>" +
			"<li><i></i>官方家族主播可以优先参与官方活动。</li>" +
			"<li><i></i>官方家族主播享受二次评级特殊通道。</li>" +
			"<li><i></i>官方家族主播享受优质主播推送。</li>" +
			"<li><i></i>官方家族金牌主播优先享受官方包装和推广。</li>" +
		"</ul></div>";
	
	// dialog组件
	Vue.component("dialog-component",{
		template:'#dialog-template',
		props: ["obj"],
		//在组件定义中只能是函数。
		data: function () {
		    return {
		    	show: true,
		    	alert: false
		    }
		},
		methods: {
			btn_true_funs: function(){
				vm.dialog.isShow = false;
				vm.dialog.btn_true_funs && vm.dialog.btn_true_funs();
			},
			btn_cancle_funs: function(){
				vm.dialog.isShow = false;
				vm.dialog.btn_cancle_funs && vm.dialog.btn_cancle_funs();
			}
		}
	});
	// dialog组件

	Vue.component('list-component', {
		props: ['item', "index"],
		template: '<li index="{{index}}" v-bind:class="[isIndex == index ? classA: \'\']">'+
			'<div class="family flex" v-on:click="fold(index)">'+
				'<img src="{{item.logo}}">'+
				'<div class="textBox">'+
					'<h1>'+
						'<span v-html="item.name"></span><i class="icon_v" v-if="item.verify_status==4"></i>'+
					'</h1>'+
					'<p>'+
					'主播数：{{item.mem_num}}<br>'+
					'<span>家族长：{{item.boss_name}}</span><code class="level">Lv{{item.boss_level}}</code>'+
					'</p>'+
				'</div>'+
				'<span class="btn-fold fold"></span>'+
			'</div>'+
			'<div class="middleman_box">'+
				'<div class="middleman flex" v-for="json in item.agent_list">'+
					'<i class="middleName">经纪人</i>'+
					'<img src="{{json.avatar}}">'+
					'<div class="textBox">'+
						'<span class="agent_name">{{json.name}}</span><br/>'+
						'等级：{{json.level}}'+
					'</div>'+
					'<a href="javascript:void(0);" class="btn-join apply" v-on:click="showHint(item, json)">申请加入</a>'+
				'</div>'+
			'</div>'+
		'</li>',
		data: function(){
			return {
				isIndex: -1,
				classA: "active"
			}
		},
		methods: {
			showHint: function(item, json){
				vm.dialog = {
					isAlert: false,
					isShow: true,
					theme: "theme-huajiao",
					btn_true_text: "确定加入",
					btn_cancle_text: "我再想想",
					btn_true_funs: function(){
						vm.joinFamily();
					},
					btn_cancle_funs: function(){}
				}

				if(item.verify_status == 4){
					vm.dialog.modal_body_html = approveText;
				}else{
					vm.dialog.modal_body_html = notApproveText;
				}

				if(item.boss_id == "29794557" || item.boss_id == "30245957"){
					vm.dialog.modal_body_html = officialText;
				}

				vm.joinParam = {
					f_id: item.id,
					agent_uid: json.uid
				}
			},
			fold: function(index){
				this.isIndex = (this.isIndex == index) ? -1 : index;
			}
		}
	})

	// 采用form data的形式来传递参数。 
	Vue.http.options.emulateJSON = true;
	var familyRankUrl = "/wapanchor/familyRankList";

	var vm = new Vue({
		el: "body",
		data: {
			inputVal:"",
			dialog: {},
			joinParam: {},
			items: [],
			newItems:[],
			searchItems:[],
			show: "default",
			isPage: false,
			isloading: false,
			hasResult: false,
			searchResult: false,
			// 下一页按钮
			excellent_next_btn: false,
			new_next_btn: false,
			search_next_btn: false,
			excellent_page_no: 1,
			new_page_no: 1,
			search_page_no: 1,
			pageRows: 15
		},
		ready: function() {
			this.isloading = true;
			this.getFamilyList();
		},
		methods: {
			getFamilyList: function(){
				var vm = this;
				// 优秀家族请求
				vm.$http.post(familyRankUrl, {page_no: 1, page_rows: vm.pageRows, type: "best"}).then(function(response){
					var json = JSON.parse(response.body);
					this.isloading = false;
					if(json.code == "0000"){
						vm.$set('items', json.data.list);
						if(json.data.pageinfo.have_next){
							vm.excellent_next_btn = true;
						}
						if(json.data.is_member){
							window.history.go(-2);
						}
					}else{
						vm.dialog = {
							isAlert: true,
							isShow: true,
							theme: "theme-huajiao",
							btn_true_text: "确定",
							btn_cancle_text: "取消",
							modal_body_html: json.msg
						}
					}
				}, function(error){
					alert("网络异常，请稍候重试~");
				});

				// 新秀家族请求
				vm.$http.post(familyRankUrl, {page_no: 1, page_rows: vm.pageRows, type: "new"}).then(function(response){
					var json = JSON.parse(response.body);
					if(json.code == "0000"){
						vm.$set('newItems', json.data.list);
						if(json.data.pageinfo.have_next){
							vm.new_next_btn = true;
						}
					}else{
						vm.dialog = {
							isAlert: true,
							isShow: true,
							theme: "theme-huajiao",
							btn_true_text: "确定",
							btn_cancle_text: "取消",
							modal_body_html: json.msg
						}
					}
					
				}, function(error){
					alert("网络异常，请稍候重试~");
				});
			},
			// 搜索家族
			searchfamily: function(){
				var vm = this;
				if(!vm.inputVal.trim()){
					vm.$els.input.focus();
					return;
				}
				vm.isloading = true;
				vm.$http.post("/wapanchor/familyList?search=1", {page_no: 1, kw: vm.inputVal, page_rows: vm.pageRows}).then(function(response){
					var json = JSON.parse(response.body);
					vm.isloading = false;
					vm.searchResult = true;
					vm.search_page_no = 1;
					if(json.code == "0000"){
						vm.isPage = true;
						vm.$set('searchItems', json.data.list);
						
						if(!json.data.list.length){
							vm.hasResult = true;
							vm.search_next_btn = false;
						}else{
							vm.hasResult = false;
						}
						if(json.data.pageinfo.have_next){
							vm.search_next_btn = true;
						}else{
							vm.search_next_btn = false;
						}
					}else{
						alert(json.msg);
					}
				}, function(error){
					console.log(error);
				});
			},
			// 申请加入
			joinFamily: function(){
				var vm = this;
				vm.$http.post("/wapanchor/joinFamily", vm.joinParam).then(function(response){
					var json = JSON.parse(response.body);
					if(json.code == "0000"){
						window.location.replace("/wapanchor/familyinfo");	
					}else{
						vm.dialog = {
							isAlert: true,
							isShow: true,
							theme: "theme-huajiao",
							btn_true_text: "确定",
							btn_cancle_text: "取消",
							modal_body_html: json.msg.replace(/{x}/, '"' + json.data.family_name +'"')
						}
					}
				}, function(error){
					alert("网络异常，请稍候重试~");
				});
			},
			clearInputVal: function(){
				this.inputVal = "";
				vm.isPage = false;
				vm.hasResult = false;
				vm.searchResult = false;
				this.search_page_no = 1;
			},
			// 下一页
			nextPage: function(type){
				var page = 1;
				var param = {};
				var url = "";

				switch(type){
					case "best" :
						page = ++vm.excellent_page_no;
						param = {page_no: page, page_rows: vm.pageRows, type: type};
						url = familyRankUrl;
					break;
					case "new" :
						page = ++vm.new_page_no;
						param = {page_no: page, page_rows: vm.pageRows, type: type};
						url = familyRankUrl;
					break;
					default :
						page = ++vm.search_page_no;
						param = {page_no: page, page_rows: vm.pageRows, kw: vm.inputVal};
						url = "/wapanchor/familyList?search=1";
					break;
				}
				this.isloading = true;
				vm.$http.post(url, param).then(function(response){
					var json = JSON.parse(response.body);
					this.isloading = false;
					if(json.code == "0000"){
						switch(type){
							case "best" :
								vm.$set('items', vm.items.concat(json.data.list));
							break;
							case "new" :
								vm.$set('newItems', vm.newItems.concat(json.data.list));
							break;
							default:
								vm.$set('searchItems', vm.searchItems.concat(json.data.list));
							break;
						}
						
						if(json.data.pageinfo.have_next){
							switch(type){
								case "best" :
									vm.excellent_next_btn = true;
								break;
								case "new" :
									vm.new_next_btn = true;
								break;
								default:
									vm.search_next_btn = true;
								break;
							}
						}else{
							switch(type){
								case "best" :
									vm.excellent_next_btn = false;
								break;
								case "new" :
									vm.new_next_btn = false;
								break;
								default:
									vm.search_next_btn = false;
								break;
							}
						}
					}else{
						alert(json.msg);
					}
				}, function(error){
					console.log(error);
				});
			}
		}
	});
})();