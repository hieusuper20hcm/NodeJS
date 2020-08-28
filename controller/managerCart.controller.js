const Bought=require('../model/bought.model')
module.exports={
    index: async function(req,res){
            let boughts= await Bought.find().sort({_id:-1})
            let boughtsCount=[]
            let boughtsMoney=[]
            let sumMoney=0;
            let sumCount=0;
            boughts.map(e=>{
                let countManager=0
                let moneyManager=0
                e.cart.map(e=>{
                    countManager+=e.count
                    moneyManager+=e.price*e.count                   
                })
                sumMoney+=moneyManager;
                sumCount+=countManager;
                boughtsCount.push(countManager)
                boughtsMoney.push(moneyManager)
            })     
            res.render('managerCart/index',{
                boughts: boughts,
                boughtsCount:boughtsCount,
                boughtsMoney:boughtsMoney,
                sumMoney:sumMoney,
                sumCount:sumCount
            })

    },
    search: async function(req,res){
        const q=req.query.q.toLowerCase(); 
        let matchCarts= await Bought.find();
        let boughtsCount=[]
        let boughtsMoney=[]
        let sumMoney=0;
        let sumCount=0;
        matchCarts=matchCarts.filter(cart=> cart.name.toLowerCase().indexOf(q)!==-1);
        matchCarts.map(e=>{
            let countManager=0
            let moneyManager=0
            e.cart.map(e=>{
                countManager+=e.count
                moneyManager+=e.price*e.count                     
            })
            sumMoney+=moneyManager;
            sumCount+=countManager;
            boughtsCount.push(countManager)
            boughtsMoney.push(moneyManager)
        })   
        res.render('managerCart/index',{
            boughts: matchCarts,
            boughtsCount:boughtsCount,
            boughtsMoney:boughtsMoney,
            sumMoney:sumMoney,
            sumCount:sumCount,
            q
        })
    },
    view: async function(req,res){
        const id=req.params.id;
        let sumMoney=0;
        let sumCount=0;
        let bought=await Bought.findOne({_id:id});
        bought.cart.map(v=>{
            if(v.img.split('/').splice(0,1)!=''){
                v.img=`/${v.img.split('/').splice(0).join('/')}`
            }
            sumMoney+=v.price*v.count;
            sumCount+=v.count;
        })
        res.render('managerCart/view',{
            bought: bought,
            sumMoney:sumMoney,
            sumCount:sumCount,
        })
    }
}