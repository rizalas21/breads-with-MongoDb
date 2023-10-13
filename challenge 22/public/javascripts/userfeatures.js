const id = null
const limit = document.getElementById('limit'). value || 10
const page = 1;

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

const readData = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/?page=${page}`
            );
        const users = await response.json();
        let html = '';
        const pagination = "";
        const pageNumber = "";
        users.data.forEach((item, index) => {
            html += `
          <tr>
              <th scope="row">${index + 1}</th>
              <td scope="row">${item.name}</td>
              <td scope="row">${item.phone}</td>
              <td scope="row">
                <button type="button" onclick="getData('${item._id}')" class="btn btn-success">
                  <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                </button>&nbsp;
                <button onclick="setId('${item._id}')" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteData">
                  <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                </button>&nbsp;
                <a class="btn btn-warning">
                  <i class="fa-solid fa-right-to-bracket"></i>
                </a>&nbsp;
              </td>
          </tr>
          `
        })

        for(let i = 1; i < users.pages; i++) pageNumber += `<li class>`

        document.getElementById('users-table-tbody').innerHTML = html
    } catch (err) { console.log(err) }
}
readData()

// ini fitur user
const addData = async () => {
    try {
        const name = document.getElementById('name').value
        const phone = document.getElementById('phone').value
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
    }catch(err){console.log(err)}
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
    } catch (error) {console.log('ini errornya => ',error)}
}

const updateData = async () => {
    const name = document.getElementById('uname').value
    const phone = document.getElementById('uphone').value
    console.log(id, name, phone)
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
    limit = document.getElementById('limit')
    page = 1
    readData()
}
