let id = null;
let limit = document.getElementById('limit').value || 10;
let search = '';

function setId(_id) {
    id = _id
    console.log(`${'id'}`)
}
const addForm = new bootstrap.Modal('#addingData', {
    keyboard: false
})

const deleteForm = new bootstrap.Modal('#deleteData', {
    keyboard: false
})

const updateForm = new bootstrap.Modal('#updateData', {
    keyboard: false
})

document.getElementById('form-user').addEventListener('submit', function (event) {
    event.preventDefault()
    addData()
})

document.getElementById('btn-delete').addEventListener('click', function (event) {
    event.preventDefault()
    deleteData()
})

document.getElementById('btn-update').addEventListener('click', function (event) {
    event.preventDefault()
    updateData()
})

async function find() {
    try {
        let getSearch = document.getElementById("input-search").value;
        search = getSearch.toString()
        readData()
    } catch (error) {
        console.log('ini errornya =>', error)
    }
}

async function reset() {
    try {
    search = document.getElementById("input-search").value = "";
    readData()
} catch(err) {
    console.log('ini error nya bro => ',err)
}
}

const readData = async (page = 1) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/?page=${page}&limit=${limit}&search=${search}`
        );
        console.log('ini response', response)
        const users = await response.json();
        let html = '';
        const pagination = "";
        let pageNumber = "";
        const offset = users.offset
        users.data.forEach((item, index) => {
            html += `
          <tr>
              <th class="number" scope="row">${index + offset + 1}</th>
              <td class="tname" scope="row">${item.name}</td>
              <td class="tphone" scope="row">${item.phone}</td>
              <td class="tbutton" scope="row">
                <button type="button" onclick="getData('${item._id}')" class="btn btn-success">
                  <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                </button>&nbsp;
                <button onclick="setId('${item._id}')" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteData">
                  <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                </button>&nbsp;
                <a class="btn btn-warning" href="/users/${item._id}/todos">
                  <i class="fa-solid fa-right-to-bracket"></i>
                </a>&nbsp;
              </td>
          </tr>
          `
        })

        for (let i = 1; i <= users.pages; i++) {
            pageNumber += `<button class="${page == i ? 'btn btn-warning' : ''}" id="button-pagination" onclick="changePage(${i})">${i}</button>`
        }

        document.getElementById('pagination').innerHTML = pageNumber

        document.getElementById('users-table-tbody').innerHTML = html
    } catch (err) { console.log(err) }
}
readData()

// ini fitur user
const addData = async () => {
    try {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phone }),
        })
        const users = await response.json();

        readData()
        addForm.hide()
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';

    } catch (err) { console.log(err) }
}

const getData = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`);
        const user = await response.json()
        console.log('user', user)
        setId(user._id)
        document.getElementById('uname').value = user.name
        document.getElementById('uphone').value = user.phone
        updateForm.show()
    } catch (error) { console.log('ini errornya => ', error) }
}

const changePage = async (number) => {
    readData(number)
}

const updateData = async () => {
    const name = document.getElementById('uname').value
    const phone = document.getElementById('uphone').value
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
    })
    const users = await response.json();

    readData()
    updateForm.hide()
}

const deleteData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const users = await response.json();

        readData()
        deleteForm.hide()
    } catch (err) { console.log(err) }
}

// fitur user selesai

// ini fitur limit
const setLimit = async () => {
    limit = document.getElementById('limit').value
    page = 1
    readData()
}
