// ============================================================
// SMARTCARE DASHBOARD JAVASCRIPT
// ============================================================

const API_URL = "/api/dashboard";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let dashboardData = null;

let currentChartPeriod = 7;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SmartCare Dashboard loaded");

    initializeDashboard();

});


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

async function initializeDashboard() {

    setupNavigation();

    setupSearch();

    setupButtons();

    setupChartPeriod();

    setupLogout();

    await loadDashboard();

}


// ============================================================
// LOAD COMPLETE DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        showLoading();

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {

            throw new Error(
                "Dashboard API returned " +
                response.status
            );

        }


        const data = await response.json();


        console.log(
            "Dashboard data:",
            data
        );


        dashboardData = data;


        updateDashboardStats(data);

        loadAppointments(
            data.appointments || []
        );

        loadAppointmentRequests(
            data.appointmentRequests || []
        );

        loadNotifications(
            data.notifications || []
        );

        loadPatientVisits(
            currentChartPeriod
        );


        hideLoading();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        hideLoading();

        showError(
            "Unable to load dashboard data."
        );

    }

}


// ============================================================
// REFRESH DASHBOARD
// ============================================================

async function refreshDashboard() {

    await loadDashboard();

}


// ============================================================
// UPDATE STAT CARDS
// ============================================================

function updateDashboardStats(data) {


    // --------------------------------------------------------
    // TOTAL PATIENTS
    // --------------------------------------------------------

    const totalPatients =
        document.getElementById(
            "totalPatients"
        );


    if (totalPatients) {

        totalPatients.textContent =
            formatNumber(
                data.totalPatients ?? 0
            );

    }


    // --------------------------------------------------------
    // TODAY'S APPOINTMENTS
    // --------------------------------------------------------

    const todayAppointments =
        document.getElementById(
            "todayAppointments"
        );


    if (todayAppointments) {

        todayAppointments.textContent =
            formatNumber(
                data.todayAppointments ?? 0
            );

    }


    // --------------------------------------------------------
    // AVAILABLE BEDS
    // --------------------------------------------------------

    const availableBeds =
        document.getElementById(
            "availableBeds"
        );


    if (availableBeds) {

        availableBeds.textContent =
            formatNumber(
                data.availableBeds ?? 0
            );

    }


    // --------------------------------------------------------
    // TODAY'S REVENUE
    // --------------------------------------------------------

    const todayRevenue =
        document.getElementById(
            "todayRevenue"
        );


    if (todayRevenue) {

        todayRevenue.textContent =
            formatCurrency(
                data.todayRevenue ?? 0
            );

    }

}


// ============================================================
// LOAD TODAY'S APPOINTMENTS
// ============================================================

function loadAppointments(appointments) {

    const appointmentList =
        document.querySelector(
            ".appointment-list"
        );


    if (!appointmentList) {

        return;

    }


    appointmentList.innerHTML = "";


    if (
        !appointments ||
        appointments.length === 0
    ) {

        appointmentList.innerHTML = `
            <div class="empty-message">
                No appointments today.
            </div>
        `;

        return;

    }


    appointments.forEach(
        function (appointment) {

            const appointmentId =
                appointment.appointmentId
                ?? appointment.id
                ?? "";


            const patientName =
                appointment.patientName
                ?? "Unknown Patient";


            const time =
                appointment.appointmentTime
                ?? appointment.time
                ?? "--:--";


            const period =
                appointment.period
                ?? "";


            const status =
                appointment.status
                ?? appointment.appointmentStatus
                ?? "Confirmed";


            const doctorName =
                appointment.doctorName
                ?? "Doctor";


            const description =
                appointment.description
                ?? "Medical Consultation";


            const consultationRoom =
                appointment.consultationRoom
                ?? "";


            const statusClass =
                getStatusClass(status);


            const appointmentHTML = `

                <div
                    class="appointment"
                    data-id="${escapeHTML(
                String(appointmentId)
            )}"
                >

                    <div class="time">

                        ${formatTime(time, period)}

                    </div>


                    <div class="patient">

                        <strong>
                            ${escapeHTML(
                patientName
            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                description
            )}
                        </small>

                    </div>


                    <div class="doctor">

                        ${escapeHTML(
                doctorName
            )}

                        ${
                consultationRoom
                    ? `
                                <small class="room">
                                    ${escapeHTML(
                        consultationRoom
                    )}
                                </small>
                              `
                    : ""
            }

                    </div>


                    <span
                        class="status ${statusClass}"
                    >

                        ${escapeHTML(status)}

                    </span>

                </div>

            `;


            appointmentList.insertAdjacentHTML(
                "beforeend",
                appointmentHTML
            );

        }
    );

}


