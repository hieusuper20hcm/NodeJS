const md5 = require('md5')
const User=require('../model/user.model')
const Bought=require('../model/bought.model');
const { create } = require('../model/user.model');

module.exports={
    index: async function(req,res){
        const users= await User.find()
        res.render('users/index',{
                users: users, 
                id:req.signedCookies.userID
        })
    },
    search: async function(req,res){
        const q=req.query.q.toLowerCase(); 
        let matchUsers= await User.find();
        matchUsers=matchUsers.filter(user=> user.name.toLowerCase().indexOf(q)!==-1);
        matchUsers.map(v=>{
            if(v.avatar.split('/').splice(0,1)!=''){
                v.avatar=`/${v.avatar.split('/').splice(0).join('/')}`
            }
        })
        res.render('users/index',{
            users: matchUsers,
            id:req.signedCookies.userID,
            q
        })
    },
    create: function(req,res){
        res.render('users/create')
    },
    view: async function(req,res){
        const id=req.params.id;
        const user=await User.findOne({_id:id});
        let sumMoney=0;
        let sumCount=0;
        let cart=[];
        let createDate=[];
        let boughts=await Bought.find({userId:id}).sort({_id:-1});
        
        boughts.map(e=>{
            e.cart.map(v=>{
                if(v.img.split('/').splice(0,1)!=''){
                    v.img=`/${v.img.split('/').splice(0).join('/')}`
                }
                createDate.push(e.createDate)
                cart.push(v);
                sumMoney+=v.price*v.count;
                sumCount+=v.count;                
            })  
        })     
        
        let date=user._id.getTimestamp().toUTCString();
        res.render('users/view',{
            user: user,
            date: date,
            cart:cart,
            createDate:createDate,
            sumMoney:sumMoney,
            sumCount:sumCount
        })
    },
    postCreate: async function(req,res){
        req.body.password=md5(req.body.password);
        req.body.name=req.body.name.toLowerCase().replace(/^.|\s\S/g,a=>{return a.toUpperCase()}).trim()
        if(req.file){
            req.body.avatar=req.file.path.split('\\').splice(1).join('/');
        }
        else req.body.avatar='/img/dae727e03e8092-daccam.png'
     
        await User.create(req.body);
        res.redirect('/users')
    },
    deleteView: async function(req,res){
        const id=req.params.id;
        const query=[{_id:id},{status:true}]
        const user= await User.findOne({$and:query});
        if(user){
            res.redirect('/users')
        }else{
        await User.deleteOne({_id:id},(err) => {
            if (err){
                console.log(err);
                return;
            }
            res.redirect('/users')
        })
    }
        
    },
    update: async function(req,res){
        const id=req.params.id;
        const query=[{_id: {$ne: req.signedCookies.userID}},{_id:id},{status:true}]
        const checkUser=await User.findOne({$and:query})
        if(checkUser){
            res.redirect('/users')
        }
        else{
            let user=await User.findOne({_id:id});
            if(user.avatar.split('/').splice(0,1)!=''){
                user.avatar=`/${user.avatar.split('/').splice(0).join('/')}`
            }
            res.render('users/update',{
                user: user
            })
        }
    },
    postUpdate: async function(req,res){ 
        req.body.name=req.body.name.toLowerCase().replace(/^.|\s\S/g,a=>{return a.toUpperCase()}).trim()
        await User.updateOne({_id: req.params.id}, req.body, function(err,res) {
            if (err) throw err;        
        });
        res.redirect('/users')
    }

};