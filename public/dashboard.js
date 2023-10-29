function getCurrentTimeInIST() {
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours and 30 minutes)
    const currentTimeInUTC = new Date(Date.now() + ISTOffset); // Get current time in UTC with the IST offset
    const year = currentTimeInUTC.getUTCFullYear();
    const month = String(currentTimeInUTC.getUTCMonth() + 1).padStart(2, '0');
    const day = String(currentTimeInUTC.getUTCDate()).padStart(2, '0');
    const hours = String(currentTimeInUTC.getUTCHours()).padStart(2, '0');
    const minutes = String(currentTimeInUTC.getUTCMinutes()).padStart(2, '0');
    const seconds = String(currentTimeInUTC.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

// Main dashboard for load function  
document.addEventListener('DOMContentLoaded', function () {
    
    if(serverIntime !== "" ){        
        document.getElementById("captureTimeIn").hidden = true;
        document.getElementById("displayTimeIn").innerHTML = "Sign In Time : " + serverIntime;
       // console.log(serverIntime);

        if(serverOuttime !== "Invalid date"){
            document.getElementById("captureTimeOut").hidden = true;
            document.getElementById("displayTimeOut").innerHTML = "Sign Out Time : " + serverOuttime;
        //    console.log(serverOuttime);
        }    
        else{
        // check if any error can be noted here
         //   console.log("no log");
        }
    }
    else{
        //   console.log("no log");
    }

  });
  

  //... Sign in code
  document.getElementById("captureTimeIn").addEventListener("click", function() {

    const currentTimeIn = getCurrentTimeInIST();
    
    document.getElementById("captureTimeIn").hidden = true;
    
     const EmplID = (document.getElementById("EmplIDfromheader").textContent);
     console.log(EmplID);
     
    document.getElementById("displayTimeIn").innerHTML = "Sign In Time : " + currentTimeIn;
    console.log(currentTimeIn);
    // Send the currentTime to the server-side
    sendToServer(currentTimeIn, "Sign In", EmplID);
});

//.... Signout code
document.getElementById("captureTimeOut").addEventListener("click", function() {
  
    const currentTimeOut = getCurrentTimeInIST();
    const EmplID = (document.getElementById("EmplIDfromheader").textContent);
    document.getElementById("captureTimeOut").hidden = true;
    document.getElementById("displayTimeOut").innerHTML = "Sign Out Time : " + currentTimeOut;
    console.log(currentTimeOut);

    // Send the currentTime to the server-side
    sendToServer(currentTimeOut, "Sign Out", EmplID);
});

function sendToServer(currentTime, action, EmplID) {
    // Use JavaScript fetch or an AJAX library to send the data to the server
    // Example using fetch:
    
    fetch("/end_point", {
        method: "POST",
        body: JSON.stringify({ currentTime: currentTime, action: action, EmplID: EmplID }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
    
    })
    .catch(error => {
        console.error("Error sending data to server: " + error);
    });
}

//log off page
document.getElementById('Logoff').addEventListener('click', function() {
    // Clear a specific cookie by setting its expiration date to the past
   // document.cookie = "your_cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logoff page
    window.location.href = '/logoff';
});

// document.getElementById('logoff').addEventListener('click', function() {
//     // Check if the cookie exists
//     if (getCookie('your_cookie_name')) {
//         // Clear the cookie by setting its expiration date to the past
//         document.cookie = "your_cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         // Redirect to the logoff page
//         window.location.href = '/logoff';
//     } else {
//         // Cookie does not exist, handle accordingly (e.g., show an error message)
//         alert('The cookie does not exist.');
//     }
// });

// // Function to get a cookie by name
// function getCookie(cookieName) {
//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//         const cookie = cookies[i].trim();
//         // Check if the cookie starts with the desired name
//         if (cookie.startsWith(cookieName + '=')) {
//             // Return the value of the cookie
//             return cookie.substring(cookieName.length + 1);
//         }
//     }
//     // Return null if the cookie is not found
//     return null;
// }
