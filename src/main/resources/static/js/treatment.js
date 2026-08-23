const API_URL = "http://localhost:8080/api/treatment";

let treatments = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTreatments();

    document
        .getElementById("addTreatmentBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("closeViewModal")
        .addEventListener("click", closeViewModal);

    document
        .getElementById("treatmentForm")
        .addEventListener("submit", saveTreatment);

    document
        .getElementById("treatmentSearch")
        .addEventListener("input", filterTreatments);

    document
        .getElementById("statusFilter")
        .addEventListener("change", filterTreatments);

    document
        .getElementById("dateFilter")
        .addEventListener("change", filterTreatments);

    document
        .getElementById("refreshBtn")
        .addEventListener("click", loadTreatments);

});


// ==========================================
// LOAD ALL TREATMENTS
// ==========================================

async function loadTreatments() {

    showMessage("Loading treatments...", "success");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Backend returned status " + response.status
            );
        }

        treatments = await response.json();

        console.log("Treatment data:", treatments);

        displayTreatments(treatments);

        showMessage(
            `${treatments.length} treatment(s) loaded successfully.`,
            "success"
        );

    } catch (error) {

        console.error("Backend connection error:", error);

        treatments = [];

        displayTreatments([]);

        showBackendError();

    }

}


// ==========================================
// DISPLAY TREATMENTS
// ==========================================

