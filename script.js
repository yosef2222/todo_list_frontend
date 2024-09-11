const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function addTask() {
  if (inputBox.value === "") {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

function exportToJson() {
  const tasks = [];
  const listItems = document.querySelectorAll("li");

  listItems.forEach((item) => {
    tasks.push({
      text: item.childNodes[0].nodeValue.trim(),
      checked: item.classList.contains("checked"),
    });
  });

  const jsonString = JSON.stringify(tasks);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "todo-list.json";
  link.click();
}

function importFromJson(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const tasks = JSON.parse(event.target.result);
    listContainer.innerHTML = ""; // Clear the current list

    tasks.forEach((task) => {
      let li = document.createElement("li");
      li.innerHTML = task.text;
      if (task.checked) {
        li.classList.add("checked");
      }

      let span = document.createElement("span");
      span.innerHTML = "\u00d7";
      li.appendChild(span);
      listContainer.appendChild(li);
    });

    saveData(); // Save imported tasks to localStorage
  };

  reader.readAsText(file);
}
