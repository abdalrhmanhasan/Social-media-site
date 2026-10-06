const API_KEY = "free_user_3KJhNOMg7XzB53GrQgIgUSVyhqB";

document.getElementById("btn").addEventListener("click", () => {
  axios
    .post(
      "https://reqres.in/api/login",
      {
        email: "charles.morris@reqres.in",
        password: "pistol",
      },
      { headers: { "x-api-key": API_KEY } },
      createNewUser(),
    )
    .then(function (response) {
      let token = response.data.token;
      localStorage.setItem("token", token);
      console.log("token:", token);
      createNewUser();
    });

  function createNewUser() {
    let token = localStorage.getItem("token");
    let config = {
      headers: {
        "x-api-key": API_KEY,
        Authorization: "Bearer " + token,
      },
    };

    axios
      .post(
        "https://reqres.in/api/users",
        { name: "Charles", job: "developer" },
        config,
      )
      .then(function (response) {
        console.log("created user:", response.data);
      })
      .catch(function (error) {
        console.log("create error:", error.response?.status);
      });
  }
});
