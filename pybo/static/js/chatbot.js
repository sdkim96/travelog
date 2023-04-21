// 아래는 채팅 아이콘을 클릭하면 실행되는 함수를 정의. 
// 이 함수는 채팅창('.chat-content')를 보이게 하고 ('chat-icon')을 숨김
document.querySelector(".chat-icon").addEventListener("click", function() {
  document.querySelector(".chat-content").style.display = "block";
  document.querySelector(".chat-icon").style.display = "none";
});

// 채팅 창의 닫기 버튼을 클릭하면 실행되는 함수를 정의. 
// 이 함수는 채팅 창을 숨기고, 채팅 아이콘을 다시 보이게 함.
document.querySelector(".chat-header .close").addEventListener("click", function() {
  document.querySelector(".chat-content").style.display = "none";
  document.querySelector(".chat-icon").style.display = "block";
});

// 채팅 입력창의 전송 버튼을 클릭하면 실행되는 함수를 정의. 
// 이 함수는 입력창에 입력된 메시지를 추출하여, 
// 채팅 목록(.chat-list)에 사용자 메시지를 먼저 추가한 다음, 
// 챗봇이 반환한 메시지를 추가함. 마지막으로 입력창의 값을 초기화.
document.querySelector(".chat-input button").addEventListener("click", async function() {
  const input = document.querySelector(".chat-input input");
  const message = input.value.trim();

  if (message.length > 0) {
    const chatList = document.querySelector(".chat-list");
    const userMessage = document.createElement("li");
    userMessage.textContent = message;
    userMessage.style.textAlign = "right";
    chatList.appendChild(userMessage);

    const res = await fetch("/openai/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `message=${encodeURIComponent(message)}`
    }).then(response => response.json());

    const botMessage = document.createElement("li");
    botMessage.textContent = res.res;
    chatList.appendChild(botMessage);
    
    input.value = "";
  }
});

// 채팅 입력창에서 키보드의 Enter 키를 누르면 실행되는 함수를 정의. 
// 이 함수는 전송 버튼을 클릭하는 것과 동일한 동작을 수행.
document.querySelector(".chat-input input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector(".chat-input button").click();
  }
});
