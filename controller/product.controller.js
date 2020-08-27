const Product=require('../model/product.model')
module.exports.index= async function(req,res){  
    const products= await Product.find();
    // console.log(products.map(v=>{return new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(45)}))

    const page=parseInt(req.query.page) || 1;
    const perPage=12;
    const pageNumber=Math.ceil(await Product.countDocuments()/perPage);
    let start= (page-1)*perPage;
    let end =page * perPage;
    
    let nextPage=page+1;
    let prePage=page-1;
    if(nextPage>pageNumber){
        nextPage=1;
    }
    if(prePage<1){
        prePage=pageNumber;
    }
    
    res.render('product/index',{
        products: products.slice(start,end),
        page,
        pageNumber,
        nextPage,
        prePage
    });
}