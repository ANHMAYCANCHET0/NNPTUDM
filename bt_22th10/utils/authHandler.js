let { Response } = require('./responseHandler')
let jwt = require("jsonwebtoken")
let users = require('../schemas/users')

module.exports = {
    Authentication: async function (req, res, next) {
        let token = req.headers.authorization ? req.headers.authorization : req.cookies.token;
        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            try {
                // Thử verify token; jwt.verify sẽ ném lỗi nếu token không hợp lệ
                let payload = jwt.verify(token, "NNPTUD");
                // payload.exp lưu epoch ms theo cách trong code hiện tại. Nếu là số nhỏ (s giây) cần điều chỉnh.
                if (payload.exp && payload.exp < Date.now()) {
                    Response(res, 403, false, "Token đã hết hạn");
                    return;
                }
                // Gán userId cho request để middleware tiếp theo dùng
                req.userId = payload._id;
                next();
            } catch (err) {
                Response(res, 403, false, "user chua dang nhap");
            }
        } else {
            Response(res, 403, false, "user chua dang nhap");
        }
    },
    Authorization: function (...roleRequire) {
        return async function (req, res, next) {
            let userId = req.userId;
            let user = await users.findById(userId).populate({
                path: 'role',
                select: 'name'
            });
            let role = user.role.name;
            if(roleRequire.includes(role)){
                next();
            }else{
                Response(res, 403, false, "ban khong du quyen");
            }
        }
    }
}