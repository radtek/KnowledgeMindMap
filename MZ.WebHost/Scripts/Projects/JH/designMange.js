
	
	$('#P-J-addIndex').click(function () {
		$.YH.box({
			target:"#P-J-addIndex_popbox",
			title:'添加指标',
			width: 600,
			modal: true
		});
		return false;
	});
	$('#P-J-design1').click(function () {
		$.YH.box({
			target:"#P-J-design1_popbox",
			title:'设计导则',
			width: 600,
			modal: true
		});
		return false;
	});
	$('#P-J-design2').click(function () {
		$.YH.box({
			target:"#P-J-design2_popbox",
			title:'设计指引',
			width: 600,
			modal: true
		});
		return false;
	});

	$('#P-J-setCoreIndex').toggle(function(){
		$(this).addClass('N_btn_04_select');
		$('#P-J-setCoreIndex_info').show();
		$('.P-J-setCoreIndex_list').addClass('selectEnable');
		$('.P-J-setCoreIndex_list li').click(function(){
			$(this).toggleClass('select')
		});
		return false;
	},function(){
		$(this).removeClass('N_btn_04_select');
		$('#P-J-setCoreIndex_info').hide();
		$('.P-J-setCoreIndex_list').removeClass('selectEnable');
		$('.P-J-setCoreIndex_list li').unbind('click');
		return false;
	})
		
	myFocus.set({
		id:'myFocus',
		pattern:'mF_YSlider',
		height:272,
		width:630
	});