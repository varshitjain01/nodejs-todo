function updateDashboard() {
  const tasks = document.querySelectorAll(".todo-list li");
  const done = document.querySelectorAll(".todo-list li.done").length;

  document.getElementById("total").innerText = tasks.length;
  document.getElementById("completed").innerText = done;
  document.getElementById("pending").innerText = tasks.length - done;
  document.getElementById("progress").innerText =
    tasks.length ? Math.round((done / tasks.length) * 100) + "%" : "0%";
}

document.getElementById("search").onkeyup = function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll(".todo-list li").forEach(li => {
    li.style.display = li.innerText.toLowerCase().includes(q) ? "" : "none";
  });
};

updateDashboard();
