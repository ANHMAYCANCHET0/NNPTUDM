LoadData();

async function LoadData() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    let body = document.getElementById("body");
    body.innerHTML = ""; // Xóa dữ liệu cũ
    for (const post of posts) {
        if (!post.isDelete) { // Chỉ hiển thị post chưa bị xoá mềm
            body.innerHTML += convertDataToHTML(post);
        }
    }
}

function convertDataToHTML(post) {
    let result = "<tr>";
    result += "<td>" + post.id + "</td>";
    result += "<td>" + post.title + "</td>";
    result += "<td>" + post.views + "</td>";
    result += "<td><input type='submit' value='Delete' onclick='Delete("+post.id+")'></input></td>";
    result += "</tr>";
    return result;
}

// Thêm mới: ID tự tăng
async function SaveData(){
    let title = document.getElementById("title").value;
    let view = document.getElementById("view").value;

    // Lấy danh sách post để tìm id lớn nhất
    let data = await fetch("http://localhost:3000/posts");
    let posts = await data.json();
    let maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
    let newId = maxId + 1;

    let dataObj = {
        id: newId,
        title: title,
        views: view,
        isDelete: false
    };

    let response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: JSON.stringify(dataObj),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(response);
    LoadData(); // Refresh lại bảng
}

// Xoá mềm: cập nhật isDelete = true
async function Delete(id){
    // Lấy post hiện tại
    let data = await fetch('http://localhost:3000/posts/' + id);
    if (data.ok) {
        let post = await data.json();
        post.isDelete = true;
        await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Xoá mềm thành công");
        LoadData(); // Refresh lại bảng
    }
}