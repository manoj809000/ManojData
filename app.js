const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const ejs = require('ejs');
const path = require("path");
const res = require('express/lib/response');
const { error } = require('console');
const e = require('express');
const { ifError } = require('assert');
const app = express();
const moment = require('moment-timezone');

// Configure session
app.use(session({
  secret: '1x2dppodjjcm87xxx99dkjrnf',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 10 * 60 * 1000, //session time is set to 10 min
  }
}));

//serve static file where static files i.e., public folder created for saving pages
app.use(express.static("public"));


//set search engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')) // set directory


// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tanvi@2050',
  database: 'employee'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Define routes and handle user authentication
app.get('/login', (req, res) => {
  
  res.render('login.ejs');
 // res.render('test.ejs')
});


app.post('/dashboard', (req, res) => {
  const { username, password } = req.body;    
        
        const query1 = 'select PortalLogin.username, PortalLogin.password, Employee_Master.ID, Employee_Master.E_Name, Attendance.In_time, Attendance.Out_time from PortalLogin inner join Employee_Master on PortalLogin.empl_ID = Employee_Master.ID inner join Attendance on Employee_Master.ID = Attendance.Empl_ID where PortalLogin.username = ? and PortalLogin.password = ? and Attendance.Cur_Date = curdate()';
        const query = 'select PortalLogin.username, PortalLogin.password, PortalLogin.empl_ID, Employee_Master.E_Name from PortalLogin inner join Employee_Master on PortalLogin.empl_ID = Employee_Master.ID where PortalLogin.username = ? and PortalLogin.password = ?';
        db.query(query1, [username, password], (err, results) => {
          if(err) throw err;
          if(results.length > 0){
            req.session.loggedin = true;
            req.session.username = username;
          //  req.session.password = password;
            const Empl_ID = results[0].ID;
            const E_Name = results[0].E_Name;   
            const In_time = results[0].In_time;
            const Out_time = results[0].Out_time;          
            const Intime = moment(In_time).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            const Outtime = moment(Out_time).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

          //  const Text = results;
         //   console.log(Outtime);
            const senddetails = {'User':E_Name, 'Empl':Empl_ID, 'Intime':Intime, 'Outtime':Outtime };   
            res.render('dashboard.ejs',senddetails);  
          }
          else{
            db.query(query, [username, password], (err, results) => {
              if (err) throw err;
    
              if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
              //  req.session.password = password;
                const Empl_ID = results[0].empl_ID;
                const E_Name = results[0].E_Name;   
                const senddetails = {'User':E_Name, 'Empl':Empl_ID, 'Intime':"", 'Outtime':""};   
                res.render('dashboard.ejs',senddetails);  
              } 
              else {
                res.send('Incorrect username or password'); // Handle login failure
              }      
            }
          )}
        });
      });


// Start your server
const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Parse JSON requests
app.use(bodyParser.json());

// Define a route to receive the time data
app.post("/end_point", (req, res) => {
    const {currentTime, action, EmplID} = req.body;
         
    if(action == "Sign In"){
      console.log("Result: " +action +" at " + currentTime + "Employee ID "+EmplID);
      const currentTimeIn = currentTime;
      var cur_date = currentTimeIn.substring(0,10);
      var month = currentTimeIn.substring(5,7);
      var Cur_Year = currentTimeIn.substring(0,4);
      const path = 'insert into Attendance (Empl_ID, Cur_Date, In_Time, Cur_Month, Cur_Year) values (?,?,?,?,?)';
       db.query(path, [EmplID, cur_date, currentTimeIn, month, Cur_Year] ,(err, results) => {
        if (err) {
     //     console.log('Error inserting data:', err);
        }

        else{
          const Respo_IDinmySQL = results.insertId;
     //     console.log('Data inserted successfully:' + Respo_IDinmySQL);
    //      res.send(Respo_IDinmySQL.toString());     
   //       res.json({ 'value': Respo_IDinmySQL});
        }

      })
      
    }
    else if(action == "Sign Out"){
      console.log("Result: " +action +" at " + currentTime);
      const currentTimeOut = currentTime;
      var cur_date = currentTimeOut.substring(0,10);
      const path = 'update Attendance set Out_Time =? where Empl_ID = ? and Cur_Date = ?';
      db.query(path, [currentTimeOut, EmplID, cur_date] ,(err, results) => {
        if (err) {
          console.log('Error inserting data:', err);
        }

        else{
          const Respo_IDinmySQL = results.insertId;
    //      console.log('Data updated successfully:' + Respo_IDinmySQL);
    
        }

      })


    }
    else{
      console.log("error");
    }    

    // You can store it in a database, perform calculations, etc.
    res.sendStatus(200); // Send a response back to the client
});