// ============================================================
// LOAD APPOINTMENT REQUESTS
// ============================================================

function loadAppointmentRequests(requests) {

    const requestTable =
        document.querySelector(
            ".request-table"
        );


    if (!requestTable) {

        return;

    }


    // Keep heading
    requestTable.innerHTML = `

        <div class="table-row table-heading">

            <span>Name</span>

            <span>Date</span>

            <span>Time</span>

            <span>Action</span>

        </div>

    `;


    if (
        !requests ||
        requests.length === 0
    ) {

        requestTable.insertAdjacentHTML(
            "beforeend",
            `
            <div class="empty-message">
                No appointment requests.
            </div>
            `
        );

        return;

    }


    requests.forEach(
        function (request) {

            const appointmentId =
                request.appointmentId
                ?? request.id
                ?? "";


            const patientName =
                request.patientName
                ?? "Unknown";


            const date =
                request.appointmentDate
                ?? "--";


            const time =
                request.appointmentTime
                ?? "--";


            const rowHTML = `

                <div
                    class="table-row"
                    data-id="${escapeHTML(
                String(appointmentId)
            )}"
                >

                    <span>
                        ${escapeHTML(
                patientName
            )}
                    </span>


                    <span>
                        ${escapeHTML(
                formatDate(date)
            )}
                    </span>


                    <span>
                        ${escapeHTML(
                formatRequestTime(time)
            )}
                    </span>


                    <div>

                        <button
                            class="accept-btn"
                            data-id="${escapeHTML(
                String(appointmentId)
            )}"
                        >
                            Accept
                        </button>


                        <button
                            class="decline-btn"
                            data-id="${escapeHTML(
                String(appointmentId)
            )}"
                        >
                            Decline
                        </button>

                    </div>

                </div>

            `;


            requestTable.insertAdjacentHTML(
                "beforeend",
                rowHTML
            );

        }
    );

}


// ============================================================
// LOAD NOTIFICATIONS
// ============================================================

function loadNotifications(notifications) {

    const notificationList =
        document.querySelector(
            ".notification-list"
        );


    if (!notificationList) {

        return;

    }


    notificationList.innerHTML = "";


    if (
        !notifications ||
        notifications.length === 0
    ) {

        notificationList.innerHTML = `

            <div class="empty-message">
                No recent notifications.
            </div>

        `;

        return;

    }


    notifications.forEach(
        function (notification) {

            const title =
                notification.title
                ?? "Notification";


            const message =
                notification.message
                ?? "";


            const type =
                notification.type
                ?? "general";


            const notificationHTML = `

                <div
                    class="notification"
                    data-type="${escapeHTML(type)}"
                >

                    <div
                        class="notification-dot"
                    ></div>


                    <div>

                        <strong>
                            ${escapeHTML(title)}
                        </strong>


                        <p>
                            ${escapeHTML(message)}
                        </p>


                        <small>
                            Recent
                        </small>

                    </div>

                </div>

            `;


            notificationList.insertAdjacentHTML(
                "beforeend",
                notificationHTML
            );

        }
    );

}


// ============================================================
// LOAD PATIENT VISITS
// ============================================================

