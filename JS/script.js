const baseUrl = "https://tarmeezacademy.com/api/v1";
window.logInBtn = logInBtn;
window.logout = logout;
// ---------- POSTS ----------
axios
  .get(`${baseUrl}/posts?limit=50`)
  .then((response) => {
    const posts = response.data.data;
    let allPosts = "";

    posts.forEach((pos, i) => {
      let postImage = "";
      if (
        pos.image != null &&
        typeof pos.image === "string" &&
        pos.image.trim() !== ""
      ) {
        postImage = `<img class="w-100" src="${pos.image}" onload="this.style.opacity=1" onerror="this.remove()" />`;
      }

      const postTitle = pos.title != null ? pos.title : "";

      allPosts += `
        <div class="card shadow mb-5 post-card" style="animation-delay: ${Math.min(i, 10) * 0.08}s">
          <div class="card-header">
            <img
              src="/Assetes/Profile/profile.png"
              class="pofile-pics border border-2 rounded-circle"
            />
            <b class="ms-2">${pos.author.username}</b>
          </div>
          <div class="card-body">
            ${postImage}
            <h6 class="mt-2">${pos.created_at}</h6>
            <h4>${postTitle}</h4>
            <p class="mt-4">${pos.body}</p>
            <hr>
            <div>
              <img src="/Assetes/Post pics/pen.svg"/>
              <span>(${pos.comments_count}) comments</span>
            </div>
          </div>
        </div>`;
    });

    document.getElementById("posts").innerHTML = allPosts;
  })
  .catch((error) => {
    console.log(error);
    document.getElementById("posts").innerHTML =
      "<h4>Could not load posts.</h4>";
  });

// ---------- LOG IN ----------
function logInBtn() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("pass").value;

  axios
    .post(`${baseUrl}/login`, { username, password })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("loginModal");
      const modalInst =
        bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      modalInst.hide();
      showSuccsessMassege("Nice, you logged in successfully!");
      setupUI();
    })
    .catch((error) => {
      const msg = error.response?.data?.message || "Something went wrong";
      alert(msg);
    });
}

function showSuccsessMassege(message) {
  const alertPlaceholder = document.getElementById("succsessAlert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-success alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alertPlaceholder.append(wrapper);

  // auto-remove after 3 seconds
  setTimeout(() => wrapper.remove(), 3000);
}

function setupUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const RegisterBtn = document.getElementById("Register-btn");
  const logoutBtn = document.getElementById("logedOut");

  if (token == null) {
    // logged out
    loginBtn.style.display = "";
    RegisterBtn.style.display = "";
    logoutBtn.style.display = "none";
  } else {
    // logged in
    loginBtn.style.display = "none";
    RegisterBtn.style.display = "none";
    logoutBtn.style.display = "";
  }
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  alert("logout");
  showSuccsessMassege("you logged out successfully!")
  setupUI();
}
setupUI();
