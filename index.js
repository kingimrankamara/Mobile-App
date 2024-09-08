import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings
const appSettings = {
    databaseURL: "https://playground-27694-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// DOM Elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const fileInputEl = document.getElementById("file-input")
const fileUploadButtonEl = document.getElementById("file-upload-button")
const proceedPaymentEl = document.getElementById("proceed-payment")
const paymentSectionEl = document.getElementById("payment-section")
const mobileMoneyEl = document.getElementById("mobile-money")
const paypalEl = document.getElementById("paypal")
const mobileMoneyInputEl = document.getElementById("mobile-money-input")
const paypalInputEl = document.getElementById("paypal-input")
const submitPaymentEl = document.getElementById("submit-payment")
const mobileMoneyNumberEl = document.getElementById("mobile-money-number")
const paypalEmailEl = document.getElementById("paypal-email")
const screenshotInputEl = document.getElementById("screenshot-input")
const uploadScreenshotButtonEl = document.getElementById("upload-screenshot-button")
const uploadStatusEl = document.getElementById("upload-status")
const screenshotUploadEl = document.getElementById("upload-screenshot")

// Add item from input field
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue.trim() !== "") {
        push(shoppingListInDB, inputValue) // Add item to Firebase
        clearInputFieldEl() // Clear input field after adding
    }
})

// Upload items from file
fileUploadButtonEl.addEventListener("click", function() {
    const file = fileInputEl.files[0]
    
    if (file) {
        const reader = new FileReader()
        
        reader.onload = function(e) {
            const fileContent = e.target.result
            const items = fileContent.split('\n').filter(item => item.trim() !== "")
            
            // Push each item from the file to Firebase
            items.forEach(item => {
                push(shoppingListInDB, item.trim())
            })
        }
        
        reader.readAsText(file)
    }
})

// Display items from Firebase in real-time
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val()) // Get items as array
        
        clearShoppingListEl() // Clear previous list
        
        itemsArray.forEach(item => {
            appendItemToShoppingListEl(item) // Append each item to the list
        })
    } else {
        shoppingListEl.innerHTML = "No items here... yet" // Message if no items
    }
})

// Clear shopping list from DOM
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Append items to the shopping list
function appendItemToShoppingListEl(item) {
    let itemID = item[0] // Firebase item ID
    let itemValue = item[1] // Item value
    
    let newEl = document.createElement("li") // Create new <li> element
    newEl.textContent = itemValue // Set text content to item value
    
    // On click, highlight the item instead of deleting it
    newEl.addEventListener("click", function() {
        newEl.style.backgroundColor = "#d3d3d3"; // Change background color when clicked
    })
    
    shoppingListEl.append(newEl) // Append the new item to the shopping list
}

// Show payment options on "Proceed to Payment" click
proceedPaymentEl.addEventListener("click", function() {
    paymentSectionEl.style.display = "block"; // Show the payment section
})

// Show relevant input field based on selected payment method
mobileMoneyEl.addEventListener("change", function() {
    mobileMoneyInputEl.style.display = "block";
    paypalInputEl.style.display = "none";
})

paypalEl.addEventListener("change", function() {
    paypalInputEl.style.display = "block";
    mobileMoneyInputEl.style.display = "none";
})

// Handle the payment submission
submitPaymentEl.addEventListener("click", function() {
    let selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (selectedPaymentMethod === "mobile-money") {
        let mobileMoneyNumber = mobileMoneyNumberEl.value;
        if (mobileMoneyNumber.trim() === "") {
            alert("Please enter your mobile money number.");
        } else {
            alert("Mobile Money payment submitted: " + mobileMoneyNumber);
            showScreenshotUpload();
        }
    } else if (selectedPaymentMethod === "paypal") {
        let paypalEmail = paypalEmailEl.value;
        if (paypalEmail.trim() === "") {
            alert("Please enter your PayPal email.");
        } else {
            alert("PayPal payment submitted: " + paypalEmail);
            showScreenshotUpload();
        }
    }
})

// Show screenshot upload section
function showScreenshotUpload() {
    screenshotUploadEl.style.display = "block"; // Show the screenshot upload section
}

// Handle screenshot upload
uploadScreenshotButtonEl.addEventListener("click", function() {
    const file = screenshotInputEl.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Here you can save the uploaded screenshot in Firebase or show a success message
            console.log("Screenshot uploaded:", e.target.result); // Example: Log the base64 of the uploaded image

            // Display success message
            uploadStatusEl.style.display = "block";
            uploadStatusEl.textContent = "Screenshot uploaded successfully!";
        }

        reader.readAsDataURL(file); // Read the file as a base64 URL
    } else {
        alert("Please select a screenshot to upload.");
    }
})
