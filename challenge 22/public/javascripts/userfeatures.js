let id = null;
let limit = document.getElementById('limit').value || 10;
let query = '';
let sortBy = '_id', sortMode = 'desc'
let page = 1

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
        query = getSearch.toString()
        page = 1
        readData()
    } catch (error) {
        console.log('ini errornya =>', error)
    }
}

async function reset() {
    try {
        query = document.getElementById("input-search").value = "";
        readData()
    } catch (err) {
        console.log('ini error nya bro => ', err)
    }
}



// ini fitur sort
// sort phone
const sortPhoneAsc = (phone) => {
    sortBy = phone
    sortMode = 'asc'
    let sortasc = `
    <button type="button" class="btn p-0" onclick="sortPhoneDesc('phone')">
        <div class="d-inline-block position-relative" style="height: 10px;">
            <i class="fa-solid fa-caret-up position-absolute bottom-0 start-0 p-0"></i>
        </div>
    </button>
    <span class="ms-3 fw-bold">Phone</span>
  `
    document.getElementById(`btn-${phone}`).innerHTML = sortasc
    readData()
}

const sortPhoneDesc = (phone) => {
    sortBy = phone
    sortMode = 'desc'
    let sortdesc = `
    <button type="button" class="btn p-0" onclick="sortPhoneAsc('phone')">
        <div class="d-inline-block position-relative" style="height: 10px;">
            <i class="fa-solid fa-caret-down position-absolute bottom-0 start-0 p-0"></i>
        </div>
    </button>
    <span class="ms-3 fw-bold">Phone</span>
  `
    document.getElementById(`btn-${phone}`).innerHTML = sortdesc
    readData()
}
// sort name
const sortNameAsc = (name) => {
    sortBy = name
    sortMode = 'asc'
    let sortasc = `
    <button type="button" class="btn p-0" onclick="sortNameDesc('name')">
        <div class="d-inline-block position-relative" style="height: 10px;">
            <i class="fa-solid fa-caret-up position-absolute bottom-0 start-0 p-0"></i>
        </div>
    </button>
    <span class="ms-3 fw-bold">Name</span>
  `
    document.getElementById(`btn-${name}`).innerHTML = sortasc
    readData()
}

const sortNameDesc = (name) => {
    sortBy = name
    sortMode = 'desc'
    let sortdesc = `
    <button type="button" class="btn p-0" onclick="sortNameAsc('name')">
        <div class="d-inline-block position-relative" style="height: 10px;">
            <i class="fa-solid fa-caret-down position-absolute bottom-0 start-0 p-0"></i>
        </div>
    </button>
    <span class="ms-3 fw-bold">Name</span>
  `
    document.getElementById(`btn-${name}`).innerHTML = sortdesc
    readData()
}

const readData = async () => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}&sortMode=${sortMode}`
        );
        const users = await response.json();
        let html = '';
        let pagination = "";
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
            pageNumber += `<button class="page-link ${(page == i) ? ' active' : ''}" id="button-pagination" onclick="changePage(${i})">${i}</button>`
        }

        if (document.getElementById('limit').value == 0) {
            pagination = ''
        } else {
            pagination = `
        <div class="mx-3">
            <span>showing ${users.offset + 1} to ${(Number(users.limit) + Number(users.offset)) >= Number(users.total) ? Number(users.total) : Number(users.limit) + (users.offset)} of ${users.total} entries</span>
                <div class="bpage">
                    ${users.page == 1 ? '' : '<button onclick="changePage(page - 1)" class="page-link">&laquo;</button>'} 
                    ${pageNumber}
                    ${users.page == users.pages ? '' : '<button onclick="changePage(page + 1)"  class="page-link">&raquo;</button>'} 
                </div>
        </div>
        `
        }
        document.getElementById('pagination').innerHTML = pagination

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
        setId(user._id)
        document.getElementById('uname').value = user.name
        document.getElementById('uphone').value = user.phone
        updateForm.show()
    } catch (error) { console.log('ini errornya => ', error) }
}

const changePage = async (number) => {
    page = number
    readData(page)
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

    updateForm.hide()
    readData()
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

