const baseUrl = "https://tarmeezacademy.com/api/v1";

window.logInBtn = logInBtn;
window.logout = logout;
window.RegBtn = RegBtn;
window.AddingBtn = AddingBtn;
window.postClicked = postClicked;
window.editBtn = editBtn;
window.addingPost = addingPost;
window.showSuccsessMassege = showSuccsessMassege;
window.DeleteBtn = DeleteBtn;
window.confirmDelete = confirmDelete;

let deletingPostId = null;

let curruntPage = 1;
let lastPage;
let editingPostId = null;
const postsById = {};

window.addEventListener("scroll", () => {
  if (!document.getElementById("posts")) return;
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && curruntPage < lastPage) {
    curruntPage++;
    getPosts(false, curruntPage);
  }
});

if (document.getElementById("posts")) {
  getPosts();
}

function getPosts(reload = true, page = 1) {
  axios
    .get(`${baseUrl}/posts?limit=4&page=${page}`)
    .then((response) => {
      const posts = response.data.data;
      lastPage = response.data.meta.last_page;
      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

      const user = JSON.parse(localStorage.getItem("user"));

      posts.forEach((pos, i) => {
        postsById[pos.id] = pos;

        let postImage = "";
        if (
          pos.image != null &&
          typeof pos.image === "string" &&
          pos.image.trim() !== ""
        ) {
          postImage = `<img class="w-100" src="${pos.image}" onload="this.style.opacity=1" onerror="this.remove()" />`;
        }

        const postTitle = pos.title != null ? pos.title : "";

        let tagsHtml = "";
        for (let tag of pos.tags) {
          tagsHtml += `
          <button class="btn bg-secondary text-light rounded-pill mb-1 ms-2 px-3 py-1">
            ${tag.name}
          </button>`;
        }

        const editHtml =
          user != null && user.id === pos.author.id
            ? `<div class="btn btn-outline-danger mt-1 ms-2 edit-btn" onclick="DeleteBtn(${pos.id})">Delete</div>
            <div class="btn btn-outline-secondary mt-1 edit-btn" onclick="editBtn(${pos.id})">Edit</div>`
            : "";

        document.getElementById("posts").innerHTML += `
        <div class="card shadow mb-5 post-card" style="animation-delay: ${Math.min(i, 10) * 0.08}s">
          <div class="card-header">
            <img
              src="/Assetes/Profile/profile.png"
              class="pofile-pics border border-2 rounded-circle"
            />
            <b class="ms-2">${pos.author.username}</b>
            ${editHtml}
          </div>
          <div class="card-body" onclick="postClicked(${pos.id})">
            ${postImage}
            <h6 class="mt-2">${pos.created_at}</h6>
            <h4>${postTitle}</h4>
            <p class="mt-4">${pos.body}</p>
            <hr>
            <div>
              <img src="/Assetes/Post pics/pen.svg"/>
              <span>(${pos.comments_count}) comments</span>
              <span>${tagsHtml}</span>
            </div>
          </div>
        </div>`;
      });
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("posts").innerHTML =
        "<h4>Could not load posts.</h4>";
    });
}

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
      showSuccsessMassege("you logged in successfully!");
      setupUI();
      if (document.getElementById("posts")) getPosts();
    })
    .catch((error) => {
      const msg = error.response?.data?.message || "Something went wrong";
      alert(msg);
    });
}

function showSuccsessMassege(message, type = "success") {
  const alertPlaceholder = document.getElementById("succsessAlert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alertPlaceholder.append(wrapper);

  setTimeout(() => wrapper.remove(), 3000);
}

function setupUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const RegisterBtn = document.getElementById("Register-btn");
  const logoutDiv = document.getElementById("logOutDiv");
  const addpostBtn = document.getElementById("addingPost");

  if (token == null) {
    loginBtn.style.display = "";
    RegisterBtn.style.display = "";
    logoutDiv.classList.add("d-none");
    if (addpostBtn != null) {
      addpostBtn.style.display = "none";
    }
  } else {
    loginBtn.style.display = "none";
    RegisterBtn.style.display = "none";
    logoutDiv.classList.remove("d-none");
    if (addpostBtn != null) {
      addpostBtn.style.display = "";
    }

    const user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("profileUserName").innerHTML = user.username;
  }
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  showSuccsessMassege("you logged out successfully!");
  setupUI();
  if (document.getElementById("posts")) getPosts();
}
setupUI();

function RegBtn() {
  const name = document.getElementById("reg-name").value;
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-pass").value;

  axios
    .post(`${baseUrl}/register`, { name, username, password })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("RegModal");
      const modalInst =
        bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      modalInst.hide();
      showSuccsessMassege("you've been registered successfully!");
      setupUI();
    })
    .catch((error) => {
      const msg = error.response?.data?.message || "Something went wrong";
      alert(msg);
    });
}

function AddingBtn() {
  const title = document.getElementById("addingTitle").value;
  const body = document.getElementById("addingBody").value;
  const image = document.getElementById("addingImage").files[0];
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  if (image) {
    formData.append("image", image);
  }

  let url = `${baseUrl}/posts`;
  let successMsg = "New Post Was Created";

  if (editingPostId !== null) {
    url = `${baseUrl}/posts/${editingPostId}`;
    formData.append("_method", "put");
    successMsg = "Post Was Updated";
  }

  axios
    .post(url, formData, { headers })
    .then(() => {
      const modal = document.getElementById("addingModal");
      const modalInst =
        bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      modalInst.hide();
      showSuccsessMassege(successMsg, "primary");

      curruntPage = 1;
      getPosts();
    })
    .catch((error) => {
      const msg = error.response?.data?.message || "Something went wrong";
      showSuccsessMassege(msg, "danger");
    });
}

function editBtn(postId) {
  const post = postsById[postId];
  editingPostId = postId;

  document.getElementById("addingModalTitle").innerHTML = "Edit Post";
  document.getElementById("addingSubmitBtn").innerHTML = "Update";
  document.getElementById("addingTitle").value = post.title ?? "";
  document.getElementById("addingBody").value = post.body;
  document.getElementById("addingImage").value = "";

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("addingModal"),
  );
  modal.show();
}

function addingPost() {
  editingPostId = null;

  document.getElementById("addingModalTitle").innerHTML = "Creat a New Post";
  document.getElementById("addingSubmitBtn").innerHTML = "Creat a New post";
  document.getElementById("addingTitle").value = "";
  document.getElementById("addingBody").value = "";
  document.getElementById("addingImage").value = "";
}

function postClicked(postId) {
  window.location = `postDetail.html?postId=${postId}`;
}

function DeleteBtn(postId) {
  deletingPostId = postId;

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("deleteModal"),
  );
  modal.show();
}

function confirmDelete() {
  const token = localStorage.getItem("token");

  axios
    .delete(`${baseUrl}/posts/${deletingPostId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("deleteModal"),
      );
      modal.hide();
      showSuccsessMassege("Post Was Deleted", "success");

      deletingPostId = null;
      curruntPage = 1;
      getPosts(); // refresh the feed, no page reload
    })
    .catch((error) => {
      const msg = error.response?.data?.message || "Something went wrong";
      showSuccsessMassege(msg, "danger");
    });
}
