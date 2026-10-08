const urlParam = new URLSearchParams(window.location.search);
const id = urlParam.get("postId");
const baseUrl = "https://tarmeezacademy.com/api/v1";

getPost();
function getPost() {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;

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
      let commentsHtml = "";
      for (let comment of comments) {
        commentsHtml += `
          <div class="p-3 mb-2 bg-light rounded">
            <img src="${comment.author.profile_image}"
                 class="pofile-pics border border-2 rounded-circle"
                 onerror="this.src='/Assetes/Profile/profile.png'" />
            <b class="ms-2">${comment.author.username}</b>
            <p class="mt-2 mb-0">${comment.body}</p>
          </div>`;
      }

      document.getElementById("post").innerHTML = `
        <div class="card shadow mb-5">
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
          <div class="p-3">${commentsHtml}</div>
        </div>`;
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("post").innerHTML = "<h4>Could not load post.</h4>";
    });
}