async function loadPatientVisits(period) {

    try {

        const endpoint =
            `${API_URL}/visits?days=${period}`;


        const response =
            await fetch(endpoint);


        if (!response.ok) {

            console.warn(
                "Patient visit API unavailable"
            );

            return;

        }


        const visits =
            await response.json();


        updatePatientVisitChart(
            visits,
            period
        );


    } catch (error) {

        console.warn(
            "Patient visit chart error:",
            error
        );

    }

}


// ============================================================
// UPDATE PATIENT VISIT CHART
// ============================================================

function updatePatientVisitChart(
    visits,
    period
) {

    const bars =
        document.querySelector(
            ".bars"
        );


    if (!bars) {

        return;

    }


    bars.innerHTML = "";


    if (
        !visits ||
        visits.length === 0
    ) {

        createEmptyChart(bars);

        return;

    }


    let maxVisits = 0;


    visits.forEach(
        function (item) {

            const count =
                Number(
                    item.visitCount
                    ?? item.count
                    ?? 0
                );


            if (count > maxVisits) {

                maxVisits = count;

            }

        }
    );


    if (maxVisits === 0) {

        maxVisits = 1;

    }


    const displayVisits =
        period === 7
            ? visits.slice(-7)
            : visits.slice(-30);


    displayVisits.forEach(
        function (item) {

            const count =
                Number(
                    item.visitCount
                    ?? item.count
                    ?? 0
                );


            const date =
                item.visitDate
                ?? "";


            const percentage =
                Math.max(
                    5,
                    (count / maxVisits) * 100
                );


            const label =
                getChartLabel(
                    date,
                    period
                );


            const barHTML = `

                <div
                    class="bar-container"
                    title="${escapeHTML(
                String(count)
            )} visits"
                >

                    <div
                        class="bar"
                        style="
                            height: ${percentage}%;
                        "
                    ></div>

                    <span>
                        ${escapeHTML(label)}
                    </span>

                </div>

            `;


            bars.insertAdjacentHTML(
                "beforeend",
                barHTML
            );

        }
    );


    updateYAxis(maxVisits);

}


// ============================================================
// CREATE EMPTY CHART
// ============================================================

function createEmptyChart(bars) {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        bars.insertAdjacentHTML(
            "beforeend",
            `
            <div class="bar-container">

                <div
                    class="bar"
                    style="height: 5%;"
                ></div>

                <span>--</span>

            </div>
            `
        );

    }

}


// ============================================================
// UPDATE Y AXIS
// ============================================================

function updateYAxis(maxValue) {

    const yAxis =
        document.querySelector(
            ".y-axis"
        );


    if (!yAxis) {

        return;

    }


    const step =
        Math.ceil(
            maxValue / 5
        );


    yAxis.innerHTML = `

        <span>${step * 5}</span>

        <span>${step * 4}</span>

        <span>${step * 3}</span>

        <span>${step * 2}</span>

        <span>${step}</span>

        <span>0</span>

    `;

}


// ============================================================
// CHART PERIOD
// ============================================================

function setupChartPeriod() {

    const chartPeriod =
        document.getElementById(
            "chartPeriod"
        );


    if (!chartPeriod) {

        return;

    }


    chartPeriod.addEventListener(
        "change",
        async function () {

            currentChartPeriod =
                Number(this.value);


            const chartTitle =
                document.querySelector(
                    ".chart-card .card-header p"
                );


            if (chartTitle) {

                chartTitle.textContent =
                    currentChartPeriod === 7
                        ? "Last 7 days"
                        : "Last 30 days";

            }


            await loadPatientVisits(
                currentChartPeriod
            );

        }
    );

}


// ============================================================
// ACCEPT / DECLINE BUTTONS
// ============================================================

