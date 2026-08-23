const API_URL = "http://localhost:8080/api/admission";


const tableBody =
    document.getElementById("admission-table-body");

const modal =
    document.getElementById("admission-modal");

const form =
    document.getElementById("admission-form");

const modalTitle =
    document.getElementById("modal-title");

const popup =
    document.getElementById("popup-message");


/* =========================
   POPUP
========================= */

function showMessage(message) {

    popup.textContent = message;

    popup.classList.add("show");

    setTimeout(() => {

        popup.classList.remove("show");

    }, 3000);
}


/* =========================
   LOAD ADMISSIONS
========================= */

async function loadAdmissions() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Backend error");
        }

        const data = await response.json();

        displayAdmissions(data);

    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect backend. Please start Spring Boot."
        );

        displayAdmissions([]);

    }
}


/* =========================
   DISPLAY DATA
========================= */

function displayAdmissions(admissions) {

    tableBody.innerHTML = "";


    if (!admissions || admissions.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-message">

                    No admission records found

                </td>

            </tr>

        `;

        return;
    }


    admissions.forEach(admission => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${admission.admissionId ?? "-"}
            </td>

            <td>
                ${admission.patientId ?? "-"}
            </td>

            <td>
                ${admission.doctorId ?? "-"}
            </td>

            <td>
                ${admission.roomId ?? "-"}
            </td>

            <td>
                ${admission.admissionDate ?? "-"}
            </td>

            <td>

                ${createStatus(admission.status)}

            </td>

            <td>

                <button
                    class="edit-button"
                    onclick='editAdmission(${JSON.stringify(admission)})'>

                    Edit

                </button>

                <button
                    class="delete-button"
                    onclick="deleteAdmission(${admission.admissionId})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });
}


/* =========================
   STATUS
========================= */

function createStatus(status) {

    if (!status) {

        return "-";
    }


    let className = "";


    if (status === "ADMITTED") {

        className = "status-admitted";

    } else if (status === "DISCHARGED") {

        className = "status-discharged";

    } else if (status === "TRANSFERRED") {

        className = "status-transferred";
    }


    return `

        <span class="status ${className}">

            ${status}

        </span>

    `;
}


/* =========================
   OPEN ADD MODAL
========================= */

document
    .getElementById("add-admission-button")
    .addEventListener("click", () => {

        form.reset();

        document.getElementById("admission-id").value = "";

        modalTitle.textContent = "Add Admission";

        modal.classList.add("show");

    });


/* =========================
   CLOSE MODAL
========================= */

document
    .getElementById("close-modal")
    .addEventListener("click", closeModal);


document
    .getElementById("cancel-button")
    .addEventListener("click", closeModal);


function closeModal() {

    modal.classList.remove("show");

}


/* =========================
   ADD / UPDATE
========================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const admissionId =
        document.getElementById("admission-id").value;


    const admission = {

        patientId:
            Number(
                document.getElementById("patient-id").value
            ),

        doctorId:
            Number(
                document.getElementById("doctor-id").value
            ),

        roomId:
            Number(
                document.getElementById("room-id").value
            ),

        admissionDate:
        document.getElementById("admission-date").value,

        reason:
        document.getElementById("reason").value,

        status:
        document.getElementById("admission-status").value

    };


    try {

        let response;


        if (admissionId) {

            response = await fetch(
                `${API_URL}/${admissionId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(admission)
                }
            );

        } else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(admission)
                }
            );

        }


        if (!response.ok) {

            if (response.status === 404) {

                showMessage(
                    "Patient, Doctor, Room or Admission not found."
                );

            } else {

                showMessage(
                    "Failed to save admission."
                );
            }

            return;
        }


        showMessage(
            admissionId
                ? "Admission updated successfully."
                : "Admission added successfully."
        );


        closeModal();

        loadAdmissions();


    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect backend. Please start Spring Boot."
        );

    }

});


/* =========================
   EDIT
========================= */

function editAdmission(admission) {

    document.getElementById("admission-id").value =
        admission.admissionId ?? "";


    document.getElementById("patient-id").value =
        admission.patientId ?? "";


    document.getElementById("doctor-id").value =
        admission.doctorId ?? "";


    document.getElementById("room-id").value =
        admission.roomId ?? "";


    document.getElementById("admission-date").value =
        admission.admissionDate ?? "";


    document.getElementById("reason").value =
        admission.reason ?? "";


    document.getElementById("admission-status").value =
        admission.status ?? "";


    modalTitle.textContent = "Update Admission";

    modal.classList.add("show");

}


/* =========================
   DELETE
========================= */

async function deleteAdmission(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this admission?"
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


        if (response.status === 404) {

            showMessage(
                "Admission not found."
            );

            return;
        }


        if (!response.ok) {

            showMessage(
                "Failed to delete admission."
            );

            return;
        }


        showMessage(
            "Admission deleted successfully."
        );


        loadAdmissions();


    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect backend. Please start Spring Boot."
        );

    }

}


/* =========================
   SEARCH
========================= */

document
    .getElementById("admission-search")
    .addEventListener("input", searchAdmissions);


async function searchAdmissions() {

    const searchValue =
        document
            .getElementById("admission-search")
            .value
            .trim();


    if (searchValue === "") {

        loadAdmissions();

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${searchValue}`
        );


        if (response.status === 404) {

            displayAdmissions([]);

            showMessage(
                "No admission found."
            );

            return;
        }


        if (!response.ok) {

            throw new Error("Search failed");
        }


        const admission =
            await response.json();


        displayAdmissions([admission]);


    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect backend. Please start Spring Boot."
        );

    }

}


/* =========================
   STATUS FILTER
========================= */

document
    .getElementById("status")
    .addEventListener("change", filterAdmissions);


async function filterAdmissions() {

    const selectedStatus =
        document.getElementById("status").value;


    if (selectedStatus === "all") {

        loadAdmissions();

        return;
    }


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error("Backend error");
        }


        const data =
            await response.json();


        const filtered =
            data.filter(
                admission =>
                    admission.status === selectedStatus
            );


        displayAdmissions(filtered);


    } catch (error) {

        console.error(error);

        showMessage(
            "Cannot connect backend. Please start Spring Boot."
        );

    }

}


/* =========================
   INITIAL LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    loadAdmissions
);