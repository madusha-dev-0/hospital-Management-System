const API_URL = "http://localhost:8080/api/bills";

let bills = [];


// ===============================
// DOM ELEMENTS
// ===============================

const tableBody = document.getElementById("bill-table-body");

const message = document.getElementById("message");

const addBillBtn = document.getElementById("addBillBtn");

const refreshBtn = document.getElementById("refreshBtn");

const billSearch = document.getElementById("billSearch");

const paymentStatusFilter =
    document.getElementById("paymentStatusFilter");

const dateFilter =
    document.getElementById("dateFilter");

const billModal =
    document.getElementById("billModal");

const viewBillModal =
    document.getElementById("viewBillModal");

const billForm =
    document.getElementById("billForm");

const modalTitle =
    document.getElementById("modalTitle");


// Form fields

const billId =
    document.getElementById("billId");

const patientId =
    document.getElementById("patientId");

const billDate =
    document.getElementById("billDate");

const amount =
    document.getElementById("amount");

const paymentMethod =
    document.getElementById("paymentMethod");

const paymentStatus =
    document.getElementById("paymentStatus");


// ===============================
// LOAD BILLS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadBills();

});


// ===============================
// GET ALL BILLS
// ===============================

async function loadBills() {

    showMessage("Loading bills...", "success");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }

        const data = await response.json();

        bills = Array.isArray(data)
            ? data
            : [];

        displayBills(bills);

        showMessage(
            `${bills.length} bill(s) loaded.`,
            "success"
        );

    } catch (error) {

        console.error("Load bills error:", error);

        bills = [];

        displayBills([]);

        showMessage(
            "Cannot connect to backend. Please make sure Spring Boot is running.",
            "error"
        );

    }

}


// ===============================
// DISPLAY BILLS
// ===============================

function displayBills(data) {

    tableBody.innerHTML = "";

    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No bills found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(bill => {

        const id =
            bill.billId ??
            bill.id ??
            "";

        const patient =
            bill.patientId ??
            bill.patient_ID ??
            bill.patient?.patientId ??
            "";

        const date =
            bill.billDate ??
            bill.date ??
            "";

        const billAmount =
            bill.amount ??
            bill.totalAmount ??
            0;

        const method =
            bill.paymentMethod ??
            bill.payment_method ??
            "";

        const status =
            bill.paymentStatus ??
            bill.status ??
            "Pending";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHtml(id)}</td>

            <td>${escapeHtml(patient)}</td>

            <td>${escapeHtml(formatDate(date))}</td>

            <td>
                Rs. ${formatAmount(billAmount)}
            </td>

            <td>
                ${escapeHtml(method)}
            </td>

            <td>
                <span class="status status-${escapeHtml(status)}">
                    ${escapeHtml(status)}
                </span>
            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewBill(${id})"
                >
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editBill(${id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteBill(${id})"
                >
                    Delete
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}


// ===============================
// ADD BILL BUTTON
// ===============================

addBillBtn.addEventListener("click", () => {

    openAddModal();

});


// ===============================
// OPEN ADD MODAL
// ===============================

function openAddModal() {

    billForm.reset();

    billId.value = "";

    modalTitle.textContent = "Add Bill";

    billModal.classList.remove("hidden");

}


// ===============================
// CLOSE MODAL
// ===============================

document.getElementById("closeModal")
    .addEventListener("click", closeBillModal);

document.getElementById("cancelModal")
    .addEventListener("click", closeBillModal);


function closeBillModal() {

    billModal.classList.add("hidden");

}


// ===============================
// ADD / UPDATE BILL
// ===============================

billForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const id = billId.value;


    const billData = {

        patientId: Number(patientId.value),

        billDate: billDate.value,

        amount: Number(amount.value),

        paymentMethod: paymentMethod.value,

        paymentStatus: paymentStatus.value

    };


    // Validation

    if (!billData.patientId) {

        showMessage(
            "Please enter Patient ID.",
            "error"
        );

        return;
    }


    if (!billData.billDate) {

        showMessage(
            "Please select bill date.",
            "error"
        );

        return;
    }


    if (billData.amount <= 0) {

        showMessage(
            "Amount must be greater than 0.",
            "error"
        );

        return;
    }


    try {

        let response;


        // UPDATE

        if (id) {

            response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(billData)
                }
            );

        }

        // CREATE

        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(billData)
                }
            );

        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                `Server returned ${response.status}`
            );

        }


        closeBillModal();

        await loadBills();


        showMessage(
            id
                ? "Bill updated successfully."
                : "Bill added successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Save bill error:",
            error
        );

        showMessage(
            "Cannot connect to backend or save bill.",
            "error"
        );

    }

});


// ===============================
// EDIT BILL
// ===============================