function setupButtons() {

    document.addEventListener(
        "click",
        async function (event) {


            // ------------------------------------------------
            // ACCEPT
            // ------------------------------------------------

            if (
                event.target.classList.contains(
                    "accept-btn"
                )
            ) {

                const button =
                    event.target;


                const appointmentId =
                    button.dataset.id;


                if (!appointmentId) {

                    alert(
                        "Appointment ID not found."
                    );

                    return;

                }


                await changeAppointmentStatus(
                    appointmentId,
                    "Confirmed",
                    button
                );

            }


            // ------------------------------------------------
            // DECLINE
            // ------------------------------------------------

            if (
                event.target.classList.contains(
                    "decline-btn"
                )
            ) {

                const button =
                    event.target;


                const appointmentId =
                    button.dataset.id;


                if (!appointmentId) {

                    alert(
                        "Appointment ID not found."
                    );

                    return;

                }


                await changeAppointmentStatus(
                    appointmentId,
                    "Cancelled",
                    button
                );

            }


            // ------------------------------------------------
            // VIEW ALL
            // ------------------------------------------------

            if (
                event.target.classList.contains(
                    "view-btn"
                )
            ) {

                const card =
                    event.target.closest(
                        ".card"
                    );


                if (
                    card &&
                    card.classList.contains(
                        "appointments-card"
                    )
                ) {

                    window.location.href =
                        "appointment.html";

                }

            }


            // ------------------------------------------------
            // ADD PATIENT
            // ------------------------------------------------

            if (
                event.target.closest(
                    "#addPatientBtn"
                )
            ) {

                window.location.href =
                    "patient.html";

            }

        }
    );

}


// ============================================================
// CHANGE APPOINTMENT STATUS
// ============================================================

