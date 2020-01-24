const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Shopkeeper=require('../models/shopkeeper');
const Customer=require('../models/customer')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
const shopregister=[];
Shopkeeper.find({},(err,doc)=>{
	doc.forEach((user)=>{
		shopregister.push(user.name);
	})
	//shopregister.push(doc.name);
	shopregister.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
});
})

router.get('/dashboard/shopkeeper',ensureAuthenticated,(req,res)=>{
	
		res.render('shopkeeper',{shopregister:shopregister});
	}

	);
router.get('/dashboard/newshopkeeper',ensureAuthenticated,(req,res)=>{
	res.render('newshopkeeper')
})
router.post('/dashboard/newshopkeeper',ensureAuthenticated,(req,res)=>{
	const{name,email,phoneno,customer,password,password2}=req.body;
	const errors=[];
	
	if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Id must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('newshopkeeper', {
      errors,
      name,
      email,
      phoneno,
      password,
      password2
    });
  } else {
    Shopkeeper.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('newshopkeeper', {
          errors,
          name,
          email,
          phoneno,
          password,
          password2
        });
      } else {
        const newShopkeeper = new Shopkeeper({
          name:name,
          email:email,
          phoneno:phoneno,
          password:password
        });
        shopregister.push(name);
        shopregister.sort();
        newShopkeeper
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Shop has been sucessfulley added'
                );
               res.redirect('/dashboard/shopkeeper')
              })
              .catch(err => console.log(err));
    }

})
}
})


