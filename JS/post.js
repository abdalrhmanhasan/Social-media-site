const urlParam = new URLSearchParams(window.location.search);
const id = urlParam.get("postId");
const baseUrl = "https://tarmeezacademy.com/api/v1";
const defaultAvatar = "/Assetes/Profile/profile.png";

window.goBack = goBack;
window.addComment = addComment;

if (id) {
  getPost();
} else {
  document.getElementById("post").innerHTML = "<h4>No post selected.</h4>";
}

function getPost() {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;

      document.getElementById("userComentName").innerHTML = author.username;

      // ---------- POST IMAGE (only if it exists) ----------
      let postImage = "";
      if (typeof post.image === "string" && post.image.trim() !== "") {
        postImage = `<img class="w-100" src="${post.image}" onerror="this.remove()" />`;
      }

      // ---------- TAGS ----------
      let tagsHtml = "";
      for (let tag of post.tags) {
        tagsHtml += `
          <button class="btn bg-secondary text-light rounded-pill mb-1 ms-2 px-3 py-1">
            ${tag.name}
          </button>`;
      }

      // ---------- POST CARD ----------
      document.getElementById("post").innerHTML = `
        <div class="card shadow">
          <div class="card-header">
            <img src="${defaultAvatar}"
                 class="pofile-pics border border-2 rounded-circle" />
            <b class="ms-2">${author.username}</b>
          </div>
          <div class="card-body">
            ${postImage}
            <h6 class="mt-2">${post.created_at}</h6>
            <h4>${post.title ?? ""}</h4>
            <p class="mt-4">${post.body}</p>
            <hr />
            <div>
              <span>(${post.comments_count}) comments</span>
              <span>${tagsHtml}</span>
            </div>
          </div>
        </div>`;

      // ---------- COMMENTS ----------
      let commentsHtml = "";

      if (comments.length === 0) {
        commentsHtml = "<p class='text-muted'>No comments yet.</p>";
      }

      for (let comment of comments) {
        let img = defaultAvatar;
        if (
          typeof comment.author.profile_image === "string" &&
          comment.author.profile_image.trim() !== ""
        ) {
          img = comment.author.profile_image;
        }

        commentsHtml += `
          <div class="comment">
            <div>
              <img class="pofile-pics m-1 rounded-circle" src="${img}"
                   onerror="this.src='${defaultAvatar}'" />
              <b>${comment.author.username}</b>
            </div>
            <div>
              <p>${comment.body}</p>
            </div>
          </div>`;
      }

      // ---------- ADD COMMENT BOX (only for logged-in users) ----------
      const token = localStorage.getItem("token");

      if (token != null) {
        commentsHtml += `
          <div class="d-flex mt-3" id="add-comment-div">
            <input
              id="comment-input"
              type="text"
              class="form-control"
              placeholder="add your comment here."
            />
            <button class="btn btn-outline-primary ms-2" type="button" onclick="addComment()">
              Send
            </button>
          </div>`;
      }

      document.getElementById("comments").innerHTML = commentsHtml;
    })
    .catch((error) => {
      console.log("REAL ERROR:", error);
      document.getElementById("post").innerHTML =
        `<h4>Could not load post.</h4><p class="text-danger">${error.message}</p>`;
    });
}

function addComment() {
  const input = document.getElementById("comment-input");
  const body = input.value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    showSuccsessMassege("Log in first", "danger");
    return;
  }

  if (body === "") {
    showSuccsessMassege("Write a Comment First", "danger");
    return;
  }

  axios
    .post(
      `${baseUrl}/posts/${id}/comments`,
      { body },
      { headers: { authorization: `Bearer ${token}` } },
    )
    .then(() => {
      showSuccsessMassege("The Comment Was Successfully added", "success");
      getPost(); // re-fetch and re-render, no page refresh
    })
    .catch((error) => {
      console.log(error);
      showSuccsessMassege(
        error.response?.data?.message || "Something went wrong",
        "danger",
      );
    });
}

function goBack() {
  window.location = "index.html";
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

  // auto-remove after 3 seconds
  setTimeout(() => wrapper.remove(), 3000);
}
