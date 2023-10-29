//const { response } = require("express");

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form1').style.display = "none";
    document.getElementById('form2').style.display = "none";
    document.getElementById('form3').style.display = "none";
    document.getElementById('form4').style.display = "none";
    document.getElementById('form5').style.display = "none";

});

//log off page
document.getElementById('Logoff').addEventListener('click', function() {
    // Clear a specific cookie by setting its expiration date to the past
   // document.cookie = "your_cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logoff page
    window.location.href = '/logoff';
});



document.getElementById('minimizebtn1').addEventListener('click', function(){
    if(document.getElementById('form1').style.display === "flex"){
        document.getElementById('form1').style.display = "none";
        document.getElementById("resp-from-database1").innerHTML = "";
        // document.getElementById('resp-from-database1').hidden = true;
        document.getElementById("arrowid1").src = "/resources/arrow-down.png";
    }
    else{
        document.getElementById('form1').style.display = "flex";
        document.getElementById("arrowid1").src = "/resources/arrow-up.png";
    }
        
});

document.getElementById('minimizebtn2').addEventListener('click', function(){
    if(document.getElementById('form2').style.display === "flex"){
        document.getElementById('form2').style.display = "none";
        document.getElementById("resp-from-database2").innerHTML = "";
        document.getElementById("arrowid2").src = "/resources/arrow-down.png";
    }
    else{
        document.getElementById('form2').style.display = "flex";
        document.getElementById("arrowid2").src = "/resources/arrow-up.png";
    }
        
});

document.getElementById('minimizebtn3').addEventListener('click', function(){
    if(document.getElementById('form3').style.display === "flex"){
        document.getElementById('form3').style.display = "none";
        document.getElementById("resp-from-database3").innerHTML = "";
        document.getElementById("arrowid3").src = "/resources/arrow-down.png";
    }
    else{
        document.getElementById('form3').style.display = "flex";
        document.getElementById("arrowid3").src = "/resources/arrow-up.png";
    }     
});
document.getElementById('minimizebtn4').addEventListener('click', function(){
    if(document.getElementById('form4').style.display === "flex"){
        document.getElementById('form4').style.display = "none";
        document.getElementById("resp-from-database4").innerHTML = "";
        document.getElementById("arrowid4").src = "/resources/arrow-down.png";
    }
    else{
        document.getElementById('form4').style.display = "flex";
        document.getElementById("arrowid4").src = "/resources/arrow-up.png";
    }     
});
document.getElementById('minimizebtn5').addEventListener('click', function(){
    if(document.getElementById('form5').style.display === "flex"){
        document.getElementById('form5').style.display = "none";
        document.getElementById("resp-from-database1").innerHTML = "";
        document.getElementById("arrowid5").src = "/resources/arrow-down.png";
    }
    else{
        document.getElementById('form5').style.display = "flex";
        document.getElementById("arrowid5").src = "/resources/arrow-up.png";
    }     
});



document.getElementById('Sumbitbutton1').addEventListener('click', function(e){
        e.preventDefault(); 
        const form1 = document.getElementById('form1');
        const currentAddressFields = document.getElementsByClassName('currentaddressdt');
        let hasValue = true;
        
        for (const field of currentAddressFields) {
            if (field.value.trim() === "") {
                hasValue = false;
                missing_field = field.name;
                alert("Plese update -" + missing_field);
                break;
            }
        }
        if (hasValue) {
            const currentAddressFields = document.getElementsByClassName('currentaddressdt');
            let data = {};
            for (const field of currentAddressFields){
                const fieldname = field.name;
                const fieldvalue = field.value.trim();
                if(fieldvalue !== ""){
                    data[fieldname] = fieldvalue
                }
                data["ID"] = Empl_ID;  // to get employee ID for DB update
            }

        //    const formData = new FormData(form1);
            const action = form1.getAttribute('data-action');
            
            fetch(action,{
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data =>{
                    console.log(data);
                    const message = data.message;
                     document.getElementById('resp-from-database1').innerHTML = message;
                })
                .catch(error => {
                    console.error('Error: ',error);
                });
        }
});

document.getElementById('Sumbitbutton2').addEventListener('click', function(e){
    e.preventDefault(); 
    const form2 = document.getElementById('form2');
    const currentAddressFields = document.getElementsByClassName('currentaddressdt2');
    let hasValue = true;
    
    for (const field of currentAddressFields) {
        if (field.value.trim() === "") {
            hasValue = false;
            missing_field = field.name;
            alert("Plese update -" + missing_field);
            break;
        }
    }
    if (hasValue) {
        const currentAddressFields = document.getElementsByClassName('currentaddressdt2');
        let data = {};
        for (const field of currentAddressFields){
            const fieldname = field.name;
            const fieldvalue = field.value.trim();
            if(fieldvalue !== ""){
                data[fieldname] = fieldvalue
            }
            data["ID"] = Empl_ID;  // to get employee ID for DB update
        }

      //  const formData = new FormData(form2);
        const action = form2.getAttribute('data-action');
        
        fetch(action,{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data =>{
                console.log(data);
                const message = data.message
                 document.getElementById('resp-from-database2').innerHTML = message;
            })
            .catch(error => {
                console.error('Error: ',error);
            });
    }
});


document.getElementById('Sumbitbutton3').addEventListener('click', function(e){
    e.preventDefault(); 
    const form3 = document.getElementById('form3');
    const currentAddressFields = document.getElementsByClassName('currentaddressdt3');
    let hasValue = true;
    
    for (const field of currentAddressFields) {
        if (field.value.trim() === "") {
            hasValue = false;
            missing_field = field.name;
            alert("Plese update -" + missing_field);
            break;
        }
    }
    if (hasValue) {
        const currentAddressFields = document.getElementsByClassName('currentaddressdt3');
        let data = {};
        for (const field of currentAddressFields){
            const fieldname = field.name;
            const fieldvalue = field.value.trim();
            if(fieldvalue !== ""){
                data[fieldname] = fieldvalue
            }
            data["ID"] = Empl_ID;  // to get employee ID for DB update
        }
        console.log(data);
      //  const formData = new FormData(form3);
        const action = form3.getAttribute('data-action');
        
        fetch(action,{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data =>{
                console.log(data);
                const message = data.message
                 document.getElementById('resp-from-database3').innerHTML = message;
            })
            .catch(error => {
                console.error('Error: ',error);
            });
    }
});

document.getElementById('Sumbitbutton4').addEventListener('click', function(e){
    e.preventDefault(); 
    const form4 = document.getElementById('form4');
    const currentAddressFields = document.getElementsByClassName('currentaddressdt4');
    let hasValue = true;
    
    for (const field of currentAddressFields) {
        if (field.value.trim() === "") {
            hasValue = false;
            missing_field = field.name;
            alert("Plese update -" + missing_field);
            break;
        }
    }
    if (hasValue) {
        const currentAddressFields = document.getElementsByClassName('currentaddressdt4');
        let data = {};
        for (const field of currentAddressFields){
            const fieldname = field.name;
            const fieldvalue = field.value.trim();
            if(fieldvalue !== ""){
                data[fieldname] = fieldvalue
            }
            data["ID"] = Empl_ID;  // to get employee ID for DB update
        }
        console.log(data);
      //  const formData = new FormData(form4);
        const action = form4.getAttribute('data-action');
        
        fetch(action,{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data =>{
                console.log(data);
                const message = data.message
                 document.getElementById('resp-from-database4').innerHTML = message;
            })
            .catch(error => {
                console.error('Error: ',error);
            });
    }
});