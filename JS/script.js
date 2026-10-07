window.logInBtn = logInBtn


axios
  .get("https://tarmeezacademy.com/api/v1/posts?limit=50")
  .then((response) => {
    let post = response.data.data;
    document.getElementById("posts").innerHTML = "";

    let allPosts = "";

    post.forEach((pos, i) => {
      let postimge = "";
      if (
        pos.image != null &&
        typeof pos.image === "string" &&
        pos.image.trim() !== ""
      ) {
        postimge = `<img class="w-100" src="${pos.image}" onload="this.style.opacity=1" onerror="this.remove()" />`;
      }

      let postTitle = "";
      if (pos.title != null) {
        postTitle = pos.title;
      }

      let content = `
      <div class="card shadow mb-5 post-card" style="animation-delay: ${Math.min(i, 10) * 0.08}s">
        <div class="card-header">
          <img
            src="/Assetes/Profile/profile.png"
            class="pofile-pics border border-2 rounded-circle"
          />
          <b class="ms-2">${pos.author.username}</b>
        </div>
        <div class="card-body">
          ${postimge}
          <h6 class="mt-2">${pos.created_at}</h6>
          <h4>${postTitle}</h4>
          <p class="mt-4">${pos.body}</p>
          <hr>
          <div>
            <img src="/Assetes/Post pics/pen.svg"/>
            <span>
              (${pos.comments_count}) comments
            </span>
          </div>
        </div>
      </div>`;

      allPosts += content;
    });

    document.getElementById("posts").innerHTML = allPosts;
  });


function logInBtn(){
  const username =document.getElementById("username").value
  const password =document.getElementById("pass").value

  console.log(username,password)
}