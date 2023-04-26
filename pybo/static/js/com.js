// Common.js
$(document).ready(function(){

	
	$("#topbtn").hide();
	
	$(function() {
		
		$(window).scroll(function () 
		{
			if ($(this).scrollTop() > 100) {
				$('#topbtn').fadeIn();
			} else {
				$('#topbtn').fadeOut();
			}
		});
		
		$('#btn_top').click(function(){
			$('body,html').animate({scrollTop: 0}, 300);
			return false;
		});
		
		var pos_cmmt = $('#sty_btm').offset();
		
		$('#btn_cmmt').click(function(){
			$('body,html').animate({scrollTop: pos_cmmt.top - 40}, 300);
			return false;
		});
		
	});
	
	//로그인된 사용자
	$('#id_view_logined').click(function(e){
		
		e.preventDefault();
		
		//알림 리셋
		$("#id_lognd_alrim_layer").hide();
		$("#id_view_alrm").removeClass("selected");
		$(this).removeClass("selected");
		
		//쓰기 팝업이 있을경우 닫기
		$("#write_mask").hide();	
		$("#write_pop").hide();
		
		if($('#id_lognd_layer').css("display") == "none")
		{
			$('#id_lognd_layer').show();
			$('.h_util .c_cmm_logind a').css("background", "url(/web/img/comm/login_id_close.png) no-repeat right");
			
			isEventCheck = true;
			
			$('#wrapper').click(function(){
				
				if( isEventCheck == false )
				{
					$('#wrapper').unbind("click");
					if($('#id_lognd_layer').css("display") != "none")
					{
						$('#id_lognd_layer').hide();
						$('.h_util .c_cmm_logind a').css("background", "url(/web/img/comm/login_id_open.png) no-repeat right");
					}
				}
				isEventCheck = false;
			});
		}
		else
		{
			$('#wrapper').unbind("click");
			$('#id_lognd_layer').hide();
			$('.h_util .c_cmm_logind a').css("background", "url(/web/img/comm/login_id_open.png) no-repeat right");
		}	
	});
	
	//로그인된 사용자 알림
	$('#id_view_alrm').click(function(e){
		
		e.preventDefault();
		$('#id_lognd_layer').hide();
		
		//쓰기 팝업이 있을경우 닫기
		$("#write_mask").hide();	
		$("#write_pop").hide();
		
		if($(this).hasClass("selected")){
			$(this).removeClass("selected");
			$("#id_lognd_alrim_layer").hide();
		}else{
			$(this).addClass("selected");
			
			$("#id_lognd_alrim_layer").show();
			
			//뉴아이콘 숨김
			$("#alrm_new").hide();
			
			//알림불러오기
			getListAlrm();
		}
	});
	
	$("#alrim_close").click(function(){
		$("#alr_list").empty();
		$('#id_lognd_alrim_layer').hide();
		$('#id_view_alrm').removeClass("selected");
	});
	
	
	$("#temp_list_close").click(function(){
		$("#temp_list_pop").fadeOut();
	});
	
	
	$("#temp_delete").click(function(){
		if(!confirm("전체 목록을 삭제하시겠습니까?"))
			return;
		fn_delete_temp_all();
	});
});


/*알림리스트*/
function getListAlrm(){
	
	$.ajax({
		type:"POST",
		url:"/alrim_list.tlg",
		data:{},
		success:function(ajaxData){
			$("#alr_list").empty();
			$("#alr_list").append(ajaxData);
			
			//알림없을때
			var li_size = parseInt($("#alr_list").children().length);
			if(li_size == 0){
				var no_alrim = "<div class='alr_nolist'><div></div></div>";
				$("#alr_list").append(no_alrim);
			}
		},
		error:function(msg){
			
		}
	});
}

var isEventCheck = false;

function openLogin()
{
	$('#btn_cmm_login').trigger('click');
}

function fnOpenLogin()
{
	$('#btn_cmm_login').trigger('click');
}
/**
 * 쓰기 팝업
 */
function openWriteMain(obj)
{
	if (true == $(obj).data("login")){
		$("#id_lognd_alrim_layer").hide();
		$("#id_view_alrm").removeClass("selected");
		$("#write_mask").fadeIn();
		$("#write_pop").fadeIn();
	}else{
		if(confirm('로그인이 필요한 서비스 입니다.\n로그인 하시겠습니까?')){
			location.href = '/login_v2.tlg';
		}
	}
}
function closeWirte()
{
	$("#write_mask").fadeOut();
	$("#write_pop").fadeOut();
}