async function changeAppointmentStatus(
    appointmentId,
    status,
    button
) {

    try {

        button.disabled = true;


        const originalText =
            button.textContent;


        button.textContent =
            "Saving...";


        const response =
            await fetch(
                `${API_URL}/appointments/${appointmentId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update appointment"
            );

        }


        alert(
            status === "Confirmed"
                ? "Appointment accepted successfully."
                : "Appointment declined successfully."
        );


        const row =
            button.closest(
                ".table-row"
            );


        if (row) {

            row.remove();

        }


        await loadDashboard();


    } catch (error) {

        console.error(
            "Appointment update error:",
            error
        );


        alert(
            "Unable to update appointment."
        );


        button.disabled = false;

        button.textContent =
            status === "Confirmed"
                ? "Accept"
                : "Decline";

    }

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "globalSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            searchAppointments(
                searchValue
            );

        }
    );

}


// ============================================================
// SEARCH APPOINTMENTS
// ============================================================

function searchAppointments(
    searchValue
) {

    const appointments =
        document.querySelectorAll(
            ".appointment"
        );


    appointments.forEach(
        function (appointment) {

            const text =
                appointment.textContent
                    .toLowerCase();


            if (
                text.includes(
                    searchValue
                )
            ) {

                appointment.style.display =
                    "grid";

            } else {

                appointment.style.display =
                    "none";

            }

        }
    );

}


// ============================================================
// SIDEBAR NAVIGATION
// ============================================================

function setupNavigation() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );


    menuItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function (event) {

                    const href =
                        this.getAttribute(
                            "href"
                        );


                    // Allow logout to be handled
                    // separately
                    if (
                        this.classList.contains(
                            "logout"
                        )
                    ) {

                        return;

                    }


                    // If link is #
                    if (
                        !href ||
                        href === "#"
                    ) {

                        event.preventDefault();

                        return;

                    }


                    // Normal navigation
                    // is allowed

                }
            );

        }
    );

}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    const logout =
        document.querySelector(
            ".logout"
        );


    if (!logout) {

        return;

    }


    logout.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            // Remove login information

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "role"
            );


            sessionStorage.clear();


            // Redirect

            window.location.href =
                "login.html";

        }
    );

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(
    time,
    period
) {

    if (!time) {

        return "--";

    }


    // Already formatted
    if (
        typeof time === "string" &&
        (
            time.includes("AM") ||
            time.includes("PM")
        )
    ) {

        return `
            ${escapeHTML(time)}
        `;

    }


    const parts =
        time
            .toString()
            .split(":");


    let hour =
        parseInt(
            parts[0],
            10
        );


    const minute =
        parts[1] ?? "00";


    let calculatedPeriod =
        period;


    if (!calculatedPeriod) {

        calculatedPeriod =
            hour >= 12
                ? "PM"
                : "AM";

    }


    if (hour > 12) {

        hour -= 12;

    }


    if (hour === 0) {

        hour = 12;

    }


    return `
        ${hour}:${minute}

        <span>
            ${escapeHTML(
        calculatedPeriod
    )}
        </span>
    `;

}


// ============================================================
// FORMAT REQUEST TIME
// ============================================================

function formatRequestTime(
    time
) {

    if (!time) {

        return "--";

    }


    const parts =
        time
            .toString()
            .split(":");


    if (parts.length < 2) {

        return time;

    }


    let hour =
        parseInt(
            parts[0],
            10
        );


    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    if (hour > 12) {

        hour -= 12;

    }


    if (hour === 0) {

        hour = 12;

    }


    return `${hour}:${minute} ${period}`;

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
    date
) {

    if (!date) {

        return "--";

    }


    // If already formatted
    if (
        typeof date === "string" &&
        date.includes(" ")
    ) {

        return date;

    }


    const parsed =
        new Date(date);


    if (isNaN(parsed.getTime())) {

        return date;

    }


    return parsed.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


// ============================================================
// FORMAT CURRENCY
// ============================================================

function formatCurrency(
    value
) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "Rs 0";

    }


    return (
        "Rs " +
        number.toLocaleString(
            "en-LK",
            {
                maximumFractionDigits: 2
            }
        )
    );

}


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(
    value
) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "0";

    }


    return number.toLocaleString(
        "en-LK"
    );

}


// ============================================================
// GET STATUS CSS CLASS
// ============================================================

function getStatusClass(
    status
) {

    if (!status) {

        return "confirmed";

    }


    const value =
        status
            .toString()
            .toLowerCase()
            .trim();


    switch (value) {

        case "confirmed":
            return "confirmed";


        case "waiting":
            return "waiting";


        case "pending":
            return "waiting";


        case "requested":
            return "waiting";


        case "in progress":
            return "progress";


        case "in_progress":
            return "progress";


        case "completed":
            return "completed";


        case "cancelled":
            return "declined";


        case "canceled":
            return "declined";


        default:
            return "confirmed";

    }

}


// ============================================================
// CHART LABEL
// ============================================================

function getChartLabel(
    date,
    period
) {

    if (!date) {

        return "--";

    }


    const parsed =
        new Date(date);


    if (
        !isNaN(
            parsed.getTime()
        )
    ) {

        if (period === 7) {

            return parsed.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

        }


        return parsed.toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short"
            }
        );

    }


    return date.toString();

}


// ============================================================
// HTML SECURITY
// ============================================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


// ============================================================
// SHOW LOADING
// ============================================================

function showLoading() {

    const appointmentList =
        document.querySelector(
            ".appointment-list"
        );


    if (
        appointmentList &&
        !appointmentList.children.length
    ) {

        appointmentList.innerHTML = `

            <div class="empty-message">
                Loading appointments...
            </div>

        `;

    }

}


// ============================================================
// HIDE LOADING
// ============================================================

function hideLoading() {

    // Nothing required here.
    // Data rendering replaces
    // the loading message.

}


// ============================================================
// SHOW ERROR
// ============================================================

function showError(
    message
) {

    console.error(message);


    const appointmentList =
        document.querySelector(
            ".appointment-list"
        );


    if (appointmentList) {

        appointmentList.innerHTML = `

            <div
                class="empty-message"
                style="
                    color: #e74c3c;
                    padding: 20px;
                    text-align: center;
                "
            >

                ${escapeHTML(message)}

                <br>

                <button
                    onclick="refreshDashboard()"
                    style="
                        margin-top: 10px;
                        padding: 8px 15px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    "
                >
                    Retry
                </button>

            </div>

        `;

    }

}


// ============================================================
// AUTO REFRESH
// ============================================================

// Refresh dashboard every 60 seconds

setInterval(
    function () {

        loadDashboard();

    },
    60000
);