// Define a route for the logoff page
app.get('/logoff', (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
      }
      // Redirect to the logoff success page
      res.redirect('/login');
    //  res.render('logoff');
  });
});

app.get('/profile-update', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedin) {
      const username = req.session.username;
      const query = 'select em.E_Name, em.ID, ca.Address1, ca.Address2, ca.City, ca.State, ca.Pincode, pa.PAddress1, pa.PAddress2, pa.PCity, pa.PState, pa.PPincode, em.Gender, em.DOB, em.Mobile, em.Alt_numb, em.Landline_numb, em.Email, em.Pan, em.UAN, em.Aadhaar from PortalLogin as pl inner join Employee_Master as em on pl.empl_ID = em.ID left join Current_Address as ca on em.ID = ca.ID left join Permanent_Address as pa on em.ID = pa.ID  where pl.username =?';
      db.query(query,[username], (err,results) => {
        if (err) throw err;
        
        if(results.length > 0){
        //  console.log(results);
          const Ename = results[0].E_Name;
          const EID = results[0].ID;
          const Address1 = results[0].Address1;
          const Address2 = results[0].Address2;
          const City = results[0].City;
          const State = results[0].State;
          const Pincode = results[0].Pincode;
          const PAddress1 = results[0].PAddress1;
          const PAddress2 = results[0].PAddress2;
          const PCity = results[0].PCity;
          const PState = results[0].PState;
          const PPincode = results[0].PPincode;
          const Mobile = results[0].Mobile;
          const Alt_numb = results[0].Alt_numb;
          const Landline_numb = results[0].Landline_numb;
          const Email = results[0].Email;
          const Pan = results[0].Pan;
          const Aadhaar = results[0].Aadhaar;
          const UAN = results[0].UAN;



          const senddetails = { "Ename": Ename, "Ecode": EID , 
          "Address1":Address1, "Address2":Address2, "City":City, "State":State, "Pincode": Pincode,
          "PAddress1":PAddress1, "PAddress2":PAddress2, "PCity": PCity, "PState":PState, "PPincode": PPincode,
          "Mobile":Mobile, "Alt_numb":Alt_numb, "Landline_numb":Landline_numb, "Email": Email,
          "Pan":Pan, "Aadhaar":Aadhaar, "UAN":UAN,
        }
          res.render('profile-update.ejs', senddetails);
        }

      })
            
  } else {
      // Redirect to the login page if not logged in
      res.redirect('/login');
  }
});

app.post('/update-address', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedin) {
      const { Address1, Address2, City, ID, State, Pincode} = req.body;     
      
      const checkQuery = 'select * from Current_Address where ID = ?';
      const insertQuery =  'insert into Current_Address values (?,?,?,?,?,?)';
      const updateQuery = 'update Current_Address set Address1 =? , Address2=?, City=?, State=?, Pincode=? where ID=?';
      db.query(checkQuery, [ID], (err, results) => {
          if (err) throw err;
          
          if(results.length > 0){
            db.query(updateQuery, [Address1, Address2, City, State, Pincode, ID],(error, results) =>{
              if(error){
                res.status(500).json({ error: 'Error updating data in MySQL' });
              }
              else{
                res.json({ message: 'Data updated successfully in database' });
              }
                
            })
          }
          else{
            db.query(insertQuery, [ID, Address1, Address2, City, State, Pincode], (err, results) => {
              if(err){
                res.status(500).json({ error: 'Error inserting data in MySQL' });
                return;
              }
              else{
                res.json({ message: 'Data inserted successfully in database'});
              }
            })
          }
      });
    }
   else {
      // Redirect to the login page if not logged in
      res.redirect('/login');
  }
});


