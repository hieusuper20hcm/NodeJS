var socket=io.connect('https://hieusuper20hcm.herokuapp.com')
let count=document.getElementsByClassName('countJS')
const userID=document.getElementById('userID')

for(let i=0;i<count.length;i++){
    count[i].addEventListener('change',()=>{
        if(Number.isNaN(count[i].value)||count[i].value<=0){
            count[i].value=1
        }
        count[i].value=(Math.ceil(count[i].value))
        socket.emit("changeCount",{count:count[i].value,id:count[i].dataset.id,userID:userID.dataset.userid})
    })
}
socket.on('updateMoney', function(data) {
    $('#countcart').text(data.countCart)
    $('#sumMoney').text('Tổng tiền: '+new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(data.tongTien)+ 'đ')
});
