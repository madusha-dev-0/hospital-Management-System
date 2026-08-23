const API_URL = "http://localhost:8080/api/doctor";

let doctors = [];


// ===============================
// DOM ELEMENTS
// ===============================

const doctorTableBody =
    document.getElementById("doctor-table-body");

const doctorSearch =
    document.getElementById("doctorSearch");

const genderFilter =
    document.getElementById("genderFilter");

const specializationFilter =
    document.getElementById("specializationFilter");

const refreshBtn =
    document.getElementById("refreshBtn");

const addDoctorBtn =
    document.getElementById("addDoctorBtn");

const doctorModal =
    document.getElementById("doctorModal");

const viewDoctorModal =
    document.getElementById("viewDoctorModal");

const doctorForm =
    document.getElementById("doctorForm");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");

const closeViewModal =
    document.getElementById("closeViewModal");

const modalTitle =
    document.getElementById("modalTitle");


// ===============================
// FORM ELEMENTS
// ===============================

const doctorId =
    document.getElementById("doctorId");

const doctorName =
    document.getElementById("doctorName");

const specialization =
    document.getElementById("specialization");

const gender =
    document.getElementById("gender");

const phone =
    document.getElementById("phone");

const email =
    document.getElementById("email");

const department =
    document.getElementById("department");


// ===============================
// LOAD DOCTORS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadDoctors();

});


// ===============================
// GET ALL DOCTORS
// ===============================

async function loadDoctors() {

    showMessage("Loading doctors...", "success");

    try {

        const response = await fetch(API_URL, {
            method: "GET"
        });

        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );

        }

        const data = await response.json();

        /*
         * Spring Boot normally returns:
         *
         * [
         *   {
         *      doctorId: 1,
         *      doctorName: "John",
         *      specialization: "Cardiologist",
         *      gender: "Male",
         *      phone: "0771234567",
         *      email: "john@gmail.com",
         *      department: "Cardiology"
         *   }
         * ]
         */

        doctors = Array.isArray(data)
            ? data
            : [];

        renderDoctors();

        loadSpecializations();

        clearMessage();

    } catch (error) {

        console.error("GET DOCTORS ERROR:", error);

        doctors = [];

        renderDoctors();

        showBackendError();

    }

}


// ===============================
// DISPLAY DOCTORS
// ===============================

function renderDoctors() {

    const searchText =
        doctorSearch.value
            .trim()
            .toLowerCase();

    const selectedGender =
        genderFilter.value
            .trim()
            .toLowerCase();

    const selectedSpecialization =
        specializationFilter.value
            .trim()
            .toLowerCase();


    const filteredDoctors =
        doctors.filter(doctor => {

            const id =
                String(
                    getValue(
                        doctor,
                        [
                            "doctorId",
                            "Doctor_ID",
                            "doctor_ID"
                        ]
                    ) ?? ""
                ).toLowerCase();

            const name =
                String(
                    getValue(
                        doctor,
                        [
                            "doctorName",
                            "name",
                            "Doctor_Name"
                        ]
                    ) ?? ""
                ).toLowerCase();

            const spec =
                String(
                    getValue(
                        doctor,
                        [
                            "specialization",
                            "speciality",
                            "Specialization"
                        ]
                    ) ?? ""
                ).toLowerCase();

            const doctorGender =
                String(
                    getValue(
                        doctor,
                        [
                            "gender",
                            "Gender"
                        ]
                    ) ?? ""
                ).toLowerCase();


            const matchesSearch =
                searchText === "" ||
                id.includes(searchText) ||
                name.includes(searchText) ||
                spec.includes(searchText);


            const matchesGender =
                selectedGender === "" ||
                doctorGender === selectedGender;


            const matchesSpecialization =
                selectedSpecialization === "" ||
                spec === selectedSpecialization;


            return (
                matchesSearch &&
                matchesGender &&
                matchesSpecialization
            );

        });


    doctorTableBody.innerHTML = "";


    if (filteredDoctors.length === 0) {

        doctorTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty-message"
                >
                    No doctors found
                </td>
            </tr>
        `;

        return;
    }


    filteredDoctors.forEach(doctor => {

        const id =
            getValue(
                doctor,
                [
                    "doctorId",
                    "Doctor_ID",
                    "doctor_ID"
                ]
            );

        const name =
            getValue(
                doctor,
                [
                    "doctorName",
                    "name",
                    "Doctor_Name"
                ]
            );

        const spec =
            getValue(
                doctor,
                [
                    "specialization",
                    "speciality",
                    "Specialization"
                ]
            );

        const doctorGender =
            getValue(
                doctor,
                [
                    "gender",
                    "Gender"
                ]
            );

        const doctorPhone =
            getValue(
                doctor,
                [
                    "phone",
                    "phoneNumber",
                    "mobile",
                    "Phone"
                ]
            );

        const doctorEmail =
            getValue(
                doctor,
                [
                    "email",
                    "Email"
                ]
            );

        const doctorDepartment =
            getValue(
                doctor,
                [
                    "department",
                    "departmentName",
                    "Department"
                ]
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(id ?? "")}
            </td>

            <td>
                ${escapeHtml(name ?? "")}
            </td>

            <td>
                ${escapeHtml(spec ?? "")}
            </td>

            <td>
                ${escapeHtml(doctorGender ?? "")}
            </td>

            <td>
                ${escapeHtml(doctorPhone ?? "")}
            </td>

            <td>
                ${escapeHtml(doctorEmail ?? "")}
            </td>

            <td>
                ${escapeHtml(
            doctorDepartment ?? ""
        )}
            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewDoctor(${id})"
                >
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editDoctor(${id})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteDoctor(${id})"
                >
                    Delete
                </button>

            </td>

        `;

        doctorTableBody.appendChild(row);

    });

}


