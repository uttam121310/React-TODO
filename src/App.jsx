
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("myTasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  function addTask() {
    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      text: task.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }

  // Delete Task
  function deleteTask(index) {
    const updatedTasks = tasks.filter((item, i) => i !== index);
    setTasks(updatedTasks);

    if (editIndex === index) {
      setEditIndex(null);
      setEditText("");
    }
  }

  // Complete / Pending
  function toggleTask(index) {
    const updatedTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setTasks(updatedTasks);
  }

  // Start Editing
  function startEdit(index) {
    setEditIndex(index);
    setEditText(tasks[index].text);
  }

  // Save Edited Task
  function saveEdit(index) {
    if (editText.trim() === "") {
      alert("Task cannot be empty");
      return;
    }

    const updatedTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, text: editText.trim() };
      }
      return item;
    });

    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText("");
  }

  // Clear All Tasks
  function clearAllTasks() {
    if (tasks.length === 0) {
      alert("No tasks to clear!");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (confirmDelete) {
      setTasks([]);
      setEditIndex(null);
      setEditText("");
    }
  }

  // Task Summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;
  const pendingTasks = tasks.filter(
    (item) => !item.completed
  ).length;

  // Filter and Search Tasks
  const visibleTasks = tasks
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => {
      if (filter === "pending" && item.completed) return false;
      if (filter === "completed" && !item.completed) return false;

      return item.text.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="app-container">
      <main className="todo-dashboard">

        {/* Header */}
        <header className="app-header">
          <div className="logo-icon">✓</div>

          <div>
            <h1>TaskFlow</h1>
            <p>Organize your day, one task at a time.</p>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div>
            <p className="welcome-label">YOUR PERSONAL WORKSPACE</p>
            <h2>My To-Do List</h2>
            <p className="welcome-description">
              Stay focused and get things done.
            </p>
          </div>
        </section>

        {/* Add Task */}
        <section className="add-task-section">
          <h3>Add a New Task</h3>

          <div className="add-task-form">
            <input
              type="text"
              placeholder="What do you need to do?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />

            <button className="add-button" onClick={addTask}>
              + Add Task
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="summary-section">
          <div className="section-heading">
            <h3>Task Overview</h3>
            <span>Your progress at a glance</span>
          </div>

          <div className="summary-grid">
            <div className="summary-card total-card">
              <div className="summary-icon">▤</div>
              <p>Total Tasks</p>
              <h2>{totalTasks}</h2>
            </div>

            <div className="summary-card completed-card">
              <div className="summary-icon">✓</div>
              <p>Completed</p>
              <h2>{completedTasks}</h2>
            </div>

            <div className="summary-card pending-card">
              <div className="summary-icon">◷</div>
              <p>Pending</p>
              <h2>{pendingTasks}</h2>
            </div>
          </div>
        </section>

        {/* Task List */}
        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <h3>My Tasks</h3>
              <p>Manage and track your daily activities.</p>
            </div>

            <button
              className="clear-button"
              onClick={clearAllTasks}
            >
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search your tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Tasks
            </button>

            <button
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>

            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          {/* Task Items */}
          <div className="task-list">
            {visibleTasks.map((item) => {
              const index = item.originalIndex;

              return (
                <div
                  className={`task-card ${
                    item.completed ? "task-completed" : ""
                  }`}
                  key={index}
                >
                  {editIndex === index ? (
                    <div className="edit-area">
                      <input
                        className="edit-input"
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <button
                        className="save-button"
                        onClick={() => saveEdit(index)}
                      >
                        Save
                      </button>

                      <button
                        className="cancel-button"
                        onClick={() => {
                          setEditIndex(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="task-content">
                        <input
                          className="task-checkbox"
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleTask(index)}
                        />

                        <div className="task-text">
                          <h4>{item.text}</h4>
                          <span
                            className={`status ${
                              item.completed
                                ? "completed-status"
                                : "pending-status"
                            }`}
                          >
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          className="edit-button"
                          onClick={() => startEdit(index)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteTask(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {visibleTasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>No tasks found</h3>
                <p>
                  Try adding a new task or changing your search.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <p>Made with React · Stay productive!</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
