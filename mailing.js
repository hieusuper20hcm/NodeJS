const nodemailer = require('nodemailer');
let content='';
const Cart=require('./model/cart.model')
const User=require('./model/user.model')

module.exports.contentMail=async function(req,res,next){
    const carts=await Cart.find({userId:req.signedCookies.userID})
    let count=0;
    let tong=0;
    content+='<div style="text-align:center"><h1>Thông tin người mua là</h1>'+
            `<h3>Tên: ${req.body.name}</h3>`+
            `<h3>SĐT: ${req.body.phone}</h3>`+
            `<h3>Địa chỉ: ${req.body.address}</h3></div>`+
            '<h1 style="text-align:center">Sản phẩm đã mua là </h1>'+
            '<table><tr><th>Tên</th><th>Gía</th><th>Số lượng</th></tr>'
    carts.map(carts=>{
        count+=carts.cart.count
        tong+=carts.cart.count*carts.cart.price
        content+=`<tr><td><h3>${carts.cart.nameProduct}</h3></td>`+
        `<td><h3>${new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(carts.cart.price)} đ</h3>`+
        `</td>`+`<td><h3>${carts.cart.count}</h3></td></tr>`
    })
    content+=`</table><h2 style="text-align:right">Tổng tiền: ${new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(tong)} đ</h2>`+
            `<h2 style="text-align:right">Tổng số lượng đã mua: ${count}</h2>`
    next();
}

module.exports.sendMail=async function(req,res){
    const user=await User.findOne({_id:req.signedCookies.userID})
    const option = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // email hoặc username
            pass: process.env.PASSWORD // password
        }
    };
    var transporter = nodemailer.createTransport(option);
     
    transporter.verify(function(error, success) {
        // Nếu có lỗi.
        if (error) {
            console.log(error);
        } else { //Nếu thành công.
            console.log('Kết nối thành công!');
            var mail = {
                from: process.env.EMAIL, // Địa chỉ email của người gửi
                to: user.email, // Địa chỉ email của người gửi
                subject: 'Bạn đã đặt hàng tại shop Minh Hiếu', // Tiêu đề mail
                html: content
        };
            //Tiến hành gửi email
            transporter.sendMail(mail, function(error, info) {
                if (error) { // nếu có lỗi
                    res.send('Đặt hàng thất bại')
                } else { //nếu thành công
                    res.send('Đặt hàng thành công vui lòng kiểm tra lại mail')
                }
            });
        }
    });
}