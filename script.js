const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem("myTasks"));
  if (Array.isArray(saved)) tasks = saved.filter(item => item && typeof item.text === "string" && typeof item.id === "string");
} catch (error) {
  console.warn("Saved tasks could not be read.");
}
function saveTasks() {
  try { localStorage.setItem("myTasks", JSON.stringify(tasks)); }
  catch (error) { console.warn("Local storage is unavailable."); }
}
function showTasks() {
  taskList.replaceChildren();
  empty.hidden = tasks.length > 0;
  count.textContent = tasks.filter(task => task.completed).length + " of " + tasks.length + " completed";
  for (const task of tasks) {
    const item = document.createElement("li");
    if (task.completed) item.classList.add("done");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = Boolean(task.completed);
    check.setAttribute("aria-label", "Complete " + task.text);
    check.addEventListener("change", function() {
      task.completed = check.checked;
      saveTasks(); showTasks();
    });
    const name = document.createElement("span");
    name.textContent = task.text;
    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", "Delete " + task.text);
    remove.addEventListener("click", function() {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks(); showTasks();
    });
    item.append(check, name, remove);
    taskList.appendChild(item);
  }
}
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({id: String(Date.now()) + "-" + Math.random(), text: text, completed: false});
  taskInput.value = "";
  saveTasks(); showTasks(); taskInput.focus();
});
showTasks();
