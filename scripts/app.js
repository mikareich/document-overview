window.URL = window.URL || window.webkitURL;
const fileInput = document.getElementById("file");
const documentListOL = document.getElementById("documents");
const files = JSON.parse(localStorage.getItem("document-overview") || "[]");
const saveFiles = () => {
  localStorage.setItem("document-overview", JSON.stringify(files));
};

fileInput.addEventListener("change", async function() {
  let filename = this.files[0].name;
  let path = window.URL.createObjectURL(this.files[0]);
  let responde = await fetch(path);
  let uploadDocument = new DOMParser().parseFromString(
    await responde.text(),
    "text/html"
  );
  if (files.filter(file => file.name === filename).length > 0) return;
  if (uploadDocument.querySelector("html").hasAttribute("data-unauthorized")) {
    alert(`${filename} has denied access`);
    return;
  }
  console.log(this.files[0])

  let title = uploadDocument.querySelector("[data-title]")
    ? uploadDocument.querySelector("[data-title]").textContent
    : uploadDocument.querySelector("title")
    ? uploadDocument.querySelector("title").textContent
    : "Untitled";
  let description = uploadDocument.querySelector("[data-description]")
    ? uploadDocument.querySelector("[data-description]").textContent
    : "No description available";

  let liElement = document.createElement("li");
  liElement.classList.add("document-overview-container");
  liElement.innerHTML = `<div class="index">0${documentListOL.children.length +
    1}</div><div class="title">${title}</div><div class="description">${description}</div>
    <a href="${path}">${filename}</a>`;
  documentListOL.appendChild(liElement);
});
