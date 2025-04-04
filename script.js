const PROXY_URL = "https://blynk-proxy.onrender.com/get";

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

document.addEventListener("visibilitychange", function () {
    if (!document.hidden && sessionStorage.getItem("paymentRedirect")) {
        sessionStorage.removeItem("paymentRedirect");
        document.getElementById("payment-failed-modal").style.display = "flex";
    }
});

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

function logout() {
    localStorage.removeItem("loggedIn");
    sessionStorage.removeItem("paymentRedirect");
    window.location.href = "index.html";
}

async function fetchData() {
    try {
        const [voltage, current, power, unit, cost] = await Promise.all([
            axios.get(`${PROXY_URL}?V0`),
            axios.get(`${PROXY_URL}?V1`),
            axios.get(`${PROXY_URL}?V2`),
            axios.get(`${PROXY_URL}?V3`),
            axios.get(`${PROXY_URL}?V4`)
        ]);

        document.getElementById("voltage").innerText = voltage.data;
        document.getElementById("current").innerText = current.data;
        document.getElementById("power").innerText = power.data;
        document.getElementById("unit").innerText = unit.data;
        document.getElementById("cost").innerText = cost.data;
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

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

function payBill() {
    let amount = document.getElementById("cost").innerText.trim();
    
    if (!amount || amount === "0" || amount === "--") {
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

function closeModal() {
    document.getElementById("payment-failed-modal").style.display = "none";
}