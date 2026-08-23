/*
    SMART CARE - LABORATORY MANAGEMENT

    Backend API:

    GET     http://localhost:8080/api/laboratory
    POST    http://localhost:8080/api/laboratory
    PUT     http://localhost:8080/api/laboratory/{id}
    DELETE  http://localhost:8080/api/laboratory/{id}
*/


const API_URL = "http://localhost:8080/api/laboratory";


// ===============================
// GLOBAL DATA
// ===============================

let laboratoryData = [];


// ===============================
// DOM ELEMENTS
// ===============================

const tableBody =
    document.getElementById("laboratory-table-body");

const message =
    document.getElementById("message");

const searchInput =
    document.getElementById("laboratorySearch");

const statusFilter =
    document.getElementById("statusFilter");

const dateFilter =
    document.getElementById("dateFilter");

const refreshBtn =
    document.getElementById("refreshBtn");

const addLaboratoryBtn =
    document.getElementById("addLaboratoryBtn");

const modal =
    document.getElementById("laboratoryModal");

const viewModal =
    document.getElementById("viewModal");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");

const closeViewModal =
    document.getElementById("closeViewModal");

const form =
    document.getElementById("laboratoryForm");

const modalTitle =
    document.getElementById("modalTitle");


// ===============================
// FORM ELEMENTS
// ===============================

const laboratoryId =
    document.getElementById("laboratoryId");

const patientId =
    document.getElementById("patientId");

const testName =
    document.getElementById("testName");

const testDate =
    document.getElementById("testDate");

const testResult =
    document.getElementById("testResult");

const testStatus =
    document.getElementById("testStatus");


// ===============================
// START APPLICATION
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadLaboratoryTests();

});


// ===============================
// GET ALL LABORATORY TESTS
// ===============================

async function loadLaboratoryTests() {

    showMessage("Loading laboratory tests...", "success");

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {

            throw new Error(
                `Backend returned status ${response.status}`
            );

        }


        const data = await response.json();


        /*
            Spring Boot can return either:

            [
                {...},
                {...}
            ]

            OR

            {
                content: [...]
            }

            This handles both.
        */

        if (Array.isArray(data)) {

            laboratoryData = data;

        } else if (data.content && Array.isArray(data.content)) {

            laboratoryData = data.content;

        } else {

            laboratoryData = [];

        }


        renderTable(laboratoryData);

        clearMessage();


    } catch (error) {

        console.error(
            "Laboratory backend error:",
            error
        );


        laboratoryData = [];

        renderTable([]);


        showBackendError();

    }

}


// ===============================
// RENDER TABLE
// ===============================

function renderTable(data) {

    tableBody.innerHTML = "";


    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-message"
                >
                    No laboratory tests found.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(function (laboratory) {

        const id =
            getId(laboratory);

        const patient =
            getPatientId(laboratory);

        const name =
            getTestName(laboratory);

        const date =
            getTestDate(laboratory);

        const result =
            getResult(laboratory);

        const status =
            getStatus(laboratory);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(id)}
            </td>

            <td>
                ${escapeHtml(patient)}
            </td>

            <td>
                ${escapeHtml(name)}
            </td>

            <td>
                ${escapeHtml(formatDate(date))}
            </td>

            <td>
                ${escapeHtml(result || "-")}
            </td>

            <td>
                ${createStatusBadge(status)}
            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewLaboratory('${escapeJs(id)}')"
                >
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editLaboratory('${escapeJs(id)}')"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteLaboratory('${escapeJs(id)}')"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ===============================
// SEARCH + FILTER
// ===============================

function applyFilters() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const selectedDate =
        dateFilter.value;


    const filtered =
        laboratoryData.filter(function (laboratory) {

            const id =
                String(getId(laboratory))
                    .toLowerCase();

            const patient =
                String(getPatientId(laboratory))
                    .toLowerCase();

            const name =
                String(getTestName(laboratory))
                    .toLowerCase();

            const status =
                getStatus(laboratory);

            const date =
                getTestDate(laboratory);


            const matchesSearch =
                searchValue === "" ||

                id.includes(searchValue) ||

                patient.includes(searchValue) ||

                name.includes(searchValue);


            const matchesStatus =
                selectedStatus === "" ||

                status === selectedStatus;


            const matchesDate =
                selectedDate === "" ||

                date === selectedDate;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        });


    renderTable(filtered);

}


searchInput.addEventListener(
    "input",
    applyFilters
);


statusFilter.addEventListener(
    "change",
    applyFilters
);


dateFilter.addEventListener(
    "change",
    applyFilters
);


// ===============================
// REFRESH
// ===============================

refreshBtn.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        statusFilter.value = "";

        dateFilter.value = "";

        loadLaboratoryTests();

    }
);


