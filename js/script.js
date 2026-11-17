
// ==========================================
// 1. LOCAL STORAGE FUNCTIONS
// ==========================================

// Get tasks from Local Storage
function getTasks() {

    const tasks = localStorage.getItem("studlyTasks");

    if (tasks === null) {
        return [];
    }

    try {

        const parsedTasks = JSON.parse(tasks);

        return Array.isArray(parsedTasks) ? parsedTasks : [];

    } catch (error) {

        console.error("Error loading tasks:", error);

        return [];

    }

}


// Save tasks in Local Storage
function saveTasks(tasks) {

    localStorage.setItem(
        "studlyTasks",
        JSON.stringify(tasks)
    );

}



// ==========================================
// 2. ADD SAMPLE TASKS
// ==========================================

function addSampleTasks() {

    const existingTasks = localStorage.getItem("studlyTasks");

    // Add sample tasks only on first visit
    if (existingTasks !== null) {
        return;
    }

    const sampleTasks = [

        {
            id: "1",
            title: "Complete ICT Assignment",
            subject: "ICT",
            dueDate: "2026-11-20",
            priority: "High",
            description: "Complete the university ICT project.",
            completed: false
        },

        {
            id: "2",
            title: "Prepare for Programming Quiz",
            subject: "ICP",
            dueDate: "2026-11-22",
            priority: "Medium",
            description: "Revise loops, arrays and functions.",
            completed: false
        },

        {
            id: "3",
            title: "Submit Mathematics Homework",
            subject: "Calculus",
            dueDate: "2026-11-25",
            priority: "Low",
            description: "Complete the assigned mathematics questions.",
            completed: true
        }

    ];

    saveTasks(sampleTasks);

}



// ==========================================
// 3. ADD NEW TASK
// ==========================================

function addTask(event) {

    // Prevent page refresh
    event.preventDefault();

    // Get form values
    const title = document.getElementById("task-title").value.trim();

    const subject = document.getElementById("task-subject").value.trim();

    const dueDate = document.getElementById("task-date").value;

    const priority = document.getElementById("task-priority").value;

    const description = document.getElementById("task-description").value.trim();


    // Check required fields
    if (!title || !subject || !dueDate || !priority) {

        alert("Please fill in all required fields.");

        return;

    }


    // Get existing tasks
    const tasks = getTasks();


    // Create new task
    const newTask = {

        id: Date.now().toString(),

        title: title,

        subject: subject,

        dueDate: dueDate,

        priority: priority,

        description: description,

        completed: false

    };


    // Add new task
    tasks.push(newTask);


    // Save tasks
    saveTasks(tasks);


    alert("Task added successfully!");


    // Open My Tasks page
    window.location.href = "tasks.html";

}



// ==========================================
// 4. DISPLAY ALL TASKS
// ==========================================

// Make special characters safe
function escapeHTML(text) {

    return String(text).replace(/[&<>"']/g, function(character) {

        const characters = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        };

        return characters[character];

    });

}


function displayTasks() {

    // Get HTML elements
    const taskList = document.getElementById("task-list");

    const emptyMessage = document.getElementById("empty-message");


    // Check if task list exists
    if (!taskList) {
        return;
    }


    // Get saved tasks
    const tasks = getTasks();


    // Clear old task cards
    taskList.innerHTML = "";


    // Check if there are no tasks
    if (tasks.length === 0) {

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;

    }


    // Hide empty message
    if (emptyMessage) {
        emptyMessage.hidden = true;
    }


    // Display each task
    tasks.forEach(function(task) {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        taskCard.innerHTML = `

            <h3>${escapeHTML(task.title)}</h3>

            <p><strong>Subject:</strong> ${escapeHTML(task.subject)}</p>

            <p><strong>Due Date:</strong> ${escapeHTML(task.dueDate)}</p>

            <p><strong>Priority:</strong> ${escapeHTML(task.priority)}</p>

            <p><strong>Description:</strong> ${escapeHTML(task.description || "No description")}</p>

            <p><strong>Status:</strong> ${task.completed ? "Completed" : "Pending"}</p>

            <div class="task-buttons">

                <button
                    class="complete-btn"
                    data-action="complete"
                    data-id="${escapeHTML(task.id)}"
                    ${task.completed ? "disabled" : ""}
                >

                    ${task.completed ? "Completed" : "Mark Complete"}

                </button>


                <button
                    class="delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(task.id)}"
                >

                    Delete

                </button>

            </div>

        `;


        taskList.appendChild(taskCard);

    });

}



