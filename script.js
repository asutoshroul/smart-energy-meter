const PROXY_URL = "https://blynk-proxy.onrender.com/api/blynk";

const PREMIUM_USER = "21beee22";
const PREMIUM_PASS = "12345";

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        fetchData();
    }

    // Hide Payment Failed Modal initially
    document.getElementById("payment-failed-modal").style.display = "none";
});

// Listen for tab visibility change (detect return from UPI)
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && sessionStorage.getItem("paymentRedirect")) {
        sessionStorage.removeItem("paymentRedirect");
        document.getElementById("payment-failed-modal").style.display = "flex"; // Show Payment Failed
    }
});

// Login Function
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    
    if (user === PREMIUM_USER && pass === PREMIUM_PASS) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        localStorage.setItem("loggedIn", "true");
        fetchData();
    } else {
        document.getElementById("login-error").innerText = "Invalid User ID or Password";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("paymentRedirect"); // Prevent modal from appearing after logout
    window.location.href = "index.html";
}

// Fetch real-time data using proxy
async function fetchData() {
    try {
        let voltage = await axios.get(`${PROXY_URL}?pin=V0`);
        let current = await axios.get(`${PROXY_URL}?pin=V1`);
        let power = await axios.get(`${PROXY_URL}?pin=V2`);
        let unit = await axios.get(`${PROXY_URL}?pin=V3`);
        let cost = await axios.get(`${PROXY_URL}?pin=V4`);

        document.getElementById("voltage").innerText = voltage.data.value;
        document.getElementById("current").innerText = current.data.value;
        document.getElementById("power").innerText = power.data.value;
        document.getElementById("unit").innerText = unit.data.value;
        document.getElementById("cost").innerText = cost.data.value;
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

// Refresh button function
function refreshData() {
    const refreshButton = document.querySelector('.refresh-button');
    refreshButton.innerText = "Refreshing...";
    refreshButton.disabled = true;

    setTimeout(async () => {
        await fetchData();
        refreshButton.innerText = "Refresh Data";
        refreshButton.disabled = false;
    }, 2000);
}

// Pay Bill Function (Triggers UPI)
function payBill() {
    let amount = document.getElementById("cost").innerText.trim();
    
    // ✅ Prevents payment if amount is missing or "--"
    if (!amount || amount === "--") {
        alert("Cannot proceed with payment. Amount is invalid.");
        return;
    }

    let userUPI = "paytmqr2810050501017c0feb5ad2dn@paytm";
    let transactionNote = "Electricity Bill Payment";

    let upiUrl = `upi://pay?pa=${userUPI}&pn=Electricity&am=${amount}&cu=INR&tn=${transactionNote}`;

    sessionStorage.setItem("paymentRedirect", "true"); // Mark UPI redirection

    // Open UPI in a new tab
    let newWindow = window.open(upiUrl, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
        alert("Your browser blocked the payment request. Please enable pop-ups.");
    }
}

// Close "Payment Failed" modal
function closeModal() {
    document.getElementById("payment-failed-modal").style.display = "none";
}
