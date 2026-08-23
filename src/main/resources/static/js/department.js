// ======================================================
// SMART CARE - DEPARTMENT MANAGEMENT
// ======================================================

// Spring Boot backend URL
const API_URL = "http://localhost:8080/api/department";


// ======================================================
// DOM ELEMENTS
// ======================================================

const departmentTableBody =
    document.getElementById("department-table-body");

const departmentSearch =
    document.getElementById("departmentSearch");

const statusFilter =
    document.getElementById("statusFilter");

const refreshBtn =
    document.getElementById("refreshBtn");

const addDepartmentBtn =
    document.getElementById("addDepartmentBtn");

const departmentModal =
    document.getElementById("departmentModal");

const viewModal =
    document.getElementById("viewModal");

const departmentForm =
    document.getElementById("departmentForm");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");

const closeViewModal =
    document.getElementById("closeViewModal");

const closeViewButton =
    document.getElementById("closeViewButton");

const modalTitle =
    document.getElementById("modalTitle");

const message =
    document.getElementById("message");


// Form fields

const departmentId =
    document.getElementById("departmentId");

const departmentName =
    document.getElementById("departmentName");

const description =
    document.getElementById("description");

const headDoctorId =
    document.getElementById("headDoctorId");

const departmentStatus =
    document.getElementById("departmentStatus");


// View fields

const viewDepartmentId =
    document.getElementById("viewDepartmentId");

const viewDepartmentName =
    document.getElementById("viewDepartmentName");

const viewDescription =
    document.getElementById("viewDescription");

const viewHeadDoctorId =
    document.getElementById("viewHeadDoctorId");

const viewStatus =
    document.getElementById("viewStatus");


// ======================================================
// DATA
// ======================================================

let departments = [];


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadDepartments();

});


// ======================================================
// LOAD DEPARTMENTS
// ======================================================

async function loadDepartments() {

    showMessage(
        "Loading departments...",
        "message-loading"
    );

    try {

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();


        // Make sure we have an array
        if (Array.isArray(data)) {

            departments = data;

        } else if (data.content && Array.isArray(data.content)) {

            departments = data.content;

        } else {

            departments = [];

        }


        displayDepartments(departments);

        showMessage(
            `${departments.length} department(s) loaded.`,
            "message-success"
        );


    } catch (error) {

        console.error(
            "Department loading error:",
            error
        );


        departments = [];

        displayDepartments([]);


        showMessage(
            "Cannot connect to backend. Please start Spring Boot server.",
            "message-error"
        );

        showBackendError();

    }

}


// ======================================================
// DISPLAY DEPARTMENTS
// ======================================================

