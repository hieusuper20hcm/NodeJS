const md5 = require('md5')
const User=require('../model/user.model')
const Product = require('../model/product.model');

module.exports={
    index: async function(req,res){
            var products= await Product.find()
            res.render('managerProduct/index',{
                products: products
            })

    },
    search: async function(req,res){
        const q=req.query.q.toLowerCase(); 
        let matchProducts= await Product.find();
        matchProducts=matchProducts.filter(product=> product.name.toLowerCase().indexOf(q)!==-1);
        matchProducts.map(v=>{
            if(v.img.split('/').splice(0,1)!=''){
                v.img=`/${v.img.split('/').splice(0).join('/')}`
            }
        })
        res.render('managerProduct/index',{
            products: matchProducts,
            q
        })
    },
    create: function(req,res){
        res.render('managerProduct/create')
    },
    view: async function(req,res){
        const id=req.params.id;
        const product=await Product.findOne({_id:id});
        let date=product._id.getTimestamp().toUTCString();
        res.render('managerProduct/view',{
            product: product,
            date: date
        })
    },
    postCreate: async function(req,res){
        req.body.name=req.body.name.toLowerCase().replace(/^.|\s\S/g,a=>{return a.toUpperCase()})
        if(req.file){
            req.body.img=req.file.path.split('\\').splice(1).join('/');
        }
        else req.body.img='/img/dae727e03e8092-daccam.png'
        await Product.create(req.body);
        res.redirect('/managerProduct')
    },
    deleteView: async function(req,res){
        const id=req.params.id;
        await Product.deleteOne({_id:id},(err) => {
            if (err){
                console.log(err);
                return;
            }
            res.redirect('/managerProduct')
        })
    },
    update: async function(req,res){
        const id=req.params.id;
        let product=await Product.findOne({_id:id});
        if(product.img.split('/').splice(0,1)!=''){
            product.img=`/${product.img.split('/').splice(0).join('/')}`
        }
        res.render('managerProduct/update',{
            product: product
        })
    },
    postUpdate: async function(req,res){ 
        await Product.updateOne({_id: req.params.id}, req.body, function(err,res) {
            if (err) throw err;        
        });
        res.redirect('/managerProduct')
    }

};