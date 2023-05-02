// 변수 정의
const moduleMenu = document.querySelector(".module-menu"); //모듈 메뉴 아이콘
const moduleIcons = document.querySelectorAll(".module-icon:not(.module-menu)"); //모듈 아이콘
const moduleContents = document.querySelectorAll(".module-content"); //모듈 컨텐츠 클래스에 있는거(실제 구현사항)
let clickedIconIndex = -1; //클릭된아이콘순서에 -1

// 모듈 메뉴 관련 이벤트 리스너(밭전 모양으로 된 아이콘)
function initializeModuleMenu() {
  moduleMenu.addEventListener("click", () => { //모듈메뉴를 클릭하면
    const iconsContainer = document.querySelector(".module-icons"); //아이콘컨테이너에 모듈아이콘클래스가져옴
    iconsContainer.style.display = iconsContainer.style.display === "none" ? "flex" : "none"; //아이콘컨테이너의 스타일을 정의
    //style 객체의 display 속성 값을 확인하여 "none"인 경우 "flex"로, "flex"인 경우 "none"으로 변경하는 삼항 연산자
    clickedIconIndex = -1;
    moduleContents.forEach(content => content.style.display = "none"); //실제 구현된 요소들마다 모듈 내용을 숨김
  });
}
initializeModuleMenu();

// 모듈 아이콘들 관련 이벤트 리스너
function initializeModuleIcons() {
  moduleIcons.forEach((icon, index) => {
    icon.addEventListener("click", () => {
      if (clickedIconIndex === index) {
        moduleContents[index].style.display = "none";
        clickedIconIndex = -1;
      } else {
        moduleContents.forEach((content, contentIndex) => {
          content.style.display = contentIndex === index ? "block" : "none";
        });
        clickedIconIndex = index;
      }
    });
  });
}
initializeModuleIcons();

// 챗봇 메시지 추가 함수
function addChatbotMessage(message, role) {
  const messagesContainer = document.querySelector(".chatbot-messages");
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageElement.classList.add(role);
  messagesContainer.appendChild(messageElement);
}

// 챗봇 관련 이벤트 리스너
function initializeChatbot() {
  // 챗봇 제출 버튼 이벤트 리스너
  document.querySelector(".chatbot-submit").addEventListener("click", async () => {
    const inputElement = document.querySelector(".chatbot-input");
    const message = inputElement.value;
    inputElement.value = "";
    addChatbotMessage(message, "user");

    const response = await fetch("/openai/chatbot", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    addChatbotMessage(data.res, "chatbot");
  });

  // 챗봇 입력창 엔터 및 컨트롤+엔터 처리
  document.querySelector(".chatbot-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.target.value += "\n";
      } else {
        e.preventDefault();
        document.querySelector(".chatbot-submit").click();
      }
    }
  });
}
initializeChatbot();

// 아래부턴 2번아이콘입니다-----------------------------------------------------------------------------------------------------

// 마스킹 이벤트 리스너
function setupMaskingEventListener(image) {
  document.querySelector(".masking-button").addEventListener("click", () => {
    
    // 캔버스 생성 및 설정
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.position = "fixed";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.zIndex = "1000";

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 마스킹 클릭 이벤트
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const radius = 20; // 마스킹 원의 반지름

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    });

    document.body.appendChild(canvas);

    // 확인 버튼 생성 및 설정
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "확인";
    confirmButton.style.position = "fixed";
    confirmButton.style.top = "50%";
    confirmButton.style.left = "50%";
    confirmButton.style.transform = "translate(-50%, calc(-50% - 40px))";
    confirmButton.style.zIndex = "1001";
    
    confirmButton.addEventListener("click", () => {
      const maskedDataURL = canvas.toDataURL();
      applyMaskedImageToImage2(maskedDataURL);
      document.body.removeChild(canvas);
      document.body.removeChild(confirmButton);

      // 마스킹 버튼 숨기기, 제출 버튼 보이기
      document.querySelector(".masking-button").style.display = "none";
      document.querySelector(".dalle-submit").style.display = "block";
    });

    document.body.appendChild(confirmButton);
  });
}

function applyMaskedImageToImage2(maskedImageDataUrl) {
  const image2 = new Image();
  image2.src = maskedImageDataUrl;
  image2.onload = () => {
    const image2Input = document.getElementById("image2");
    fetch(maskedImageDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "masked-image.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        image2Input.files = dataTransfer.files;
      });
  };
}

// 마스킹 초기화
function initializeMasking() {
  document.getElementById("image1").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        setupMaskingEventListener(image);
      };
    };
    reader.readAsDataURL(file);
  });

  // 이미지2 입력 비활성화
  document.getElementById("image2").style.pointerEvents = "none";
}

// 제출 버튼 이벤트 리스너
function setupSubmitButtonEventListener() {
  document.querySelector(".dalle-submit").addEventListener("click", () => {
    const image1Input = document.getElementById("image1");
    const image2Input = document.getElementById("image2");
    const promptInput = document.getElementById("prompt");

    // FormData 생성
    const formData = new FormData();
    formData.append("image1", image1Input.files[0]);
    formData.append("image2", image2Input.files[0]);
    formData.append("prompt", promptInput.value);

    // 서버로 이미지와 프롬프트 전송
    fetch("/openai/dalle2", {
      method: "POST",
      body: formData
    }).then(response => {
      // 응답 처리
      if (response.ok) {
        // 이미지 출력
        response.text().then(dalle2ImageUrl => { // 수정된 부분: response.text() 사용
          console.log("Image URL:", dalle2ImageUrl);
          const outputImage = document.createElement("img");
          outputImage.src = dalle2ImageUrl;
          outputImage.id = "outputImage";
          document.body.appendChild(outputImage);
        });
      } else {
        console.error("Request failed");
      }
    }).catch(error => {
      console.error("Request error:", error);
    });
  });
}

initializeMasking();
setupSubmitButtonEventListener();


// 아래부턴 3번 아이콘입니다 ------------------------------------------------------------------------------------------


function initializeCustomDalle() {
  // 커스텀 DALLE 제출 버튼 이벤트 리스너
  document.querySelector(".c-dalle-submit").addEventListener("click", async () => {
    const message = document.querySelector(".c-dalle-input").value;
    const response = await fetch("/openai/dalle1", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    // 이미지 URL을 사용하여 이미지 요소에 이미지를 설정합니다.
    const displayedImage = document.getElementById("displayedImage");
    displayedImage.src = data.image_url;
    displayedImage.style.display = "block";

    // 다운로드 버튼에 이미지 URL을 추가하고 표시합니다.
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.href = data.image_url;
    downloadBtn.setAttribute("download", "generated_image.png");
    downloadBtn.style.display = "block";

    const backBtn = document.getElementById("backBtn");
    backBtn.style.display = "block";
  });
  // 돌아가기 버튼 이벤트 리스너
  document.getElementById("backBtn").addEventListener("click", () => {
    document.querySelector(".c-dalle-input").value = "";
    document.getElementById("displayedImage").style.display = "none";
    document.getElementById("downloadBtn").style.display = "none";
    document.getElementById("backBtn").style.display = "none";
  });

  // 커스텀 DALLE 입력창 엔터 및 컨트롤+엔터 처리
  document.querySelector(".c-dalle-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.target.value += "\n";
      } else {
        e.preventDefault();
        document.querySelector(".c-dalle-submit").click();
      }
    }
  });
}
initializeCustomDalle();
``