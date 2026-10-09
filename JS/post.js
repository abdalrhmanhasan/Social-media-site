const urlParam = new URLSearchParams(window.location.search);
window.goBack=goBack;
const id = urlParam.get("postId");
const baseUrl = "https://tarmeezacademy.com/api/v1";
console.log("postId:", id, "-> URL:", `${baseUrl}/posts/${id}`);
getPost();

function getPost() {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;
console.log("post:", response.data.data);
      document.getElementById("userComentName").innerHTML = author.username;

      // post image (only if it exists)
      let postImage = "";
      if (typeof post.image === "string" && post.image.trim() !== "") {
        postImage = `<img class="w-100" src="${post.image}" onerror="this.remove()" />`;
      }

      // tags
      let tagsHtml = "";
      for (let tag of post.tags) {
        tagsHtml += `
          <button class="btn bg-secondary text-light rounded-pill mb-1 ms-2 px-3 py-1">
            ${tag.name}
          </button>`;
      }

// comments
const commentsBox = document.getElementById("comments");
commentsBox.innerHTML = "";

if (comments.length === 0) {
  commentsBox.innerHTML = "<p class='text-muted'>No comments yet.</p>";
}

for (let comment of comments) {
  // profile_image can be missing or not a string, so check it
  let img = "/Assetes/Profile/profile.png";
  if (typeof comment.author.profile_image === "string" && comment.author.profile_image.trim() !== "") {
    img = comment.author.profile_image;
  }

  commentsBox.innerHTML += `
    <div class="comment">
      <div>
        <img class="pofile-pics m-1 rounded-circle" src="${img}"
             onerror="this.src='/Assetes/Profile/profile.png'" />
        <b>${comment.author.username}</b>
      </div>
      <div>
        <p>${comment.body}</p>
      </div>
    </div>`;
}

document.getElementById("post").innerHTML = `
  <div class="card shadow">
    <div class="card-header">
      <img src="/Assetes/Profile/profile.png"
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
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("post").innerHTML =
        "<h4>Could not load post.</h4>";
    });
}

function goBack(){
  window.location="index.html"
}

