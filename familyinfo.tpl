<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="cache-control" content="no-cache">
	<meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
	<title>我的家族</title>
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/common.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/dialog.css">
	<link rel="stylesheet" type="text/css" href="/wapanchor/css/familyInfo.css">
</head>
<body>
<!-- 我的家族信息展示 -->
<article class="box-info">
	<a href="/wapanchor/familyhelp" class="icon-ask">?</a>
	<img src="{%$data.logo%}" class="logo">
	<h1>
	{%$data.name%}
	{%if ($family.verify_status == 4)%}
		<img src="img/icon_approve.png" class="icon_approve">
	{%/if%}
	</h1>
	<span>家族长：{%$data.boss_name%}</span>
</article>
<nav class="nav-opts">
	<a href="/wapanchor/familydetail">
		<span>家族资料</span>
	</a>
	<!-- 合同审核通过, 才能显示合同周期 -->
	{%if ($data.status == 5 || $data.status == 4)%}
		<a href="/wapanchor/contractview">
			<span>合同周期</span>
			<time class="fr">
				{%$member.start_time%}
				<i>至</i>
				{%$member.end_time%}
			</time>
		</a>
	{%/if%}

	<!-- 是否处于试用期 -->
	{%if ($member.is_probationary == 1)%}
		<a href="/wapanchor/probationaryperiodintro">
			<span>试用期</span>
			<time class="fr">
			{%$member.probationary_start_time%}
			<i>至</i>
			{%$member.probationary_end_time%}，剩<i>{%$member.probationary_days%}</i>天</time>
		</a>
	{%/if%}

	<!-- 角色是主播才显示“与我相关” -->
	{%if ($member.role == 1)%}
	<a href="/wapanchor/familycontact">
		<span>与我相关</span>
	</a>
	{%/if%}
</nav>
<div id="exitFamily">
<!-- 等待审核时，可以取消申请 -->
{%if ($data.status == 1)%}
	<!-- <p class="notice">已申请加入，家族审核中...</p> --> 
	<div class="applied flex">
		<p class="flex1">家族审核中...</p>
		<a href="javascript:void(0);" id="{%$data.f_id%}" v-on:click="cancleFuns">取消申请</a>
	</div>
{%/if%}

<!-- 申请通过，等待签合同 -->
{%if ($data.status == 2)%}
	<p class="notice">您的申请已通过，请等待家族签合同...</p>
{%/if%}

<!-- 申请被拒绝 -->
{%if ($data.status == 3)%}
	<div class="applied flex">
		<p class="flex1">请求被驳回...</p>
		<a href="/wapanchor/familylist{%if $skin neq ''%}?skin={%$skin%}{%/if%}">重新申请</a>
	</div>
{%/if%}

<!-- 家族长发送合同邀请，主播签合同 -->
{%if ($data.status == 4)%}
	<blockquote class="security-box">
		<p class="security-code">
			<input type="text" placeholder="输入确认码" value="" ref="security" v-model="model_code">
			<code class="code" ref="code">{%if $data.code neq ''%}{%$data.code%}{%else%}{%/if%}</code>
		</p>
		<input type="checkbox" id="ok" class="confirm-checkbox" ref="confirmOk">
		<label for="ok" class="confirm-text">确认签署</label>
	</blockquote>
	<a href="javascript:void(0);" class="btn-option-text" id="{%$data.m_id%}" v-on:click="contractSubmit">签署合同提交</a>
	<p class="statement">
		加入家族后，在合同期内不可随意退出。<br/>
		如需退出或转入其他家族，需要与家族长协商，并可能承担一定额度的违约金，请慎重提交。
	</p>
{%/if%}

<!-- 合同审核通过 -->
{%if ($data.status == 5)%}
	<!-- 合同期内退出认证家族，要走提交证据资料的流程 -->
	{%if ($family.verify_status == 4 && $member.is_probationary == 0)%}
		{%if (!$quit_apply_info)%}
			<a href="/wapanchor/familyquitintro" class="btn-option-text">退出此家族</a>
		{%else%}
		 	<!-- 主播申请退出认证家族后 -->
		 	{%if ($quit_apply_info.status == 3)%}
		 		<div class="applied flex">
					<p class="flex1">{%$quit_apply_info.result_description%}</p>
					<a href="/wapanchor/familyquitintro">退出此家族</a>
				</div>
		 	{%else%}
				<p class="notice">申请已提交，请关注花椒官方私信...</p>
		 	{%/if%}
		{%/if%}

	{%else%}
		<a href="javascript:void(0);" class="btn-option-text" id="{%$data.m_id%}" v-on:click="exitFuns">退出此家族</a>
	{%/if%}

	<!-- 合同已到期 -->
	{%if $smarty.now > $data.end_time|strtotime%}
		<p class="noticeText">
			合同到期，请联系管理员<a href="/wapanchor/contractview">《<u>合同</u>》</a>
		</p>
	{%/if%}
{%/if%}

<!-- 被家族长移除 -->
{%if ($data.status == 7)%}
	<p class="notice">家族长已将您移出家族，请重新申请...</p>
	<div class="submit-box">
		<a href="/wapanchor/familylist{%if $skin neq ''%}?skin={%$skin%}{%/if%}" class="submit-button">重新申请</a>
	</div>
{%/if%}
<!-- 弹窗组件 -->
<dialog-component v-bind:data="mod_dialog"></dialog-component>
</div>
<script type="text/javascript" src="/wapanchor/js/vue.min.2.0.js"></script>
<script type="text/javascript" src="/wapanchor/js/vue-resource.min.js"></script>
<script type="text/javascript" src="/wapanchor/js/familyInfo.js"></script>
</body>
</html>