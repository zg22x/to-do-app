
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todoApp = document.querySelector('.todo-app');
    const appTitle = todoApp.querySelector('h1');

    // إضافة شريط التقدم والعداد
    const statsHTML = `
        <div class="stats-container">
            <div class="circular-progress" id="circular-progress">
                <div class="stats-numbers" id="stats-numbers" style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;">
                    <span id="progress-value">0 / 0</span>
                    <span id="progress-text" style="font-size: 0.8rem; margin-top: 5px;">Let's Start</span>
                </div>
            </div>
        </div>
    `;
    appTitle.insertAdjacentHTML('afterend', statsHTML);

    const saveData = () => {
        localStorage.setItem("data", taskList.innerHTML);
    };

    const updateStats = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.completed').length;
        const progressValue = document.getElementById('progress-value');
        const progressText = document.getElementById('progress-text');
        const circularProgress = document.getElementById('circular-progress');
        
        progressValue.textContent = `${completedTasks} / ${totalTasks}`;
        
        if (totalTasks === 0) {
            progressText.textContent = "No Tasks";
            circularProgress.style.background = `conic-gradient(#6f4caf 0deg, rgba(255, 255, 255, 0.1) 0deg)`;
        } else {
            const percentage = (completedTasks / totalTasks) * 100;
            progressText.textContent = percentage === 100 ? "Well Done!" : "Keep Going";
            circularProgress.style.background = `conic-gradient(#6f4caf ${percentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`;
        }
        saveData();
    };

    // إنشاء نافذة التعديل وإضافتها للصفحة
    const modalHTML = `
        <div class="modal-overlay" id="edit-modal">
            <div class="modal-content">
                <h2 style="color: white; text-align: center;">تعديل المهمة</h2>
                <input type="text" class="modal-input" id="edit-input">
                <div class="modal-buttons">
                    <button class="modal-btn cancel-btn" id="cancel-edit">إلغاء</button>
                    <button class="modal-btn save-btn" id="save-edit">حفظ</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('edit-modal');
    const modalInput = document.getElementById('edit-input');
    const saveBtn = document.getElementById('save-edit');
    const cancelBtn = document.getElementById('cancel-edit');
    let currentEditElement = null;

    // إغلاق النافذة
    const closeModal = () => {
        modal.style.display = 'none';
        currentEditElement = null;
    };

    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', () => {
        if (currentEditElement && modalInput.value.trim() !== '') {
            currentEditElement.textContent = modalInput.value.trim();
            closeModal();
            saveData();
        }
    });

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    };

    // دالة لربط الأحداث بالعناصر (للاستخدام عند الإنشاء وعند التحميل من الذاكرة)
    const bindTaskEvents = (li) => {
        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            li.querySelector('span').classList.toggle('completed');
            updateStats();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateStats();
        });

        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const span = li.querySelector('span');
            currentEditElement = span;
            modalInput.value = span.textContent;
            modal.style.display = 'flex';
        });
    };

    const addTask = (event) => {
        if (event) {
            event.preventDefault();
        }
        const taskText = taskInput.value.trim();
        if(!taskText) {
            return; 
        };

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${taskText}</span>
             <div class="task-buttons">
             <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
             <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
             </div>
        `;

        bindTaskEvents(li);

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateStats();
    };
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            addTask(e);
        }
    });

    // تحميل البيانات المحفوظة
    const loadData = () => {
        taskList.innerHTML = localStorage.getItem("data") || "";
        Array.from(taskList.children).forEach(li => {
            bindTaskEvents(li);
        });
        toggleEmptyState();
        updateStats();
    };
    loadData();
});