// ===============================
// OPEN ADD MODAL
// ===============================

addLaboratoryBtn.addEventListener(
    "click",
    function () {

        openAddModal();

    }
);


function openAddModal() {

    form.reset();

    laboratoryId.value = "";

    modalTitle.textContent =
        "Add Laboratory Test";

    testStatus.value =
        "Pending";


    modal.classList.remove("hidden");

}


// ===============================
// CLOSE ADD / EDIT MODAL
// ===============================

closeModal.addEventListener(
    "click",
    closeLaboratoryModal
);


cancelModal.addEventListener(
    "click",
    closeLaboratoryModal
);


function closeLaboratoryModal() {

    modal.classList.add("hidden");

    form.reset();

    laboratoryId.value = "";

}


// ===============================
// ADD / EDIT FORM SUBMIT
// ===============================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            laboratoryId.value.trim();


        const laboratory =
            createLaboratoryObject();


        try {

            let response;


            if (id === "") {

                // ADD

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body:
                            JSON.stringify(laboratory)
                    }
                );


            } else {

                // UPDATE

                response = await fetch(
                    `${API_URL}/${encodeURIComponent(id)}`,

                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body:
                            JSON.stringify(laboratory)
                    }
                );

            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    `HTTP ${response.status}`
                );

            }


            closeLaboratoryModal();


            if (id === "") {

                showMessage(
                    "Laboratory test added successfully.",
                    "success"
                );

            } else {

                showMessage(
                    "Laboratory test updated successfully.",
                    "success"
                );

            }


            await loadLaboratoryTests();


        } catch (error) {

            console.error(
                "Save laboratory error:",
                error
            );


            showBackendError();

        }

    }
);


// ===============================
// CREATE JSON OBJECT
// ===============================

function createLaboratoryObject() {

    return {

        patientId:
            Number(patientId.value),

        testName:
            testName.value.trim(),

        testDate:
        testDate.value,

        result:
            testResult.value.trim(),

        status:
        testStatus.value

    };

}


// ===============================
// EDIT
// ===============================

window.editLaboratory =
    function (id) {

        const laboratory =
            laboratoryData.find(function (item) {

                return String(
                    getId(item)
                ) === String(id);

            });


        if (!laboratory) {

            showMessage(
                "Laboratory test not found.",
                "error"
            );

            return;

        }


        laboratoryId.value =
            getId(laboratory);


        patientId.value =
            getPatientId(laboratory);


        testName.value =
            getTestName(laboratory);


        testDate.value =
            getTestDate(laboratory);


        testResult.value =
            getResult(laboratory);


        testStatus.value =
            getStatus(laboratory) ||
            "Pending";


        modalTitle.textContent =
            "Edit Laboratory Test";


        modal.classList.remove("hidden");

    };


// ===============================
// DELETE
// ===============================

window.deleteLaboratory =
    async function (id) {

        const laboratory =
            laboratoryData.find(function (item) {

                return String(
                    getId(item)
                ) === String(id);

            });


        const name =
            laboratory
                ? getTestName(laboratory)
                : "this laboratory test";


        const confirmed =
            confirm(
                `Are you sure you want to delete ${name}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${encodeURIComponent(id)}`,

                    {
                        method: "DELETE",

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    `HTTP ${response.status}`
                );

            }


            showMessage(
                "Laboratory test deleted successfully.",
                "success"
            );


            await loadLaboratoryTests();


        } catch (error) {

            console.error(
                "Delete laboratory error:",
                error
            );


            showBackendError();

        }

    };


// ===============================
// VIEW
// ===============================