// ==========================================
// 5. COMPLETE AND DELETE TASKS
// ==========================================


// Mark task as completed
function completeTask(taskId) {

    const tasks = getTasks();


    tasks.forEach(function(task) {

        if (task.id === taskId) {

            task.completed = true;

        }

    });


    saveTasks(tasks);

    displayTasks();

    updateDashboard();

    displayPendingTasks();

}



// Delete task
function deleteTask(taskId) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    const tasks = getTasks();


    const updatedTasks = tasks.filter(function(task) {

        return task.id !== taskId;

    });


    saveTasks(updatedTasks);

    displayTasks();

    updateDashboard();

    displayPendingTasks();

}



// ==========================================
// 6. DASHBOARD STATISTICS
// ==========================================

function updateDashboard() {

    // Get all tasks
    const tasks = getTasks();


    // Count total tasks
    const totalTasks = tasks.length;


    // Count completed tasks
    const completedTasks = tasks.filter(function(task) {

        return task.completed;

    }).length;


    // Count pending tasks
    const pendingTasks = tasks.filter(function(task) {

        return !task.completed;

    }).length;


    // Get today's date
    const today = new Date();

    const todayDate = today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");


    // Count pending tasks due today or earlier
    const dueTasks = tasks.filter(function(task) {

        return !task.completed && task.dueDate <= todayDate;

    }).length;


    // Get dashboard elements
    const totalElement = document.getElementById("total-tasks");

    const completedElement = document.getElementById("completed-tasks");

    const pendingElement = document.getElementById("pending-tasks");

    const dueElement = document.getElementById("due-tasks");


    // Display statistics
    if (totalElement) {
        totalElement.textContent = totalTasks;
    }

    if (completedElement) {
        completedElement.textContent = completedTasks;
    }

    if (pendingElement) {
        pendingElement.textContent = pendingTasks;
    }

    if (dueElement) {
        dueElement.textContent = dueTasks;
    }

}



// ==========================================
// 7. DISPLAY PENDING TASKS ON DASHBOARD
// ==========================================

function displayPendingTasks() {

    // Get pending task section
    const pendingList = document.getElementById("pending-list");


    // Stop if element does not exist
    if (!pendingList) {
        return;
    }


    // Get all tasks
    const tasks = getTasks();


    // Select pending tasks
    const pendingTasks = tasks.filter(function(task) {

        return !task.completed;

    });


    // Clear previous tasks
    pendingList.innerHTML = "";


    // Check if there are no pending tasks
    if (pendingTasks.length === 0) {

        pendingList.textContent = "No pending tasks.";

        return;

    }


    // Display pending tasks
    pendingTasks.forEach(function(task) {

        const taskItem = document.createElement("div");

        taskItem.className = "deadline-item";


        taskItem.innerHTML = `

            <div>

                <h4>${escapeHTML(task.title)}</h4>

                <p>Due Date: ${escapeHTML(task.dueDate)}</p>

                <p>Subject: ${escapeHTML(task.subject)}</p>

            </div>


            <span class="priority ${task.priority.toLowerCase()}">

                ${escapeHTML(task.priority)}

            </span>

        `;


        pendingList.appendChild(taskItem);

    });

}



// ==========================================
// 8. START STUDLY WEBSITE
// ==========================================

function startStudly() {

    // Add sample tasks on first visit
    addSampleTasks();


    // Display tasks on My Tasks page
    displayTasks();


    // Update dashboard statistics
    updateDashboard();


    // Display pending tasks on Dashboard
    displayPendingTasks();



    // Connect Add Task form
    const taskForm = document.getElementById("task-form");

    if (taskForm) {

        taskForm.addEventListener("submit", addTask);

    }



    // Connect Complete and Delete buttons
    const taskList = document.getElementById("task-list");

    if (taskList) {

        taskList.addEventListener("click", function(event) {

            const button = event.target.closest("button");


            if (!button) {
                return;
            }


            const taskId = button.getAttribute("data-id");

            const action = button.getAttribute("data-action");


            if (action === "complete") {

                completeTask(taskId);

            }


            if (action === "delete") {

                deleteTask(taskId);

            }

        });

    }

}



// ==========================================
// 9. RUN WEBSITE
// ==========================================

startStudly();
