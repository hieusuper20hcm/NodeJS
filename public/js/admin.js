document.getElementById('clickUsers').addEventListener('click',()=>{
    if(!document.getElementById('clickUsers').dataset.status){
        alert('Bạn không có quyền admin để vào trang');
    }
})