app.post('/update-Paddress', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedin) {
      const { Address1, Address2, City, ID, State, Pincode} = req.body;     
      
      const checkQuery = 'select * from Permanent_Address where ID = ?';
      const insertQuery =  'insert into Permanent_Address values (?,?,?,?,?,?)';
      const updateQuery = 'update Permanent_Address set PAddress1 =? , PAddress2=?, PCity=?, PState=?, PPincode=? where ID=?';
      db.query(checkQuery, [ID], (err, results) => {
          if (err) throw err;
          
          if(results.length > 0){
            db.query(updateQuery, [Address1, Address2, City, State, Pincode, ID],(error, results) =>{
              if(error){
                res.status(500).json({ error: 'Error updating data in MySQL' });
              }
              else{
                res.json({ message: 'Data updated successfully in database' });
              }
                
            })
          }
          else{
            db.query(insertQuery, [ID, Address1, Address2, City, State, Pincode], (err, results) => {
              if(err){
                res.status(500).json({ error: 'Error inserting data in MySQL' });
                return;
              }
              else{
                res.json({ message: 'Data inserted successfully in database'});
              }
            })
          }
      });
    }
   else {
      // Redirect to the login page if not logged in
      res.redirect('/login');
  }
});

app.post('/update-contact', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedin) {
      const { Mobile, Alt_numb, Landline_numb, ID, Email} = req.body;     
      
      const checkQuery = 'select * from Employee_Master where ID = ?';
      const insertQuery =  'insert into Employee_Master (ID, Mobile, Alt_numb, Landline_numb, Email) values (?,?,?,?,?)';
      const updateQuery = 'update Employee_Master set Mobile=?, Alt_numb=?, Landline_numb=?, Email=? where ID= ?';
      db.query(checkQuery, [ID], (err, results) => {
          if (err) throw err;
          
          if(results.length > 0){
            db.query(updateQuery, [Mobile, Alt_numb, Landline_numb, Email, ID],(error, results) =>{
              if(error){
                res.status(500).json({ error: 'Error updating data in MySQL' });
              }
              else{
                res.json({ message: 'Data updated successfully in database' });
              }
                
            })
          }
          else{
            db.query(insertQuery, [ID, Mobile, Alt_numb, Landline_numb, Email], (err, results) => {
              if(err){
                res.status(500).json({ error: 'Error inserting data in MySQL' });
                return;
              }
              else{
                res.json({ message: 'Data inserted successfully in database'});
              }
            })
          }
      });
    }
   else {
      // Redirect to the login page if not logged in
      res.redirect('/login');
  }
});


app.post('/update-personal', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedin) {
      const { Pan, Aadhaar, UAN, ID } = req.body;     
      
      const checkQuery = 'select * from Employee_Master where ID = ?';      
      const updateQuery = 'update Employee_Master set Pan=?, Aadhaar=?, UAN=? where ID= ?';
      const insertQuery =  'insert into Employee_Master (ID, Pan, Aadhaar, UAN ) values (?,?,?,?)';
      db.query(checkQuery, [ID], (err, results) => {
          if (err) throw err;
          
          if(results.length > 0){
            db.query(updateQuery, [Pan, Aadhaar, UAN, ID],(error, results) =>{
              if(error){
                res.status(500).json({ error: 'Error updating data in MySQL' });
              }
              else{
                res.json({ message: 'Data updated successfully in database' });
              }
                
            })
          }
          else{
            db.query(insertQuery, [ID, Pan, Aadhaar, UAN], (err, results) => {
              if(err){
                res.status(500).json({ error: 'Error inserting data in MySQL' });
                return;
              }
              else{
                res.json({ message: 'Data inserted successfully in database'});
              }
            })
          }
      });
    }
   else {
      // Redirect to the login page if not logged in
      res.redirect('/login');
  }
});