// ===============================
// ADD DOCTOR
// ===============================

addDoctorBtn.addEventListener(
    "click",
    () => {

        openAddModal();

    }
);


function openAddModal() {

    modalTitle.textContent =
        "Add Doctor";

    doctorForm.reset();

    doctorId.value = "";

    doctorModal.classList.remove("hidden");

}


// ===============================
// CLOSE MODAL
// ===============================

closeModal.addEventListener(
    "click",
    closeDoctorModal
);

cancelModal.addEventListener(
    "click",
    closeDoctorModal
);


function closeDoctorModal() {

    doctorModal.classList.add("hidden");

    doctorForm.reset();

    doctorId.value = "";

}


// ===============================
// SAVE DOCTOR
// ===============================

doctorForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const id =
            doctorId.value.trim();


        const doctorData = {

            doctorName:
                doctorName.value.trim(),

            specialization:
                specialization.value.trim(),

            gender:
            gender.value,

            phone:
                phone.value.trim(),

            email:
                email.value.trim(),

            department:
                department.value.trim()

        };


        // EDIT

        if (id !== "") {

            await updateDoctor(
                id,
                doctorData
            );

        }

        // ADD

        else {

            await addDoctor(
                doctorData
            );

        }

    }
);


// ===============================
// POST - ADD DOCTOR
// ===============================

async function addDoctor(doctorData) {

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(doctorData)
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to add doctor"
            );

        }


        showPopup(
            "Doctor added successfully",
            true
        );


        closeDoctorModal();

        await loadDoctors();


    } catch (error) {

        console.error(
            "ADD DOCTOR ERROR:",
            error
        );

        showBackendOrServerError(error);

    }

}


// ===============================
// EDIT DOCTOR
// ===============================

function editDoctor(id) {

    const doctor =
        doctors.find(
            item =>
                Number(
                    getValue(
                        item,
                        [
                            "doctorId",
                            "Doctor_ID",
                            "doctor_ID"
                        ]
                    )
                ) === Number(id)
        );


    if (!doctor) {

        showPopup(
            "Doctor not found",
            false
        );

        return;
    }


    doctorId.value =
        getValue(
            doctor,
            [
                "doctorId",
                "Doctor_ID",
                "doctor_ID"
            ]
        ) ?? "";


    doctorName.value =
        getValue(
            doctor,
            [
                "doctorName",
                "name",
                "Doctor_Name"
            ]
        ) ?? "";


    specialization.value =
        getValue(
            doctor,
            [
                "specialization",
                "speciality",
                "Specialization"
            ]
        ) ?? "";


    gender.value =
        getValue(
            doctor,
            [
                "gender",
                "Gender"
            ]
        ) ?? "";


    phone.value =
        getValue(
            doctor,
            [
                "phone",
                "phoneNumber",
                "mobile",
                "Phone"
            ]
        ) ?? "";


    email.value =
        getValue(
            doctor,
            [
                "email",
                "Email"
            ]
        ) ?? "";


    department.value =
        getValue(
            doctor,
            [
                "department",
                "departmentName",
                "Department"
            ]
        ) ?? "";


    modalTitle.textContent =
        "Edit Doctor";


    doctorModal.classList.remove(
        "hidden"
    );

}


// ===============================
// PUT - UPDATE DOCTOR
// ===============================

async function updateDoctor(
    id,
    doctorData
) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        doctorData
                    )
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to update doctor"
            );

        }


        showPopup(
            "Doctor updated successfully",
            true
        );


        closeDoctorModal();

        await loadDoctors();


    } catch (error) {

        console.error(
            "UPDATE DOCTOR ERROR:",
            error
        );

        showBackendOrServerError(error);

    }

}


// ===============================
// DELETE DOCTOR
// ===============================

async function deleteDoctor(id) {

    const doctor =
        doctors.find(
            item =>
                Number(
                    getValue(
                        item,
                        [
                            "doctorId",
                            "Doctor_ID",
                            "doctor_ID"
                        ]
                    )
                ) === Number(id)
        );


    const name =
        doctor
            ? getValue(
                doctor,
                [
                    "doctorName",
                    "name",
                    "Doctor_Name"
                ]
            )
            : "this doctor";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${name}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
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
                "Failed to delete doctor"
            );

        }


        showPopup(
            "Doctor deleted successfully",
            true
        );


        await loadDoctors();


    } catch (error) {

        console.error(
            "DELETE DOCTOR ERROR:",
            error
        );

        showBackendOrServerError(error);

    }

}


