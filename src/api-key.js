//API Functions

const storeApiKey = (userApiKey) => {
    sessionStorage.setItem("user-api-key", userApiKey);
  };

const changeApiMenu = () => {
  document.querySelector(".settings-title").classList.toggle("hidden");
  document.querySelector(".settings-desc").classList.toggle("hidden");
  document
    .querySelector(".api-input-wrapper")
    .before(
      (document.createElement("p").innerText =
        "Enter a new API key to change it")
    );
};

  export default {storeApiKey, changeApiMenu}