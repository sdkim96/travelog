function login() {
    var id = document.querySelector("#id");
    var pw = document.querySelector("#pw");
    if (id.value == "" || pw.value == "") {
        alert("로그인을 할 수 없습니다");
    } else {
        location.href = "main.html";
    }

    function back() {
        history.go(-1);
    }

    function create_id() {
        var id = document.querySelector("#id");
        var pw = document.querySelector("#pw");
        var r_pw = document.querySelector("#r_pw");
        if (id.value == "" || pw.value == "" || r_pw.value == "") {
            alert("회원가입을 할 수 없습니다");
        } else {
            if (pw.value !== r_pw.value) {
                alert("비밀번호를 확인해주세요.");
            } else {
                location.href = "logim.html";
            }
        }
    }
}

const signup = document.getElementById('sign-up');
signin = document.getElementById("sign-in");
loginin = document.getElementById("login-in");
loginup = document.getElementById("login-up");

signup.addEventListener("click", () => {
    loginin.classList.remove("block");
    loginup.classList.remove("none");

    loginin.classList.add("none");
    loginup.classList.add("block");
})

signin.addEventListener("click", () => {
    loginin.classList.remove("none");
    loginup.classList.remove("block");

    loginin.classList.add("block");
    loginup.classList.add("none");
})