async function editBill(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Cannot find bill."
            );

        }


        const bill =
            await response.json();


        billId.value =
            bill.billId ??
            bill.id ??
            "";


        patientId.value =
            bill.patientId ??
            bill.patient_ID ??
            bill.patient?.patientId ??
            "";


        billDate.value =
            formatDateForInput(
                bill.billDate ??
                bill.date
            );


        amount.value =
            bill.amount ??
            bill.totalAmount ??
            "";


        paymentMethod.value =
            bill.paymentMethod ??
            bill.payment_method ??
            "";


        paymentStatus.value =
            bill.paymentStatus ??
            bill.status ??
            "Pending";


        modalTitle.textContent =
            "Edit Bill";


        billModal.classList.remove("hidden");


    } catch (error) {

        console.error(
            "Edit bill error:",
            error
        );

        showMessage(
            "Cannot load bill details.",
            "error"
        );

    }

}


// ===============================
// DELETE BILL
// ===============================

async function deleteBill(id) {

    const confirmDelete =
        confirm(
            `Are you sure you want to delete Bill ID ${id}?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                `Server returned ${response.status}`
            );

        }


        await loadBills();


        showMessage(
            "Bill deleted successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Delete bill error:",
            error
        );

        showMessage(
            "Cannot delete bill. Backend connection failed.",
            "error"
        );

    }

}


// ===============================
// VIEW BILL
// ===============================

async function viewBill(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Cannot find bill."
            );

        }


        const bill =
            await response.json();


        document.getElementById("viewBillId")
            .textContent =
            bill.billId ??
            bill.id ??
            "";


        document.getElementById("viewPatientId")
            .textContent =
            bill.patientId ??
            bill.patient_ID ??
            bill.patient?.patientId ??
            "";


        document.getElementById("viewBillDate")
            .textContent =
            formatDate(
                bill.billDate ??
                bill.date
            );


        document.getElementById("viewAmount")
            .textContent =
            formatAmount(
                bill.amount ??
                bill.totalAmount ??
                0
            );


        document.getElementById("viewPaymentMethod")
            .textContent =
            bill.paymentMethod ??
            bill.payment_method ??
            "";


        document.getElementById("viewPaymentStatus")
            .textContent =
            bill.paymentStatus ??
            bill.status ??
            "Pending";


        viewBillModal.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            "View bill error:",
            error
        );

        showMessage(
            "Cannot load bill details.",
            "error"
        );

    }

}


// ===============================
// CLOSE VIEW MODAL
// ===============================

document.getElementById("closeViewModal")
    .addEventListener(
        "click",
        closeViewModal
    );


document.getElementById("closeViewButton")
    .addEventListener(
        "click",
        closeViewModal
    );


function closeViewModal() {

    viewBillModal.classList.add(
        "hidden"
    );

}


// ===============================
// SEARCH
// ===============================

billSearch.addEventListener(
    "input",
    filterBills
);

paymentStatusFilter.addEventListener(
    "change",
    filterBills
);

dateFilter.addEventListener(
    "change",
    filterBills
);


function filterBills() {

    const searchValue =
        billSearch.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        paymentStatusFilter.value;


    const selectedDate =
        dateFilter.value;


    const filtered =
        bills.filter(bill => {


            const patient =
                String(
                    bill.patientId ??
                    bill.patient_ID ??
                    bill.patient?.patientId ??
                    ""
                ).toLowerCase();


            const status =
                bill.paymentStatus ??
                bill.status ??
                "";


            const date =
                bill.billDate ??
                bill.date ??
                "";


            const matchesPatient =
                patient.includes(
                    searchValue
                );


            const matchesStatus =
                !selectedStatus ||
                status === selectedStatus;


            const matchesDate =
                !selectedDate ||
                String(date).startsWith(
                    selectedDate
                );


            return (
                matchesPatient &&
                matchesStatus &&
                matchesDate
            );

        });


    displayBills(filtered);

}


// ===============================
// REFRESH
// ===============================

refreshBtn.addEventListener(
    "click",
    async () => {

        billSearch.value = "";

        paymentStatusFilter.value = "";

        dateFilter.value = "";

        await loadBills();

    }
);


// ===============================
// MESSAGE
// ===============================

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className =
        type === "error"
            ? "message-error"
            : "message-success";


    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 4000);

}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(date) {

    if (!date) {

        return "";

    }


    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return date;

    }


    return d.toLocaleDateString(
        "en-GB"
    );

}


function formatDateForInput(date) {

    if (!date) {

        return "";

    }


    return String(date)
        .substring(0, 10);

}


// ===============================
// FORMAT AMOUNT
// ===============================

function formatAmount(value) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "0.00";

    }


    return number.toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ===============================
// HTML ESCAPE
// ===============================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ===============================

billModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === billModal
        ) {

            closeBillModal();

        }

    }
);


viewBillModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === viewBillModal
        ) {

            closeViewModal();

        }

    }
);


// ===============================
// ESC KEY
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeBillModal();

            closeViewModal();

        }

    }
);