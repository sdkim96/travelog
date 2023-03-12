function vidPlay() { // 운동 영상 실행
    console.log('실행됨');
    var video2 = document.getElementById("trainVideo");
    video2.play();
}

  
var time = 0;

function init(){
    document.getElementById('timer').innerHTML = "00:00:00"
}

function timerOnclick(){
    if(time == 0){
        init();
    }

    timer = setInterval(function(){
        time++;

        min = Math.floor(time/60);
        hour = Math.floor(min/60);
        sec = time%60;
        min = min%60;

        var th = hour;
        var tm = min;
        var ts = sec;
        if(th<10){
        th = "0" + hour;
        }
        if(tm < 10){
        tm = "0" + min;
        }
        if(ts < 10){
        ts = "0" + sec;
        }

        document.getElementById("timer").innerHTML = th + ":" + tm + ":" + ts;
    }, 1000);
}
function finish(){
    alert("총 운동시간: " + parseInt(time) + "초  총 소비 칼로리: "+ parseInt(time*0.2) + "kcal");
}


window.onload = function(){
  if (canvas){
    let canvas = document.querySelector('.defaultCanvas0');
    console.log(canvas);
    let videoWrap = document.querySelector('.videoWrap');
  }
}

