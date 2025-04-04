const BLYNK_AUTH_TOKEN = "3uAt31-2E_HzK2VSp0FKfo4noABBp5oR";
const PROXY_URL = "http://localhost:3000/api/blynk"; // Proxy server endpoint
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
        document.getElementById("payment-failed-modal").style.display = "flex";
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
    sessionStorage.removeItem("paymentRedirect");
    window.location.href = "index.html";
}

// Fetch real-time data through proxy
async function fetchData() {
    try {
        const pins = ['V0', 'V1', 'V2', 'V3', 'V4'];
        const responses = await Promise.all(
            pins.map(pin => axios.get(`${PROXY_URL}?pin=${pin}`))
        );

        // Update UI only if all responses are valid
        if (responses.every(r => r.data && r.data.value !== undefined)) {
            document.getElementById("voltage").innerText = responses[0].data.value;
            document.getElementById("current").innerText = responses[1].data.value;
            document.getElementById("power").innerText = responses[2].data.value;
            document.getElementById("unit").innerText = responses[3].data.value;
            document.getElementById("cost").innerText = responses[4].data.value;
        } else {
            throw new Error("Invalid data received from Blynk");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        // Show placeholder values on error
        ['voltage', 'current', 'power', 'unit', 'cost'].forEach(id => {
            document.getElementById(id).innerText = "--";
        });
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
    
    if (!amount || amount === "--") {
        alert("Cannot proceed with payment. Amount is invalid.");
        return;
    }

    let userUPI = "paytmqr2810050501017c0feb5ad2dn@paytm";
    let transactionNote = "Electricity Bill Payment";

    let upiUrl = `upi://pay?pa=${userUPI}&pn=Electricity&am=${amount}&cu=INR&tn=${transactionNote}`;

    sessionStorage.setItem("paymentRedirect", "true");

    let newWindow = window.open(upiUrl, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
        alert("Your browser blocked the payment request. Please enable pop-ups.");
    }
}

// Close "Payment Failed" modal
function closeModal() {
    document.getElementById("payment-failed-modal").style.display = "none";
}
