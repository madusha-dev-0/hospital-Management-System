const API_URL = "/api/patients";

document.addEventListener("DOMContentLoaded", () => {

    loadPatients();

    document.getElementById("searchBtn").addEventListener("click", searchPatients);
    document.getElementById("refreshBtn").addEventListener("click", loadPatients);

    document.getElementById("addPatientBtn").addEventListener("click", openAddModal);

    document.getElementById("closeModal").addEventListener("click", closePatientModal);
    document.getElementById("cancelModal").addEventListener("click", closePatientModal);

    document.getElementById("closeViewModal").addEventListener("click", closeViewModal);

    document.getElementById("patientForm").addEventListener("submit", savePatient);

    // Search when pressing Enter
    document.getElementById("patientSearch").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchPatients();
        }
    });

    // Top search bar
    document.getElementById("topSearchBar").addEventListener("input", function () {
        document.getElementById("patientSearch").value = this.value;
        searchPatients();
    });
});

function showDeleteMessage(message) {

    const modal = document.getElementById("deleteMessageModal");
    const content = document.getElementById("deleteMessageContent");

    // Convert backend newline into readable lines
    content.textContent = message;

    modal.classList.remove("hidden");
}


function closeDeleteMessage() {

    document
        .getElementById("deleteMessageModal")
        .classList.add("hidden");
}


document
    .getElementById("closeDeleteMessage")
    .addEventListener("click", closeDeleteMessage);


document
    .getElementById("deleteMessageOk")
    .addEventListener("click", closeDeleteMessage);


/* ================= LOAD PATIENTS ================= */

async function loadPatients() {

    showMessage("Loading patients...", "success");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load patients");
        }

        const patients = await response.json();

        console.log("Patients from backend:", patients);

        displayPatients(patients);

        showMessage("");

    } catch (error) {

        console.error("Error:", error);

        showMessage("Unable to load patients", "error");
    }
}


/* ================= DISPLAY PATIENTS ================= */

function displayPatients(patients) {

    const tableBody = document.getElementById("patient-table-body");

    tableBody.innerHTML = "";

    if (!patients || patients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No patients found
                </td>
            </tr>
        `;
        return;
    }

    patients.forEach(patient => {

        console.log("CURRENT PATIENT OBJECT:", patient);
        console.log("KEYS:", Object.keys(patient));

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${getPatientValue(patient, "Patient_ID", "patient_ID")}</td>

            <td>${getPatientValue(patient, "Full_Name", "full_Name")}</td>

            <td>${getPatientValue(patient, "Blood_Group", "blood_Group")}</td>

            <td>${getPatientValue(patient, "DOB", "dob", "dOB")}</td>

            <td>${getPatientValue(patient, "Gender", "gender")}</td>

            <td>${getPatientValue(patient, "Contact_Number", "contact_Number")}</td>

            <td>${getPatientValue(patient, "Address", "address")}</td>

            <td>
                <button
                    class="view-button"
                    onclick='viewPatient(${JSON.stringify(patient)})'>
                    View
                </button>

                <button
                    class="edit-button"
                    onclick='editPatient(${JSON.stringify(patient)})'>
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deletePatient(${getPatientValue(patient, "Patient_ID", "patient_ID")})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function getPatientValue(patient, ...keys) {

    for (const key of keys) {

        if (
            patient[key] !== undefined &&
            patient[key] !== null &&
            patient[key] !== ""
        ) {
            return patient[key];
        }
    }

    return "-";
}


/* ================= GET VALUE ================= */

function getValue(patient, property) {

    if (
        patient[property] !== undefined &&
        patient[property] !== null &&
        patient[property] !== ""
    ) {
        return patient[property];
    }

    return "-";
}


/* ================= SEARCH ================= */

async function searchPatients() {

    const searchText =
        document.getElementById("patientSearch").value.trim();

    const bloodGroup =
        document.getElementById("bloodGroupFilter").value;

    const gender =
        document.getElementById("genderFilter").value;

    let id = "";
    let name = "";

    // If search text is a number, search by ID
    if (searchText !== "") {

        if (!isNaN(searchText)) {
            id = searchText;
        } else {
            name = searchText;
        }
    }

    const params = new URLSearchParams();

    if (id !== "") {
        params.append("id", id);
    }

    if (name !== "") {
        params.append("name", name);
    }

    if (bloodGroup !== "") {
        params.append("bloodGroup", bloodGroup);
    }

    if (gender !== "") {
        params.append("gender", gender);
    }

    try {

        const response = await fetch(
            `${API_URL}/search?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const patients = await response.json();

        console.log("Search result:", patients);

        displayPatients(patients);

    } catch (error) {

        console.error(error);

        showMessage("Patient search failed", "error");
    }
}


/* ================= ADD PATIENT ================= */

function openAddModal() {

    document.getElementById("modalTitle").textContent = "Add Patient";

    document.getElementById("patientForm").reset();

    document.getElementById("patientId").value = "";

    document.getElementById("patientModal").classList.remove("hidden");
}


