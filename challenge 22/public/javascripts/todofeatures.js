let title = '', complete = '', strDeadline = '', endDeadline = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = executorId, deadline = null, todoId = null

function setExecutor(userId) {
    executor = userId
    readData()
}

const readData = async (page = 1) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/todos/?executor=${executor}&page=${page}`
        );
        const todos = await response.json();
        let html = "";
        let pagination = "";
        let pageNumber = "";
        const offset = todos.offset
        console.log('ini todos.data => ', todos.data)
            console.log('ini respons', response, 'ini todos => ', todos)

        todos.data.forEach((item, index) => {
            html += `
            <div class="input-group mb-3 py-2 px-3 rounded-2" style="background-color: black;">
                <span>${item.deadline} ${item.title}</span>
            </div>
          `
        })
        console.log('ini html =>',html)

        $("#todo-list").html(html);

    } catch (err) { console.log(err) }
}
readData()