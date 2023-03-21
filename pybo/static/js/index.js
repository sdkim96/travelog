var mapContainer = document.getElementById('map'); // 지도를 표시할 div

var mapOption = {
    center: new kakao.maps.LatLng(37.402707, 126.922044), // 지도의 중심좌표
    level: 5, // 지도의 확대 레벨
    mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};

// 지도를 생성한다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 맵에 좌클릭 이벤트 등록
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    var latlng = mouseEvent.latLng;

    // 새로운 마커 생성
    var marker = new kakao.maps.Marker({
        map: map,
        position: latlng,
        title: '새로운 마커'
    });


    // 마커에 클릭 이벤트 등록
    kakao.maps.event.addListener(marker, 'click', function () {
        var popup = document.createElement('div');
        popup.className = 'popup';
        var editor = document.createElement('div');
        editor.className = 'editor';
        editor.setAttribute('contenteditable', true); // 에디터로 사용할 수 있도록 설정
        editor.style.width = '300px'; // 너비 300px로 설정
        editor.style.height = '200px'; // 높이 200px로 설정
        popup.appendChild(editor);
        var imageUpload = document.createElement('input');
        imageUpload.type = 'file';
        popup.appendChild(imageUpload);
        var preview = document.createElement('img');
        preview.className = 'image-preview';
        popup.appendChild(preview);
        var saveButton = document.createElement('button');
        saveButton.innerText = '저장';


        popup.appendChild(saveButton);
        Swal.fire({
            html: popup,
            showConfirmButton: false,
        });
        imageUpload.onchange = function () {
            var file = this.files[0];
            preview.src = URL.createObjectURL(file); // 이미지 미리보기 표시
        };
        imageUpload.onchange = function (){

        };
        saveButton.onclick = function () {
            var data = new FormData();
            data.append('text', editor.outerHTML); // editor.outerHTML로 수정
            if (imageUpload.files.length > 0) {
                data.append('image', imageUpload.files[0]);
            }
            Swal.showLoading();
            fetch('/save', {
                method: 'POST',
                body: data
            }).then(response => {
                Swal.close();
                Swal.fire({
                    text: '저장되었습니다.'
                });
                marker.data = editor.outerHTML; // 마커에 데이터 저장
            }).catch(error => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    text: '저장 중 오류가 발생했습니다. 다시 시도해주세요.'
                });
            });
        };
    });

    // 마커에 우클릭 이벤트 등록
    kakao.maps.event.addListener(marker, 'rightclick', function () {
        var data = marker.data; // 마커에 저장된 데이터 가져오기
        if (data) {
            var popup = document.createElement('div');
            popup.className = 'popup';
            var content = document.createElement('div');
            content.className = 'content';
            content.innerHTML = data;
            popup.appendChild(content);
            var image = document.createElement('img');
            image.className = 'image-preview';
            image.src = '/static/images/placeholder.png'; // 기본 이미지
            popup.appendChild(image);
            Swal.fire({
                html: popup,
                showConfirmButton: false,
                onOpen: function () {
                    // 저장된 이미지가 있다면 미리보기 이미지를 설정
                    fetch('/image/' + marker.id).then(response => {
                        if (response.ok) {
                            image.src = '/image/' + marker.id;
                        }
                    });
                    // 모든 contenteditable 요소를 찾아서 contenteditable 속성을 false로 설정
                    var contentEditableElems = document.querySelectorAll('[contenteditable=true]');
                    for (var i = 0; i < contentEditableElems.length; i++) {
                        contentEditableElems[i].setAttribute('contenteditable', false);
                    }
                },
                onClose: function () {
                    content.setAttribute('contenteditable', false); // contenteditable 속성을 false로 설정
                }
            });
        } else {
            Swal.fire({
                text: '저장된 데이터가 없습니다.'
            });
        }
    });

    // 입력된 데이터를 저장하는 함수
    function saveData() {
        var input = document.getElementById('input-box').value;
        marker.data = input;
        alert('데이터가 저장되었습니다: ' + input);
        console.log(marker.data);
    }
});
