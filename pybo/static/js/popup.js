
/* 신체정보 작성 팝업창 크기*/
var popupX1 = (window.screen.width / 2) - (550 / 2)
var popupY1 = (window.screen.height / 2) - (550 / 2)

/* 운동기록 작성 팝업창 크기*/
var popupX2 = (window.screen.width / 2) - (550 / 2)
var popupY2 = (window.screen.height / 2) - (550 / 2)

/* 개인프로필 작성 팝업창 크기*/
var popupX3 = (window.screen.width / 2) - (550 / 2)
var popupY3 = (window.screen.height / 2) - (550 / 2)

/*팝업창 window화면 중앙정렬 */
function inputdata1(){
    window.open("/input/inputdata1","데이터 입력", 'width=550, height=550, left='+popupX1+',top='+popupY1);
}

function inputmonthdata1(){
    window.open("/input/inputmonthdata1","운동 데이터 입력", 'width=550, height=550, left='+popupX2+',top='+popupY2);
}

function testpage(){
    alert("testpage");
}