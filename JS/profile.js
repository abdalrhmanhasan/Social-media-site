const baseUrl = "https://tarmeezacademy.com/api/v1";
const defaultAvatar = "/Assetes/Profile/profile.png";

window.postClicked = (postId) => {
  window.location = `postDetail.html?postId=${postId}`;
};

// ?id= from the URL, otherwise the logged-in user
function getUserId() {
  const urlId = new URLSearchParams(window.location.search).get("id");
  if (urlId) return urlId;

  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.id : null;
}

const userId = getUserId();
console.log("profile for user id:", userId);

if (userId) {
  getUser(userId);
  getUserPosts(userId);
} else {
  document.getElementById("profile-posts").innerHTML =
    "<h4>Log in to see your profile.</h4>";
}

// ---------- PROFILE CARD ----------
function getUser(id) {
  axios
    .get(`${baseUrl}/users/${id}`)
    .then((response) => {
      const user = response.data.data;

      document.getElementById("profName").innerHTML = user.name;
      document.getElementById("profEmail").innerHTML = user.email;
      document.getElementById("postCount").innerHTML = user.posts_count;
      document.getElementById("comCount").innerHTML = user.comments_count;
      document.getElementById("profialeUserName").innerHTML =
        `<span>${user.username}</span> Posts:`;
    })
    .catch((error) => console.log(error));
}

// ---------- ONLY THIS USER'S POSTS ----------
function getUserPosts(id) {
  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data;
      const box = document.getElementById("profile-posts");
      box.innerHTML = "";

      if (posts.length === 0) {
        box.innerHTML = "<p class='text-muted'>No posts yet.</p>";
        return;
      }

      posts.forEach((pos, i) => {
        let postImage = "";
        if (typeof pos.image === "string" && pos.image.trim() !== "") {
          postImage = `<img class="w-100" src="${pos.image}" onerror="this.remove()" />`;
        }

        let tagsHtml = "";
        for (let tag of pos.tags ?? []) {
          tagsHtml += `
            <button class="btn bg-secondary text-light rounded-pill mb-1 ms-2 px-3 py-1">
              ${tag.name}
            </button>`;
        }

        box.innerHTML += `
          <div class="card shadow mb-5 post-card" style="animation-delay: ${Math.min(i, 10) * 0.08}s">
            <div class="card-header">
              <img src="${defaultAvatar}"
                   class="pofile-pics border border-2 rounded-circle" />
              <b class="ms-2">${pos.author.username}</b>
            </div>
            <div class="card-body" onclick="postClicked(${pos.id})">
              ${postImage}
              <h6 class="mt-2">${pos.created_at}</h6>
              <h4>${pos.title ?? ""}</h4>
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
      console.log("POSTS ERROR:", error);
      document.getElementById("profile-posts").innerHTML =
        `<h4>Could not load posts.</h4><p class="text-danger">${error.message}</p>`;
    });
}