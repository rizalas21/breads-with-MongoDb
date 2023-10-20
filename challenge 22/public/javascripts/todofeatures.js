let title = '', complete = '', strDeadline = '', endDeadline = '', sortBy = '_id', sortMode = 'desc', limit = 10, executor = null, deadline = null, todoId = null

function setExecutor(userId) {
    executor = userId
}

const readData = async (page = 1) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/todos`
        );
        const todos = await response.json();
        console.log('ini response => ', response, 'ini todos => ', todos)
        let html = '';
        let pagination = "";
        let pageNumber = "";
        const offset = todos.offset
        todos.data.forEach((item, index) => {
            console.log('ini item',item)
            html += `
            <div class="">
                <span>
            </div>
          `
        })
        console.log(html)
        $("#todo-list").html(html)

    } catch (err) { console.log(err) }
}
readData()