function displayDepartments(data) {

    departmentTableBody.innerHTML = "";


    if (!data || data.length === 0) {

        departmentTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No departments found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(department => {

        const id =
            getDepartmentId(department);

        const name =
            getDepartmentName(department);

        const desc =
            getDescription(department);

        const doctorId =
            getHeadDoctorId(department);

        const status =
            getStatus(department);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(id)}
            </td>

            <td>
                <strong>
                    ${escapeHtml(name)}
                </strong>
            </td>

            <td>
                ${escapeHtml(desc)}
            </td>

            <td>
                ${doctorId
            ? escapeHtml(doctorId)
            : "Not Assigned"}
            </td>

            <td>
                <span class="status status-${escapeHtml(status)}">
                    ${escapeHtml(status)}
                </span>
            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewDepartment(${id})">

                    View

                </button>


                <button
                    class="edit-button"
                    onclick="editDepartment(${id})">

                    Edit

                </button>


                <button
                    class="delete-button"
                    onclick="deleteDepartment(${id})">

                    Delete

                </button>

            </td>
        `;


        departmentTableBody.appendChild(row);

    });

}


// ======================================================
// GET FIELD HELPERS
// ======================================================

// These helpers support common Java/Spring naming styles.

function getDepartmentId(department) {

    return department.departmentId ??
        department.id ??
        department.departmentID ??
        "";

}


function getDepartmentName(department) {

    return department.departmentName ??
        department.name ??
        "";

}


function getDescription(department) {

    return department.description ??
        "";

}


function getHeadDoctorId(department) {

    // If backend returns headDoctor as an object
    if (department.headDoctor &&
        typeof department.headDoctor === "object") {

        return department.headDoctor.doctorId ??
            department.headDoctor.id ??
            "";

    }


    return department.headDoctorId ??
        department.headDoctorID ??
        "";
}


function getStatus(department) {

    return department.status ??
        "Active";

}


// ======================================================
// SEARCH
// ======================================================

departmentSearch.addEventListener(
    "input",
    filterDepartments
);


statusFilter.addEventListener(
    "change",
    filterDepartments
);


function filterDepartments() {

    const search =
        departmentSearch.value
            .trim()
            .toLowerCase();


    const status =
        statusFilter.value;


    const filtered =
        departments.filter(department => {

            const id =
                String(
                    getDepartmentId(department)
                ).toLowerCase();


            const name =
                String(
                    getDepartmentName(department)
                ).toLowerCase();


            const departmentStatusValue =
                getStatus(department);


            const matchesSearch =
                id.includes(search) ||
                name.includes(search);


            const matchesStatus =
                !status ||
                departmentStatusValue === status;


            return matchesSearch &&
                matchesStatus;

        });


    displayDepartments(filtered);

}


// ======================================================
// REFRESH
// ======================================================

refreshBtn.addEventListener(
    "click",
    () => {

        departmentSearch.value = "";

        statusFilter.value = "";

        loadDepartments();

    }
);


// ======================================================
// OPEN ADD MODAL
// ======================================================

addDepartmentBtn.addEventListener(
    "click",
    openAddModal
);


function openAddModal() {

    modalTitle.textContent =
        "Add Department";


    departmentForm.reset();


    departmentId.value = "";


    departmentStatus.value =
        "Active";


    departmentModal.classList.remove(
        "hidden"
    );

}


// ======================================================
// CLOSE ADD / EDIT MODAL
// ======================================================

closeModal.addEventListener(
    "click",
    closeDepartmentModal
);


cancelModal.addEventListener(
    "click",
    closeDepartmentModal
);


function closeDepartmentModal() {

    departmentModal.classList.add(
        "hidden"
    );

}


// ======================================================
// EDIT DEPARTMENT
// ======================================================

async function editDepartment(id) {

    const department =
        departments.find(
            item =>
                Number(getDepartmentId(item)) ===
                Number(id)
        );


    if (!department) {

        showMessage(
            "Department not found.",
            "message-error"
        );

        return;

    }


    modalTitle.textContent =
        "Edit Department";


    departmentId.value =
        getDepartmentId(department);


    departmentName.value =
        getDepartmentName(department);


    description.value =
        getDescription(department);


    const doctorId =
        getHeadDoctorId(department);


    headDoctorId.value =
        doctorId || "";


    departmentStatus.value =
        getStatus(department);


    departmentModal.classList.remove(
        "hidden"
    );

}


// ======================================================
// ADD / UPDATE
// ======================================================

departmentForm.addEventListener(
    "submit",
    saveDepartment
);


async function saveDepartment(event) {

    event.preventDefault();


    const id =
        departmentId.value;


    const isEdit =
        id !== "";


    const departmentData = {

        departmentName:
            departmentName.value.trim(),

        description:
            description.value.trim(),

        headDoctorId:
            headDoctorId.value
                ? Number(headDoctorId.value)
                : null,

        status:
        departmentStatus.value

    };


    // Validation

    if (!departmentData.departmentName) {

        showMessage(
            "Please enter department name.",
            "message-error"
        );

        return;

    }


    if (!departmentData.description) {

        showMessage(
            "Please enter department description.",
            "message-error"
        );

        return;

    }


    try {

        showMessage(
            isEdit
                ? "Updating department..."
                : "Adding department...",
            "message-loading"
        );


        let url = API_URL;

        let method = "POST";


        if (isEdit) {

            url =
                `${API_URL}/${id}`;

            method =
                "PUT";

        }


        const response =
            await fetch(url, {

                method: method,

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        departmentData
                    )
            });


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                `Server returned ${response.status}`
            );

        }


        closeDepartmentModal();


        showMessage(
            isEdit
                ? "Department updated successfully."
                : "Department added successfully.",
            "message-success"
        );


        await loadDepartments();


    } catch (error) {

        console.error(
            "Save department error:",
            error
        );


        showMessage(
            "Cannot connect to backend or save department.",
            "message-error"
        );


        showBackendError();

    }

}


// ======================================================
// VIEW DEPARTMENT
// ======================================================

function viewDepartment(id) {

    const department =
        departments.find(
            item =>
                Number(getDepartmentId(item)) ===
                Number(id)
        );


    if (!department) {

        showMessage(
            "Department not found.",
            "message-error"
        );

        return;

    }


    viewDepartmentId.textContent =
        getDepartmentId(department);


    viewDepartmentName.textContent =
        getDepartmentName(department);


    viewDescription.textContent =
        getDescription(department);


    const doctorId =
        getHeadDoctorId(department);


    viewHeadDoctorId.textContent =
        doctorId || "Not Assigned";


    viewStatus.textContent =
        getStatus(department);


    viewModal.classList.remove(
        "hidden"
    );

}


// ======================================================
// CLOSE VIEW MODAL
// ======================================================

closeViewModal.addEventListener(
    "click",
    closeView
);


closeViewButton.addEventListener(
    "click",
    closeView
);


function closeView() {

    viewModal.classList.add(
        "hidden"
    );

}


// ======================================================
// DELETE DEPARTMENT
// ======================================================

async function deleteDepartment(id) {

    const department =
        departments.find(
            item =>
                Number(getDepartmentId(item)) ===
                Number(id)
        );


    if (!department) {

        showMessage(
            "Department not found.",
            "message-error"
        );

        return;

    }


    const name =
        getDepartmentName(department);


    const confirmed =
        confirm(
            `Are you sure you want to delete department "${name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        showMessage(
            "Deleting department...",
            "message-loading"
        );


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


        showMessage(
            "Department deleted successfully.",
            "message-success"
        );


        await loadDepartments();


    } catch (error) {

        console.error(
            "Delete department error:",
            error
        );


        showMessage(
            "Cannot delete department. Please check backend.",
            "message-error"
        );


        showBackendError();

    }

}


// ======================================================
// MESSAGE
// ======================================================

function showMessage(
    text,
    className
) {

    message.textContent =
        text;


    message.className =
        className;


    if (
        className ===
        "message-success"
    ) {

        setTimeout(() => {

            if (
                message.textContent ===
                text
            ) {

                message.textContent =
                    "";

                message.className =
                    "";

            }

        }, 4000);

    }

}


// ======================================================
// BACKEND ERROR POPUP
// ======================================================

function showBackendError() {

    alert(
        "Cannot connect to backend.\n\n" +
        "Please make sure your Spring Boot application is running on:\n" +
        "http://localhost:8080\n\n" +
        "Also check the Department API:\n" +
        "http://localhost:8080/api/department"
    );

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ======================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ======================================================

departmentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            departmentModal
        ) {

            closeDepartmentModal();

        }

    }
);


viewModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            viewModal
        ) {

            closeView();

        }

    }
);


// ======================================================
// ESC KEY CLOSES MODALS
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeDepartmentModal();

            closeView();

        }

    }
);