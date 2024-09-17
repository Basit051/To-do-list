let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let history = JSON.parse(localStorage.getItem('history')) || [];

        function renderTasks() {
            const taskList = document.getElementById('tasks');
            taskList.innerHTML = '';
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `priority-${task.priority}`;
                li.innerHTML = `
                    <div class="task-content">
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button onclick="completeTask(${index})">Complete</button>
                            <button onclick="editTask(${index})">Edit</button>
                            <button onclick="deleteTask(${index})">Delete</button>
                        </div>
                    </div>
                    <div class="task-time">${new Date(task.time).toLocaleString()}</div>
                `;
                taskList.appendChild(li);
            });
            saveTasks();
        }

        function renderHistory() {
            const historyList = document.getElementById('history');
            historyList.innerHTML = '';
            history.slice().reverse().forEach((task) => {
                const li = document.createElement('li');
                li.className = `priority-${task.priority}`;
                li.innerHTML = `
                    <div class="task-content">
                        <span class="task-text">${task.text}</span>
                    </div>
                    <div class="task-time">Completed: ${new Date(task.completedAt).toLocaleString()}</div>
                `;
                historyList.appendChild(li);
            });
            saveHistory();
        }

        function addTask() {
            const taskInput = document.getElementById('task-input');
            const taskTime = document.getElementById('task-time');
            const taskPriority = document.getElementById('task-priority');
            if (taskInput.value.trim() !== '') {
                const newTask = {
                    text: taskInput.value.trim(),
                    time: taskTime.value || new Date().toISOString(),
                    priority: taskPriority.value,
                };
                tasks.push(newTask);
                taskInput.value = '';
                taskTime.value = '';
                taskPriority.value = 'medium';
                renderTasks();
                scheduleNotification(newTask);
            }
        }

        function completeTask(index) {
            const completedTask = tasks.splice(index, 1)[0];
            completedTask.completedAt = new Date().toISOString();
            history.push(completedTask);
            renderTasks();
            renderHistory();
        }

        function editTask(index) {
            const newText = prompt('Edit task:', tasks[index].text);
            if (newText !== null) {
                tasks[index].text = newText.trim();
                renderTasks();
            }
        }

        function deleteTask(index) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1);
                renderTasks();
            }
        }

        function clearHistory() {
            if (confirm('Are you sure you want to clear the task history?')) {
                history = [];
                renderHistory();
            }
        }

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function saveHistory() {
            localStorage.setItem('history', JSON.stringify(history));
        }

        function scheduleNotification(task) {
            const notificationTime = new Date(task.time).getTime();
            const now = new Date().getTime();
            const timeUntilNotification = notificationTime - now;

            if (timeUntilNotification > 0) {
                setTimeout(() => {
                    showNotification(task.text);
                }, timeUntilNotification);
            }
        }

        function showNotification(text) {
            const notification = document.getElementById('notification');
            notification.textContent = `Task Due: ${text}`;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }

        renderTasks();
        renderHistory();

        // Schedule notifications for existing tasks
        tasks.forEach(scheduleNotification);