//임시 저장 목록 팝업
function openTmpTlogList(){
	$("#id_lognd_alrim_layer").hide();
	$("#id_view_alrm").removeClass("selected");
	$.ajax({
		type:"POST",
		url: "/web/story_editing_list.tlg",
		success:function(ajaxData){
			$("#temp_list_con").empty();
			$("#temp_list_con").append($(ajaxData));
			setDeleteEventSet();
			$("#temp_list_pop").fadeIn();
		},
		error:function(msg){
			alert(msg.text());
		} 
	});
	
}
//임시저장목록 닫기
function closeTmpTlogList(){
	$("#temp_list_pop").fadeOut();
}

//임시저장 목록에서 삭제버튼 ( 개별삭제 )
function setDeleteEventSet(){
	$(".temp_data_delete").click(function(){
		if(!confirm("삭제하시겠습니까?"))
			return;
		fn_delete_temp($(this).attr("del_tm_no"));
	});
}

//임시저장 글 삭제
function fn_delete_temp(tm_no){
	$.ajax({
		type:"POST",
		url: "/web/delete_tlog_editing.tlg",
		data:{"tm_no":tm_no},
		success:function(ajaxData){
			$("#temp_list_con").empty();
			$("#temp_list_con").append($(ajaxData));
			$("#temp_list_pop").show();
			setDeleteEventSet();
		},
		error:function(msg){
			alert(msg.text());
		} 
	});
}

//임시 저장 글 전체 삭제
function fn_delete_temp_all(){
	$.ajax({
		type:"POST",
		url: "/web/delete_tlog_editing.tlg",
		data:{"tm_no":"ALL"},
		success:function(ajaxData){
			$("#temp_list_con").empty();
			$("#temp_list_con").append($(ajaxData));
			$("#temp_list_pop").show();
				setDeleteEventSet();
		},
		error:function(msg){
			alert(msg.text());
		} 
	});
}

//작성중인 여행기 수정하러 스텝1로 가기
function select_tlog_mst(tm_no, sty_dv)
{
	if(sty_dv =='TL')
		window.open("/web/step1.tlg?tm_no="+tm_no, "_top");
	else if(sty_dv =='ES')
		window.open("/web/tessay_wrt.tlg?no="+tm_no, "_top");
	else 
		window.open("/web/restr_step1.tlg?tm_no="+tm_no, "_top");
}

//이미지 URL
function getFullPath( url ){
	return "https://img.tnote.kr"+url;
}

/**
 * toHtml
 */
function toHtml(value, conts){
	var result = value.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>');
	conts.html(result);
}

/*안드로이드 /아이폰으로 이동*/
function gotoAndroid(){
	window.open('https://play.google.com/store/apps/details?id=com.doresoft.tournote', '_blank');
	return false;
}


function gotoIphone(){
	window.open('https://itunes.apple.com/kr/app/id600750084?mt=8', '_blank');
	return false;
}

/**
 * 이야기 상세페이지로 이동
 * @param tm_no
 */
function fn_CmmGoToStoryDetail(tm_no)
{
	window.open(fn_CmmStoryURL(tm_no), '_top');
}

/**
 * 이야기 상세페이지 URL
 * @param tm_no
 */
function fn_CmmStoryURL(tm_no)
{
	return '/story/' + Number(tm_no.substring(1));
}


/**
 * 장소 상세페이지로 이동
 * @param tp_no
 */
function fn_CmmGoToPlaceDetail(tp_no)
{
	window.open(fn_CmmPlaceURL(tp_no), '_top');
}


/**
 * 장소 상세페이지 URL
 * @param tp_no
 */
function fn_CmmPlaceURL(tp_no)
{
	return '/place/' + Number(tp_no.substring(1));
}

/**
 * 도시 상세페이지로 이동
 * @param ct_no
 */
function fn_CmmGoToCityDetail(ct_no)
{
	window.open(fn_CmmCityURL(ct_no), '_top');
}


/**
 * 도시 상세페이지 URL
 * @param tp_no
 */
function fn_CmmCityURL(ct_no)
{
	return '/city/' + Number(ct_no.substring(1));
}