function displayTreatments(data) {

    const tableBody =
        document.getElementById("treatment-table-body");

    tableBody.innerHTML = "";


    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No treatments found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(treatment => {

        const row =
            document.createElement("tr");


        const treatmentId =
            treatment.treatmentId ??
            treatment.id ??
            "-";

        const patientId =
            treatment.patientId ??
            treatment.patient?.patientId ??
            "-";

        const treatmentName =
            treatment.treatmentName ??
            treatment.name ??
            treatment.treatmentType ??
            "-";

        const doctorName =
            treatment.doctorName ??
            treatment.doctor?.doctorName ??
            treatment.doctor?.name ??
            "-";

        const treatmentDate =
            treatment.treatmentDate ??
            treatment.date ??
            "-";

        const cost =
            treatment.cost ??
            treatment.treatmentCost ??
            0;

        const status =
            treatment.status ??
            "Ongoing";


        row.innerHTML = `

            <td>
                ${escapeHtml(treatmentId)}
            </td>

            <td>
                ${escapeHtml(patientId)}
            </td>

            <td>
                ${escapeHtml(treatmentName)}
            </td>

            <td>
                ${escapeHtml(doctorName)}
            </td>

            <td>
                ${escapeHtml(formatDate(treatmentDate))}
            </td>

            <td>
                Rs. ${Number(cost).toFixed(2)}
            </td>

            <td>

                <span class="status status-${escapeHtml(status)}">
                    ${escapeHtml(status)}
                </span>

            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewTreatment(${treatmentId})"
                >
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editTreatment(${treatmentId})"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteTreatment(${treatmentId})"
                >
                    Delete
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterTreatments() {

    const search =
        document
            .getElementById("treatmentSearch")
            .value
            .trim()
            .toLowerCase();

    const status =
        document
            .getElementById("statusFilter")
            .value;

    const date =
        document
            .getElementById("dateFilter")
            .value;


    const filtered =
        treatments.filter(treatment => {

            const patientId =
                String(
                    treatment.patientId ??
                    treatment.patient?.patientId ??
                    ""
                ).toLowerCase();


            const treatmentStatus =
                treatment.status ?? "";


            const treatmentDate =
                treatment.treatmentDate ??
                treatment.date ??
                "";


            const matchesSearch =
                patientId.includes(search);


            const matchesStatus =
                status === "" ||
                treatmentStatus === status;


            const matchesDate =
                date === "" ||
                treatmentDate === date;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        });


    displayTreatments(filtered);

}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddModal() {

    document
        .getElementById("modalTitle")
        .textContent = "Add Treatment";


    document
        .getElementById("treatmentForm")
        .reset();


    document
        .getElementById("treatmentId")
        .value = "";


    document
        .getElementById("treatmentStatus")
        .value = "Ongoing";


    document
        .getElementById("treatmentModal")
        .classList.remove("hidden");

}


// ==========================================
// CLOSE ADD / EDIT MODAL
// ==========================================

function closeModal() {

    document
        .getElementById("treatmentModal")
        .classList.add("hidden");

}


// ==========================================
// SAVE TREATMENT
// ==========================================

async function saveTreatment(event) {

    event.preventDefault();


    const id =
        document
            .getElementById("treatmentId")
            .value;


    const patientId =
        Number(
            document
                .getElementById("patientId")
                .value
        );


    const treatmentName =
        document
            .getElementById("treatmentName")
            .value
            .trim();


    const doctorName =
        document
            .getElementById("doctorName")
            .value
            .trim();


    const treatmentDate =
        document
            .getElementById("treatmentDate")
            .value;


    const cost =
        Number(
            document
                .getElementById("treatmentCost")
                .value
        );


    const status =
        document
            .getElementById("treatmentStatus")
            .value;


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    if (!patientId || patientId < 1) {

        alert("Please enter a valid Patient ID.");

        return;
    }


    if (!treatmentName) {

        alert("Please enter treatment name.");

        return;
    }


    if (!doctorName) {

        alert("Please enter doctor name.");

        return;
    }


    if (!treatmentDate) {

        alert("Please select treatment date.");

        return;
    }


    if (isNaN(cost) || cost < 0) {

        alert("Please enter a valid treatment cost.");

        return;
    }


    const treatmentData = {

        patientId: patientId,

        treatmentName: treatmentName,

        doctorName: doctorName,

        treatmentDate: treatmentDate,

        cost: cost,

        status: status,

        description: description

    };


    try {

        let response;


        // EDIT
        if (id) {

            response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(treatmentData)
                }
            );

        }

        // ADD
        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(treatmentData)
                }
            );

        }


        if (!response.ok) {

            let errorMessage =
                `Request failed (${response.status})`;

            try {

                const errorData =
                    await response.json();

                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorMessage;

            } catch (e) {

                // Response wasn't JSON

            }

            throw new Error(errorMessage);
        }


        closeModal();


        showMessage(
            id
                ? "Treatment updated successfully."
                : "Treatment added successfully.",
            "success"
        );


        await loadTreatments();


    } catch (error) {

        console.error(error);

        showBackendError(
            "Cannot save treatment. Please check the backend."
        );

    }

}


// ==========================================
// EDIT TREATMENT
// ==========================================

function editTreatment(id) {

    const treatment =
        treatments.find(item =>
            String(
                item.treatmentId ??
                item.id
            ) === String(id)
        );


    if (!treatment) {

        alert("Treatment not found.");

        return;
    }


    document
        .getElementById("modalTitle")
        .textContent = "Edit Treatment";


    document
        .getElementById("treatmentId")
        .value =
        treatment.treatmentId ??
        treatment.id ??
        "";


    document
        .getElementById("patientId")
        .value =
        treatment.patientId ??
        treatment.patient?.patientId ??
        "";


    document
        .getElementById("treatmentName")
        .value =
        treatment.treatmentName ??
        treatment.name ??
        treatment.treatmentType ??
        "";


    document
        .getElementById("doctorName")
        .value =
        treatment.doctorName ??
        treatment.doctor?.doctorName ??
        treatment.doctor?.name ??
        "";


    document
        .getElementById("treatmentDate")
        .value =
        treatment.treatmentDate ??
        treatment.date ??
        "";


    document
        .getElementById("treatmentCost")
        .value =
        treatment.cost ??
        treatment.treatmentCost ??
        0;


    document
        .getElementById("treatmentStatus")
        .value =
        treatment.status ??
        "Ongoing";


    document
        .getElementById("description")
        .value =
        treatment.description ??
        "";


    document
        .getElementById("treatmentModal")
        .classList.remove("hidden");

}


// ==========================================
// DELETE TREATMENT
// ==========================================

async function deleteTreatment(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this treatment?"
        );


    if (!confirmed) {
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

            throw new Error(
                "Delete failed: " +
                response.status
            );

        }


        showMessage(
            "Treatment deleted successfully.",
            "success"
        );


        await loadTreatments();


    } catch (error) {

        console.error(error);

        showBackendError(
            "Cannot delete treatment. Please check the backend."
        );

    }

}


// ==========================================
// VIEW TREATMENT
// ==========================================

function viewTreatment(id) {

    const treatment =
        treatments.find(item =>
            String(
                item.treatmentId ??
                item.id
            ) === String(id)
        );


    if (!treatment) {

        alert("Treatment not found.");

        return;
    }


    const treatmentId =
        treatment.treatmentId ??
        treatment.id ??
        "-";


    const patientId =
        treatment.patientId ??
        treatment.patient?.patientId ??
        "-";


    const treatmentName =
        treatment.treatmentName ??
        treatment.name ??
        treatment.treatmentType ??
        "-";


    const doctorName =
        treatment.doctorName ??
        treatment.doctor?.doctorName ??
        treatment.doctor?.name ??
        "-";


    const date =
        treatment.treatmentDate ??
        treatment.date ??
        "-";


    const cost =
        treatment.cost ??
        treatment.treatmentCost ??
        0;


    const status =
        treatment.status ??
        "Ongoing";


    const description =
        treatment.description ??
        "No description";


    document.getElementById(
        "viewTreatmentId"
    ).textContent = treatmentId;


    document.getElementById(
        "viewPatientId"
    ).textContent = patientId;


    document.getElementById(
        "viewTreatmentName"
    ).textContent = treatmentName;


    document.getElementById(
        "viewDoctorName"
    ).textContent = doctorName;


    document.getElementById(
        "viewTreatmentDate"
    ).textContent = formatDate(date);


    document.getElementById(
        "viewTreatmentCost"
    ).textContent =
        Number(cost).toFixed(2);


    document.getElementById(
        "viewTreatmentStatus"
    ).textContent = status;


    document.getElementById(
        "viewDescription"
    ).textContent = description;


    document
        .getElementById("viewModal")
        .classList.remove("hidden");

}


// ==========================================
// CLOSE VIEW MODAL
// ==========================================

function closeViewModal() {

    document
        .getElementById("viewModal")
        .classList.add("hidden");

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message, type) {

    const messageBox =
        document.getElementById("message");


    messageBox.textContent = message;


    messageBox.className =
        type === "success"
            ? "message-success"
            : "message-error";


    setTimeout(() => {

        messageBox.textContent = "";

        messageBox.className = "";

    }, 4000);

}


// ==========================================
// BACKEND ERROR
// ==========================================

function showBackendError(
    message = "Cannot connect to backend. Please start the Spring Boot server."
) {

    showMessage(message, "error");


    alert(
        "Cannot connect to backend.\n\n" +
        "Please make sure your Spring Boot backend is running on:\n" +
        "http://localhost:8080"
    );

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    try {

        const d =
            new Date(date);


        if (isNaN(d.getTime())) {

            return date;

        }


        return d.toLocaleDateString();

    } catch (error) {

        return date;

    }

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {

    const treatmentModal =
        document.getElementById("treatmentModal");

    const viewModal =
        document.getElementById("viewModal");


    if (event.target === treatmentModal) {

        closeModal();

    }


    if (event.target === viewModal) {

        closeViewModal();

    }

});