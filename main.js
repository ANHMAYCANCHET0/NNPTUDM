LoadData();

async function LoadData() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    // Sắp xếp theo chiều tăng của ID (ép kiểu số để so sánh)
    posts = posts.sort((a, b) => Number(a.id) - Number(b.id));
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
    result += "<td><input type='submit' value='Delete' onclick='Delete(\"" + post.id + "\")'></input></td>";
    result += "</tr>";
    return result;
}

// Thêm mới: Cho phép nhập ID, nếu không nhập thì tự tăng, luôn lưu id là string và kiểm tra trùng
async function SaveData() {
    let idInput = document.getElementById("id").value.trim();
    let title = document.getElementById("title").value;
    let view = document.getElementById("view").value;

    // Lấy danh sách post để kiểm tra id đã tồn tại
    let data = await fetch("http://localhost:3000/posts");
    let posts = await data.json();
    let usedIds = posts.map(p => p.id.toString());

    let id;
    if (idInput !== "") {
        id = idInput.toString();
        if (usedIds.includes(id)) {
            alert("ID đã tồn tại, vui lòng nhập ID khác!");
            return;
        }
    } else {
        // Tìm số nhỏ nhất chưa dùng, bắt đầu từ 1
        let nextId = 1;
        while (usedIds.includes(nextId.toString())) {
            nextId++;
        }
        id = nextId.toString();
    }

    let dataObj = {
        id: id,
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

// Xoá mềm: truyền id là string khi gọi API
async function Delete(id) {
    id = id.toString(); // Đảm bảo id là string
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