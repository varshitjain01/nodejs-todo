/* =====================
   DASHBOARD UPDATE
===================== */
function updateDashboard() {
  const allTasks = document.querySelectorAll(".todo-list li");
  const visibleTasks = Array.from(allTasks).filter(
    li => li.style.display !== "none"
  );

  const completed = visibleTasks.filter(li =>
    li.classList.contains("done")
  ).length;

  document.getElementById("total").innerText = visibleTasks.length;
  document.getElementById("completed").innerText = completed;
  document.getElementById("pending").innerText =
    visibleTasks.length - completed;

  document.getElementById("progress").innerText =
    visibleTasks.length === 0
      ? "0%"
      : Math.round((completed / visibleTasks.length) * 100) + "%";
}

/* =====================
   SEARCH FILTER
===================== */
document.getElementById("search").addEventListener("keyup", function () {
  const query = this.value.toLowerCase();

  document.querySelectorAll(".todo-list li").forEach(task => {
    const text = task.innerText.toLowerCase();
    task.style.display = text.includes(query) ? "" : "none";
  });

  updateDashboard();
});

/* =====================
   FILTER (ALL / DONE / PENDING)
===================== */
document.getElementById("filter").addEventListener("change", function () {
  const value = this.value;

  document.querySelectorAll(".todo-list li").forEach(task => {
    if (value === "all") {
      task.style.display = "";
    } else if (value === "completed") {
      task.style.display = task.classList.contains("done") ? "" : "none";
    } else {
      task.style.display = !task.classList.contains("done") ? "" : "none";
    }
  });

  updateDashboard();
});

/* =====================
   THEME TOGGLE
===================== */
const themeBtn = document.getElementById("themeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
});

/* =====================
   INITIAL LOAD
===================== */
updateDashboard();
