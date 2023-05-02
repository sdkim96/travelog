// 아래 js는 커스텀 맵에대한 내용을 구성하고 있습니다. 커스텀 맵의 구성단계는 크계 4단계입니다. 
// 맵 구현 -> 마커의 데이터를 디비에서 가져옴 -> 인포윈도우 구현 -> 마커 구현 -> 최종 구현 단계를 따르고 있습니다.
// 커스텀 맵을 구현하기 위해 큰 구성요소 2개가 있습니다. 로그인 여부(var isLoggedin), 유효한 디렉토리인지(def is_directory)
// 각각의 단계에 대한 주석은 자세하게 달아두었으니, 보고 참고하세요

// 1단계: 맵 구현하기
var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.58, 127), // 지도의 중심좌표
    level: 9, // 지도의 확대 레벨
    mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};
var map = new kakao.maps.Map(mapContainer, mapOption);

// 2단계: route_views의 엔드포인트 route/get_markers 를 통해, 마커의 정보를 json 형식으로 가져옴 그리고 마커의 데이터를 반환하는 함수를 '정의'만함 호출은 나중에 할거임
async function fetchMarkers() {
    const response = await fetch('/route/get_markers');
    const markers = await response.json();
    return markers;
}

let allMarkers = []; // 전체 마커를 저장할 배열
let friends = []; // 팔로우한 친구 목록을 저장할 배열

async function fetchFriends() {
    const response2 = await fetch('/route/get_friends');
    const friendList = await response2.json();
    return friendList;
}

// 3단계: 인포윈도우 구현하기(커스텀 오버레이로)
async function createCustomOverlay(markerData) {

    //해당 이미지가 그 위치에 있는지에 대한 검증입니다. utils.py 참고
    var imageSrc0 = `/static/image/${markerData.id}/${markerData.img_name}`;
    const isValidPath = await is_directory(imageSrc0);
    if (!isValidPath) {
      imageSrc0 = "/static/image/main_01.jpg";
    }

    //검증된 imageSrc0엔 대표이미지있는 경로와 없는 경로 두개가 들어가있습니다.
    //옆으로 슬라이딩 할 수 있고 없고는 html코드에 주석처리된 부분입니다. 230426)일단 기능구현은 안함.
    //아래 a href부분도 차후에 경로 수정해야함.
    const content = `
        <div class="custom-overlay">
            <div class="info-window">
                <div class="image-container">
                    <button class="slide-button left">&lt;</button>
                    <img src="${imageSrc0}" class="active" /> 
                    <!-- 추가 이미지를 아래와 같이 추가합니다 -->
                    <!-- <img src="/static/image/another_image.jpg" /> -->
                    <button class="slide-button right">&gt;</button>
                </div>
                <p>${markerData.subject}</p>
                <p><a href="http://127.0.0.1:5000/question/detail/${markerData.id}">바로가기</a></p>
                <button class="infoClose" onclick="closeOverlay()">X</button>
            </div>
        </div>
    `;

    //인포윈도우 객체를 만듭니다. (얘는 함수가 호출되면 구현되야함)
    const customOverlay = new kakao.maps.CustomOverlay({
        content: content,
        map: null,
        position: new kakao.maps.LatLng(markerData.local.split(',')[0], markerData.local.split(',')[1]),
        xAnchor: 0.5,
        yAnchor: 1.5,
        zIndex: 10
    });

    //인포윈도우에 들어가는 좌우 버튼을 구현합니다.
    const leftButton = customOverlay.a.querySelector('.left');
    const rightButton = customOverlay.a.querySelector('.right');
    const images = customOverlay.a.querySelectorAll('img');
    let activeImageIndex = 0;

    leftButton.addEventListener('click', () => {
        images[activeImageIndex].style.left = '100%';
        activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
        images[activeImageIndex].style.left = '0';
    });

    rightButton.addEventListener('click', () => {
        images[activeImageIndex].style.left = '-100%';
        activeImageIndex = (activeImageIndex + 1) % images.length;
        images[activeImageIndex].style.left = '0';
    });

    return customOverlay;
}




//해당 이미지가 그 위치에 있는지에 대한 검증입니다. utils.py 참고 (얘는 js용임)
async function is_directory(path) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

// 4단계: 마커 구현인데, 얘는 로그인이 되어야 하기때문에, isloggedin 매개변수를 기본으로 가져감
async function displayMarkers() {
    if (!isLoggedIn) {
        return;
    }

    //아까 2단계의 마커에 대한 함수를 구현함. markers엔 json형식으로 되어있는 게시물의 대한 정보가 들어감. 이걸 마커에 넣어줄거임
    const markers = await fetchMarkers();
    const friendList = await fetchFriends();
    friends = friendList.map(friend => friend.user_name);

    //각각의 마커의 정보에 대해서.
    //마커의 정보!
    // marker.id : question.id,
    // marker.subject: question.subject,
    // 'marker.user_id': user_id_to_name[question.user_id],
    // 'marker.local': question.local,
    // 'marker.content': question.content,
    // 'marker.img_name' : question.img_name
    //가 있음 현재. route_views.py 참고

    await Promise.all(
        markers.map(async (marker) => {
            const localArray = marker.local.split(',');
            const position = new kakao.maps.LatLng(localArray[0], localArray[1]);
    
            var imageSrc1 = `/static/image/${marker.id}/${marker.img_name}`;
            if (!(await is_directory(imageSrc1))) {
                imageSrc1 = '/static/image/main_01.jpg';
            }
            var imageSize = new kakao.maps.Size(64, 69);
            var imageOption = { offset: new kakao.maps.Point(27, 69) };
            var markerImage = new kakao.maps.MarkerImage(
                imageSrc1,
                imageSize,
                imageOption
            );
    
            const newMarker = new kakao.maps.Marker({
                map: map,
                position: position,
                image: markerImage,
            });
    
            const customOverlay = await createCustomOverlay(marker);
    
            kakao.maps.event.addListener(newMarker, 'click', function () {
                customOverlay.setMap(map);
            });
    
            const closeButton = customOverlay.a.querySelector('.infoClose');
            closeButton.addEventListener('click', () => {
                customOverlay.setMap(null);
            });
    
            allMarkers.push({
                userId: marker.user_id,
                marker: newMarker,
                overlay: customOverlay,
            });
        })
    );
    updateMarkerVisibility();
}
    

function updateMarkerVisibility() {
    const selectedFilter = document.querySelector('input[name="markerFilter"]:checked').value;
    allMarkers.forEach(markerObj => {
        const isMyMarker = markerObj.userId === userId;
        const isFriendsMarker = friends.includes(markerObj.userId);
        const isNotMyMarker = !isMyMarker && !isFriendsMarker;

        let showMarker = false;

        if (isLoggedIn) {
            showMarker = (selectedFilter === 'myMarkers' && isMyMarker) ||
                         (selectedFilter === 'friendsMarkers' && isFriendsMarker) ||
                         (selectedFilter === 'allMarkers');
        } else {
            showMarker = (selectedFilter === 'allMarkers');
        }

        if (showMarker) {
            markerObj.marker.setMap(map);
        } else {
            markerObj.marker.setMap(null);
            markerObj.overlay.setMap(null);
        }
    });
}



// 필터를 변경할 때마다 updateMarkerVisibility 함수 호출
document.querySelectorAll('input[name="markerFilter"]').forEach(filterInput => {
    filterInput.addEventListener('change', updateMarkerVisibility);
});


//5단계 최종구현
displayMarkers();

//html에 오버레이 닫기 함수
function closeOverlay(){
    customOverlay.setMap(null);
}