// ===============================
// VIEW DOCTOR
// ===============================

function viewDoctor(id) {

    const doctor =
        doctors.find(
            item =>
                Number(
                    getValue(
                        item,
                        [
                            "doctorId",
                            "Doctor_ID",
                            "doctor_ID"
                        ]
                    )
                ) === Number(id)
        );


    if (!doctor) {

        showPopup(
            "Doctor not found",
            false
        );

        return;

    }


    document.getElementById(
        "viewDoctorId"
    ).textContent =
        getValue(
            doctor,
            [
                "doctorId",
                "Doctor_ID",
                "doctor_ID"
            ]
        ) ?? "";


    document.getElementById(
        "viewDoctorName"
    ).textContent =
        getValue(
            doctor,
            [
                "doctorName",
                "name",
                "Doctor_Name"
            ]
        ) ?? "";


    document.getElementById(
        "viewSpecialization"
    ).textContent =
        getValue(
            doctor,
            [
                "specialization",
                "speciality",
                "Specialization"
            ]
        ) ?? "";


    document.getElementById(
        "viewGender"
    ).textContent =
        getValue(
            doctor,
            [
                "gender",
                "Gender"
            ]
        ) ?? "";


    document.getElementById(
        "viewPhone"
    ).textContent =
        getValue(
            doctor,
            [
                "phone",
                "phoneNumber",
                "mobile",
                "Phone"
            ]
        ) ?? "";


    document.getElementById(
        "viewEmail"
    ).textContent =
        getValue(
            doctor,
            [
                "email",
                "Email"
            ]
        ) ?? "";


    document.getElementById(
        "viewDepartment"
    ).textContent =
        getValue(
            doctor,
            [
                "department",
                "departmentName",
                "Department"
            ]
        ) ?? "";


    viewDoctorModal.classList.remove(
        "hidden"
    );

}


// ===============================
// CLOSE VIEW MODAL
// ===============================

closeViewModal.addEventListener(
    "click",
    () => {

        viewDoctorModal.classList.add(
            "hidden"
        );

    }
);


// ===============================
// SEARCH
// ===============================

doctorSearch.addEventListener(
    "input",
    renderDoctors
);

genderFilter.addEventListener(
    "change",
    renderDoctors
);

specializationFilter.addEventListener(
    "change",
    renderDoctors
);


// ===============================
// REFRESH
// ===============================

refreshBtn.addEventListener(
    "click",
    async () => {

        doctorSearch.value = "";

        genderFilter.value = "";

        specializationFilter.value = "";

        await loadDoctors();

    }
);


// ===============================
// LOAD SPECIALIZATIONS
// ===============================

function loadSpecializations() {

    const currentValue =
        specializationFilter.value;


    const specializations =
        doctors
            .map(
                doctor =>
                    getValue(
                        doctor,
                        [
                            "specialization",
                            "speciality",
                            "Specialization"
                        ]
                    )
            )
            .filter(
                value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
            )
            .map(
                value =>
                    String(value).trim()
            );


    const uniqueSpecializations =
        [...new Set(specializations)]
            .sort();


    specializationFilter.innerHTML = `
        <option value="">
            Specialization
        </option>
    `;


    uniqueSpecializations.forEach(
        spec => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = spec;

            option.textContent = spec;

            specializationFilter.appendChild(
                option
            );

        }
    );


    specializationFilter.value =
        currentValue;

}


// ===============================
// BACKEND ERROR
// ===============================

function showBackendError() {

    showPopup(
        "Cannot connect to backend. Please start Spring Boot.",
        false
    );

    showMessage(
        "Cannot connect to backend. Make sure Spring Boot is running on port 8080.",
        "error"
    );

}


// ===============================
// SERVER ERROR
// ===============================

function showBackendOrServerError(
    error
) {

    if (
        error instanceof TypeError
    ) {

        showBackendError();

    } else {

        showPopup(
            error.message ||
            "Operation failed",
            false
        );

        showMessage(
            error.message ||
            "Operation failed",
            "error"
        );

    }

}


// ===============================
// POPUP
// ===============================

function showPopup(
    message,
    success
) {

    const popup =
        document.getElementById(
            "popup"
        );

    const popupMessage =
        document.getElementById(
            "popupMessage"
        );

    const popupIcon =
        document.getElementById(
            "popupIcon"
        );


    popupMessage.textContent =
        message;


    popupIcon.textContent =
        success ? "✓" : "×";


    popupIcon.style.backgroundColor =
        success
            ? "#46BCE0"
            : "#E74C3C";


    popup.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            popup.classList.add(
                "hidden"
            );

        },
        3000
    );

}


// ===============================
// MESSAGE
// ===============================

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent = text;


    message.className =
        type === "success"
            ? "message-success"
            : "message-error";

}


function clearMessage() {

    const message =
        document.getElementById(
            "message"
        );

    message.textContent = "";

    message.className = "";

}


// ===============================
// GET OBJECT VALUE
// ===============================

function getValue(
    object,
    keys
) {

    for (
        const key of keys
        ) {

        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {

            return object[key];

        }

    }

    return null;

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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}