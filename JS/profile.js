const baseUrl = "https://tarmeezacademy.com/api/v1";
let id =1
function getUsers(id) {
  axios
    .get(`${baseUrl}/users/${id}`)
    .then((response) => {
    //   console.log(response.data.data);

    const user=response.data.data
    document.getElementById("profEmail").innerHTML=user.email
    document.getElementById("profName").innerHTML=user.name


    document.getElementById("comCount").innerHTML=user.comments_count
    document.getElementById("postCount").innerHTML=user.posts_count

    })
    .catch((error) => {
      console.log(error);
    });
}
getUsers(1);
getPosts()

function getPosts() {
  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data;
      
      
      
      console.log(posts);

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