/* ================= CLOSE PATIENT MODAL ================= */

function closePatientModal() {

    document
        .getElementById("patientModal")
        .classList.add("hidden");
}


/* ================= SAVE / UPDATE PATIENT ================= */

async function savePatient(event) {

    event.preventDefault();

    const patientId =
        document.getElementById("patientId").value;

    const patient = {

        full_Name:
        document.getElementById("fullName").value,

        blood_Group:
        document.getElementById("bloodGroup").value,

        dob:
        document.getElementById("dob").value,

        gender:
        document.getElementById("gender").value,

        address:
        document.getElementById("address").value,

        contact_Number:
        document.getElementById("contactNumber").value,

        emergency_Contact_Information:
        document.getElementById("emergencyContact").value
    };

    console.log("Sending patient:", patient);

    try {

        let url;
        let method;

        if (patientId) {

            url = `${API_URL}/update/${patientId}`;
            method = "PUT";

        } else {

            url = `${API_URL}/addpatient`;
            method = "POST";
        }

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(patient)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result);
        }

        console.log("Backend response:", result);

        closePatientModal();

        showMessage(
            patientId
                ? "Patient updated successfully"
                : "Patient added successfully",
            "success"
        );

        loadPatients();

    } catch (error) {

        console.error(error);

        showMessage(
            "Error: " + error.message,
            "error"
        );
    }
}


/* ================= EDIT PATIENT ================= */

function editPatient(patient) {

    console.log("Editing patient:", patient);

    document.getElementById("modalTitle").textContent =
        "Edit Patient";

    document.getElementById("patientId").value =
        getValue(patient, "patient_ID");

    document.getElementById("fullName").value =
        getValue(patient, "full_Name") === "-"
            ? ""
            : getValue(patient, "full_Name");

    document.getElementById("bloodGroup").value =
        getValue(patient, "blood_Group") === "-"
            ? ""
            : getValue(patient, "blood_Group");

    document.getElementById("dob").value =
        getValue(patient, "dob") === "-"
            ? ""
            : getValue(patient, "dob");

    document.getElementById("gender").value =
        getValue(patient, "gender") === "-"
            ? ""
            : getValue(patient, "gender");

    document.getElementById("address").value =
        getValue(patient, "address") === "-"
            ? ""
            : getValue(patient, "address");

    document.getElementById("contactNumber").value =
        getValue(patient, "contact_Number") === "-"
            ? ""
            : getValue(patient, "contact_Number");

    document.getElementById("emergencyContact").value =
        getValue(patient, "emergency_Contact_Information") === "-"
            ? ""
            : getValue(patient, "emergency_Contact_Information");

    document
        .getElementById("patientModal")
        .classList.remove("hidden");
}


/* ================= VIEW PATIENT ================= */

function viewPatient(patient) {

    console.log("Viewing patient:", patient);

    document.getElementById("viewPatientId").textContent =
        getValue(patient, "patient_ID");

    document.getElementById("viewFullName").textContent =
        getValue(patient, "full_Name");

    document.getElementById("viewBloodGroup").textContent =
        getValue(patient, "blood_Group");

    document.getElementById("viewDOB").textContent =
        getValue(patient, "dob");

    document.getElementById("viewGender").textContent =
        getValue(patient, "gender");

    document.getElementById("viewAddress").textContent =
        getValue(patient, "address");

    document.getElementById("viewContact").textContent =
        getValue(patient, "contact_Number");

    document.getElementById("viewEmergency").textContent =
        getValue(patient, "emergency_Contact_Information");

    document
        .getElementById("viewModal")
        .classList.remove("hidden");
}


/* ================= CLOSE VIEW ================= */

function closeViewModal() {

    document
        .getElementById("viewModal")
        .classList.add("hidden");
}


/* ================= DELETE PATIENT ================= */

async function deletePatient(id) {

    if (!confirm("Are you sure you want to delete this patient?")) {
        return;
    }

    try {

        const response = await fetch(
            `/api/patients/delete/${id}`,
            {
                method: "DELETE"
            }
        );

        const message = await response.text();

        if (!response.ok) {

            // Show backend error in popup
            showDeleteMessage(message);

            return;
        }

        // Successful delete
        alert(message);

        loadPatients();

    } catch (error) {

        console.error("Delete error:", error);

        showDeleteMessage(
            "Unable to delete patient. Please try again."
        );
    }
}


/* ================= MESSAGE ================= */

function showMessage(message, type = "") {

    const messageElement =
        document.getElementById("message");

    messageElement.textContent = message;

    messageElement.className = "";

    if (type === "success") {
        messageElement.classList.add("message-success");
    }

    if (type === "error") {
        messageElement.classList.add("message-error");
    }
}


/* ================= PAGE NAVIGATION ================= */

function goToPage(page) {

    window.location.href = page;
}