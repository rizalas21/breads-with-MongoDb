var id = null

function setId (_id) {
    console.log(_id)
    id = _id
}
const addForm = new bootstrap.Modal('#addingData', {
    keyboard: false
})

const deleteForm = new bootstrap.Modal('#deleteData', {
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

const readData = async () => {
    const response = await fetch("http://localhost:3000/api/users");
    const users = await response.json();
    let html = '';
    users.data.forEach((item, index) => {
        html += `
          <tr>
              <th scope="row">${index + 1}</th>
              <td scope="row">${item.name}</td>
              <td scope="row">${item.phone}</td>
              <td scope="row">
                <button type="button" class="btn btn-success">
                  <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                </button>&nbsp;
                <button onclick="setId('${item._id}')" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteData">
                  <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                </button>&nbsp;
                <button type="button" class="btn btn-warning">
                  <i class="fa-solid fa-right-to-bracket"></i>
                </button>&nbsp;
              </td>
          </tr>
          `
    })
    document.getElementById('users-table-tbody').innerHTML = html
}
readData()

const addData = async () => {
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
} catch(err){console.log(err)}
}
