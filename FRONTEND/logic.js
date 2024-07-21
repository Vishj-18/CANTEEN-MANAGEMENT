const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
    );
    const errorText = document.getElementById("errorText");

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            if (data.user.role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else window.location.href = "dashboard.html";
        } else {
            console.log(data.error, errorText);
            errorText.innerText = data.error;
            errorModal.show();
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        errorText.textContent = "An error occurred. Please try again later.";
        errorModal.show();
    }
}

const handleSignup = async (event) => {
    event.preventDefault();

    console.log(
        event
    )
    const userName = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
    );
    const errorText = document.getElementById("errorText");

    try {
        const response = await fetch("http://localhost:3000/create-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName, email, password, role: "user" }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "login.html";
        } else {
            errorText.innerText = data.error;
            errorModal.show();
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        errorText.textContent = "An error occurred. Please try again later.";
        errorModal.show();
    }
}


