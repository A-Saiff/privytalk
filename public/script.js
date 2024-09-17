const socket = io();
const usernameDiv = document.querySelector("#username");
const chatDiv = document.querySelector("#chat");
const msgdiv = document.querySelector(".messages");
const usersDiv = document.querySelector(".usersMain");
let username = "Unknown";

document.addEventListener("DOMContentLoaded", (ev) => {
  document.querySelector("#username form input").value =
    localStorage.getItem("username");
});

document.querySelector("#username form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  usernameDiv.classList.add("hidden");
  chatDiv.classList.remove("hidden");
  document.querySelector(".users").classList.remove("hidden");
  username = document.querySelector("#username form input").value;
  localStorage.setItem("username", username);
  socket.emit("username", username);
});

socket.on("user joined", (data) => {
  msgdiv.innerHTML += `
        <div class="joined self-center text-green-500 my-1 tracking-tight">
            <span class="font-bold">${data.username}</span> joined the chat!
        </div>
        `;
  usersDiv.innerHTML = "";
  data.users.forEach((user) => {
    usersDiv.innerHTML += `
          <div class="bg-gray-500 rounded-3xl p-2 my-2">${user}</div>
        `;
    msgdiv.scrollTop = msgdiv.scrollHeight;
  });
});

document.querySelector("#chat form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  let msgInput = document.querySelector("#chat form input");
  let msg = msgInput.value;
  msgInput.value = "";
  msgdiv.innerHTML += `
        <div
            class="outgoing self-end max-w-[75%] bg-emerald-500 rounded-3xl rounded-tr-none p-2 mb-1"
          >
            <p class="break-words">${msg}</p>
          </div>
        `;
  msgdiv.scrollTop = msgdiv.scrollHeight;

  socket.emit("chat message", { msg, username });
});

let tid;
document.addEventListener("visibilitychange", (evt) => {
  if (document.hidden) {
    tid = setTimeout(() => {
      window.location.reload();
    }, 15000);
  } else {
    clearTimeout(tid);
  }
});

socket.on("chat message", (data) => {
  console.log(data);
  msgdiv.innerHTML += `
        <div class="incoming self-start max-w-[75%] mb-2">
            <h3 class="text-gray-300 font-semibold text-sm">${data.username}</h3>
            <p
              class="bg-zinc-400 p-2 rounded-3xl rounded-tl-none break-words w-fit"
            >${data.msg}</p>
          </div>
        `;
  msgdiv.scrollTop = msgdiv.scrollHeight;
});

socket.on("user left", (data) => {
  msgdiv.innerHTML += `
          <div class="left self-center text-rose-400 my-1 tracking-tight">
            <span class="font-bold">${data.username}</span> left the chat!
          </div>
        `;
  msgdiv.scrollTop = msgdiv.scrollHeight;

  usersDiv.innerHTML = "";
  data.users.forEach((user) => {
    usersDiv.innerHTML += `
          <div class="bg-gray-500 rounded-3xl p-2 my-2">${user}</div>
        `;
  });
});