window.viewLaboratory =
    function (id) {

        const laboratory =
            laboratoryData.find(function (item) {

                return String(
                    getId(item)
                ) === String(id);

            });


        if (!laboratory) {

            showMessage(
                "Laboratory test not found.",
                "error"
            );

            return;

        }


        document.getElementById(
            "viewTestId"
        ).textContent =
            getId(laboratory);


        document.getElementById(
            "viewPatientId"
        ).textContent =
            getPatientId(laboratory);


        document.getElementById(
            "viewTestName"
        ).textContent =
            getTestName(laboratory);


        document.getElementById(
            "viewTestDate"
        ).textContent =
            formatDate(
                getTestDate(laboratory)
            );


        document.getElementById(
            "viewTestResult"
        ).textContent =
            getResult(laboratory) || "-";


        document.getElementById(
            "viewTestStatus"
        ).innerHTML =
            createStatusBadge(
                getStatus(laboratory)
            );


        viewModal.classList.remove(
            "hidden"
        );

    };


// ===============================
// CLOSE VIEW MODAL
// ===============================

closeViewModal.addEventListener(
    "click",
    function () {

        viewModal.classList.add(
            "hidden"
        );

    }
);


// ===============================
// CLICK OUTSIDE MODAL
// ===============================

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            closeLaboratoryModal();

        }

    }
);


viewModal.addEventListener(
    "click",
    function (event) {

        if (event.target === viewModal) {

            viewModal.classList.add(
                "hidden"
            );

        }

    }
);


// ===============================
// ESC KEY
// ===============================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            modal.classList.add(
                "hidden"
            );

            viewModal.classList.add(
                "hidden"
            );

        }

    }
);


// ===============================
// HELPER FUNCTIONS
// ===============================


function getId(item) {

    return (
        item.laboratoryId ??
        item.labId ??
        item.testId ??
        item.id ??
        ""
    );

}


function getPatientId(item) {

    if (
        item.patientId !== undefined &&
        item.patientId !== null
    ) {

        return item.patientId;

    }


    if (item.patient) {

        return (
            item.patient.patientId ??
            item.patient.id ??
            ""
        );

    }


    return "";

}


function getTestName(item) {

    return (
        item.testName ??
        item.laboratoryTestName ??
        item.labTestName ??
        item.name ??
        ""
    );

}


function getTestDate(item) {

    const value =
        item.testDate ??
        item.laboratoryDate ??
        item.date ??
        "";


    if (!value) {

        return "";

    }


    return String(value).substring(
        0,
        10
    );

}


function getResult(item) {

    return (
        item.result ??
        item.testResult ??
        item.laboratoryResult ??
        ""
    );

}


function getStatus(item) {

    return (
        item.status ??
        item.testStatus ??
        "Pending"
    );

}


// ===============================
// STATUS BADGE
// ===============================

function createStatusBadge(status) {

    if (!status) {

        status = "Pending";

    }


    const className =
        status.replace(
            /\s+/g,
            ""
        );


    return `
        <span
            class="status status-${escapeHtml(className)}"
        >
            ${escapeHtml(status)}
        </span>
    `;

}


// ===============================
// DATE FORMAT
// ===============================

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parts =
        String(date).split("-");


    if (parts.length === 3) {

        return `${parts[2]}/${parts[1]}/${parts[0]}`;

    }


    return date;

}


// ===============================
// SUCCESS / ERROR MESSAGE
// ===============================

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className =
        type === "success"
            ? "message-success"
            : "message-error";

}


function clearMessage() {

    message.textContent = "";

    message.className = "";

}


// ===============================
// BACKEND ERROR POPUP
// ===============================

function showBackendError() {

    message.innerHTML = `
        <strong>
            Cannot connect to backend.
        </strong>
        Please make sure the Spring Boot
        server is running on
        http://localhost:8080
    `;

    message.className =
        "message-error";


    alert(
        "Cannot connect to backend.\n\n" +
        "Please make sure your Spring Boot " +
        "server is running."
    );

}


// ===============================
// HTML SECURITY
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
// JAVASCRIPT STRING SECURITY
// ===============================

function escapeJs(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}