router.get('/dashboard/shopkeeper/:id',ensureAuthenticated,(req,res)=>{
	res.render('addnewcustomer',{user:req.params.id})
})
router.post('/dashboard/shopkeeper/',ensureAuthenticated,(req,res)=>{
		const password=req.body.shopkeeperpassword;
		//console.log(pass);
		const shopname=req.body.shopname;
	//console.log(shopname);
const errors=[];
var t=0;
	Shopkeeper.findOne({ name:shopname }, function (err, user){
  if(user){

      	
      		if(user.password==password)
      		{
      			t=1;
      			res.render('shopdashboardfinal',{user:user})
      		}
      	
      	if(t==0)
      	{
      		
  	errors.push({msg:'You do not have Shopkeeper id'});
  	res.render('shopkeeper',{errors:errors,shopregister:shopregister});
           }
              
              
        
      }
      else
      {
      	errors.push({msg:'You do not have Shopkeeper id'});
      	res.render('shopkeeper',{errors:errors,shopregister:shopregister});
      }
		
   
		//res.redirect('/dashboard/shopkeeper');


	});
});
router.get('/dashboard/shopkeeper/existingcustomer/:id',ensureAuthenticated,(req,res)=>{
	res.render('shopdasboard',{user:req.params.id});
})
router.post('/dashboard/shopkeeper/existingcustomer/:id',ensureAuthenticated,(req,res)=>{
	const{email,password}=req.body
	const errors=[];
	Shopkeeper.findOne({_id:req.params.id}).then(use=>{
		if(use)
		{
			const customer=use.customer;
      	var t=0;
      	for(var i = 0;i<customer.length;i++)
      	{
      		if(customer[i].email==email)
      		{
      			t=1;
      			if(password!=customer[i].password)
      			{
				      			errors.push({ msg: 'Customer id incorrect' });
				        res.render('shopdasboard', {
				        	user:use._id,
				          errors:errors,
				          name:name,
				          email:email,
				          password:password
				        });
      		    }
      		    else
      		    {
      		    	
      		    	const user=customer[i];
      		    	res.render('customerdashboardindex',{user:user,use:use._id})
      		    }

      	}
		}
		if(t==0)
		{
		errors.push({msg:'customer not exist'})
			res.render("shopdasboard",{user:use._id,
          	errors:errors})
		}
	}
		else
		{
			errors.push({msg:'customer not exist'})
			res.render("shopdasboard",{user:use._id,
          	errors:errors})
		}
	
})
})
router.get("/dashboard/shopkeeper/search/:id",ensureAuthenticated,(req,res)=>{
	res.render('addnewcustomer',{user:req.params.id});
})
router.post('/dashboard/shopkeeper/search/:id',ensureAuthenticated,(req,res)=>{
	const{name,email,password,password2 }=req.body;
	const washno='0';
	const errors = [];

  if (!name || !email || !password ) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password != password2) {
    errors.push({ msg: 'Customer Id do not match' });
  }
  

  if (password.length < 6) {
    errors.push({ msg: 'Customer Id must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('addnewcustomer', {
      user:req.params.id,
          errors:errors,
          name:name,
          email:email,
          password:password
    });
  } else {
    Shopkeeper.findOne({ _id: req.params.id }).then(user => {
      if (user) {
      	const customer=user.customer;
      	var t=0;
      	for(var i = 0;i<customer.length;i++)
      	{
      		if(customer[i].email==email)
      		{
      			t=1;
      			errors.push({ msg: 'Customer already exists' });
        res.render('addnewcustomer', {
        	user:user._id,
          errors:errors,
          name:name,
          email:email,
          password:password
        });
      		}
      	}
      	if(t==0)
      	{
      		const alldates=[]
      	user.customer.push({alldates:alldates,name:name,email:email,washno:washno,password:password})
      	  user.save();
                req.flash(
                  'success_msg',
                  'customer has been sucessfulley added'
                );
               res.redirect('/dashboard/shopkeeper/existingcustomer/'+user._id);
           }
              
              
        
      } 
		
})
}
	
	
})
router.get('/dashboard/customer',ensureAuthenticated,(req,res)=>{
	res.render('customer',{shopregister:shopregister});
});
router.post('/dashboard/customer',ensureAuthenticated,(req,res)=>{
	const password=req.body.customerpassword;
	const shopname=req.body.shopname;
	//console.log(shopname);

	Shopkeeper.findOne({ name:shopname }, function (err, user){
  if(user){
      	const customer=user.customer;
      	var t=0;
      	for(var i = 0;i<customer.length;i++)
      	{
      		if(customer[i].password==password)
      		{
      			t=1;
      			res.render('customerdashboard1',{user:customer[i]})
      		}
      	}
      	if(t==0)
      	{
      		const errors=[];
  	errors.push({msg:'You do not have Customer id'});
  	res.render('customer',{errors:errors,shopregister:shopregister});
           }
              
              
        
      }
  
  	//const errors=[];
  	//errors.push({msg:'You do not have Customer id'});
  	//res.render('customer',{errors:errors});
  
  
});
});
router.get('/dashboard/shopkeeper/edit/:id/:email',ensureAuthenticated,(req,res)=>{
		Shopkeeper.findOne({ _id:req.params.id }, function (err, use){
 // res.render('customerdashboard',{user:doc})
  	const customer=use.customer;
      	var t=0;
      	for(var i = 0;i<customer.length;i++)
      	{
      		if(customer[i].email==req.params.email)
      		{
      			t=1;
      			
      		    	
      		    	const user=customer[i];
      		    	res.render('customerdashboard',{user:user,use:use._id})
      		   

      	}
		}
});
})
router.get('/dashboard/shopkeeper/:id/:email',ensureAuthenticated,(req,res)=>{
	Shopkeeper.findOne({ _id:req.params.id }, function (err, use){
		var user;
      	var t=0;
      	var m=0;
      	for(var i = 0;i<use.customer.length;i++)
      	{
      		if(use.customer[i].email==req.params.email)
      		{
      			t=i;
      			
      		    	 user=use.customer[i];
      		    	//use.customer[i].washno=String(Number(use.customer[i].washno)+1);
      		    	var l=user.washno;
      		    	if(l=="0")
      		    	{
      		    		m=1;
      		    		console.log("ll")
      		    		res.render('customerdashboard',{user:user,use:use._id})
      		    	}
      		    	else
      		    	{
      		    	user.washno= String(Number(user.washno)-1);
      		    	//console.log(user.washno);
      		    	
					  user.alldates.pop()
					}
					
					 // use.customer[i].alldates.push(s);
					  //const user=use.customer[i];
      		    
      		        //console.log(use.customer[i].washno);
      		    	//res.render('customerdashboard',{user:user,use:use._id});
      		   

      	}
		}
		if(t>-1&&!m)
		{
		use.customer.splice(t,1);
		use.customer.push(user);
	    use.save();
	   res.render('customerdashboard',{user:user,use:use._id})
	    }
	    

  
});
})
router.get('/dashboard/shopkeeper/:id/:email/plus',ensureAuthenticated,(req,res)=>{
	Shopkeeper.findOne({ _id:req.params.id }, function (err, use){
		//const customer=use.customer;
		//console.log(use);
	var user;
      	var t=0;
      	for(var i = 0;i<use.customer.length;i++)
      	{
      		if(use.customer[i].email==req.params.email)
      		{
      			t=i;
      			
      		    	 user=use.customer[i];
      		    	//use.customer[i].washno=String(Number(use.customer[i].washno)+1);

      		    	user.washno= String(Number(user.washno)+1);
      		    	//console.log(user.washno);
      		    	const d=new Date();
					  var s=d.toString()
					  s=s.slice(0,25)
					  user.alldates.push(s)
					 // use.customer[i].alldates.push(s);
					  //const user=use.customer[i];
      		    
      		        //console.log(use.customer[i].washno);
      		    	//res.render('customerdashboard',{user:user,use:use._id});
      		   

      	}
		}
		if(t>-1)
		{
		use.customer.splice(t,1);
	    }
	    use.customer.push(user);
	    use.save();
	   res.render('customerdashboard',{user:user,use:use._id})

		
  

 //res.redirect('/dashboard/shopkeeper/edit/'+req.params.id)
});
})






module.exports = router;
