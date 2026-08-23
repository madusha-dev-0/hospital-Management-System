const API_URL = "/api/appointment";

let appointments = [];

let editingAppointmentId = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadAppointments();

    document
        .getElementById("addAppointmentBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("appointmentForm")
        .addEventListener("submit", saveAppointment);

    document
        .getElementById("appointmentSearch")
        .addEventListener("input", filterAppointments);

    document
        .getElementById("statusFilter")
        .addEventListener("change", filterAppointments);

    document
        .getElementById("dateFilter")
        .addEventListener("change", filterAppointments);

    document
        .getElementById("refreshBtn")
        .addEventListener("click", loadAppointments);

});


// =====================================================
// LOAD ALL APPOINTMENTS
// =====================================================

async function loadAppointments() {

    try {

        showMessage("Loading appointments...", "success");

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load appointments"
            );

        }

        appointments = await response.json();

        console.log(
            "Appointments:",
            appointments
        );

        displayAppointments(appointments);

        showMessage(
            `${appointments.length} appointment(s) loaded`,
            "success"
        );

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load appointments",
            "error"
        );

    }

}


// =====================================================
// DISPLAY APPOINTMENTS
// =====================================================

function displayAppointments(data) {

    const tableBody =
        document.getElementById(
            "appointment-table-body"
        );

    tableBody.innerHTML = "";


    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty-message">

                    No appointments found

                </td>
            </tr>
        `;

        return;

    }


    data.forEach(appointment => {

        const row =
            document.createElement("tr");


        const appointmentId =
            appointment.appointmentId ?? "-";

        const patientId =
            appointment.patient?.Patient_ID ??
            appointment.patient?.patient_ID ??
            "-";

        const doctorId =
            appointment.doctor?.Doctor_ID ??
            appointment.doctor?.doctor_ID ??
            "-";

        const date =
            appointment.AppointmentDate ??
            appointment.appointmentDate ??
            "-";

        const time =
            appointment.AppointmentTime ??
            appointment.appointmentTime ??
            "-";

        const room =
            appointment.consultationRoom ??
            "-";

        const status =
            appointment.appointmentStatus ??
            "-";


        row.innerHTML = `

            <td>
                ${appointmentId}
            </td>

            <td>
                ${patientId}
            </td>

            <td>
                ${doctorId}
            </td>

            <td>
                ${formatDate(date)}
            </td>

            <td>
                ${formatTime(time)}
            </td>

            <td>
                ${room}
            </td>

            <td>

                <span class="status status-${status}">

                    ${status}

                </span>

            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewAppointment(${appointmentId})">

                    View

                </button>

                <button
                    class="edit-button"
                    onclick="editAppointment(${appointmentId})">

                    Edit

                </button>

                <button
                    class="delete-button"
                    onclick="deleteAppointment(${appointmentId})">

                    Delete

                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });

}


// =====================================================
// ADD MODAL
// =====================================================

function openAddModal() {

    editingAppointmentId = null;

    document.getElementById(
        "modalTitle"
    ).textContent = "Add Appointment";


    document.getElementById(
        "appointmentForm"
    ).reset();


    document.getElementById(
        "appointmentId"
    ).value = "";


    document.getElementById(
        "appointmentStatus"
    ).value = "Scheduled";


    document.getElementById(
        "appointmentModal"
    ).classList.remove("hidden");

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeModal() {

    document.getElementById(
        "appointmentModal"
    ).classList.add("hidden");

}


// =====================================================
// SAVE APPOINTMENT
// =====================================================

async function saveAppointment(event) {

    event.preventDefault();


    const patientId =
        Number(
            document.getElementById(
                "patientId"
            ).value
        );


    const doctorId =
        Number(
            document.getElementById(
                "doctorId"
            ).value
        );


    const appointmentDate =
        document.getElementById(
            "appointmentDate"
        ).value;


    const appointmentTime =
        document.getElementById(
            "appointmentTime"
        ).value;


    const consultationRoom =
        document.getElementById(
            "consultationRoom"
        ).value;


    const appointmentStatus =
        document.getElementById(
            "appointmentStatus"
        ).value;


    if (!patientId || !doctorId) {

        showMessage(
            "Patient ID and Doctor ID are required",
            "error"
        );

        return;

    }


    /*
     * IMPORTANT
     *
     * This structure matches your
     * AppointmentService:
     *
     * appointment.getPatient().getPatient_ID()
     *
     * appointment.getDoctor().getDoctor_ID()
     */

    const appointmentData = {

        patient: {

            Patient_ID: patientId

        },

        doctor: {

            Doctor_ID: doctorId

        },

        AppointmentDate:
        appointmentDate,

        AppointmentTime:
            appointmentTime + ":00",

        consultationRoom:
        consultationRoom,

        appointmentStatus:
        appointmentStatus

    };


    console.log(
        "Sending appointment:",
        appointmentData
    );


    try {

        let response;


        // =============================
        // UPDATE
        // =============================

        if (editingAppointmentId) {

            response = await fetch(
                `${API_URL}/update/${editingAppointmentId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            appointmentData
                        )

                }
            );

        }


            // =============================
            // ADD
        // =============================

        else {

            response = await fetch(
                `${API_URL}/addappointment`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            appointmentData
                        )

                }
            );

        }


        const result =
            await response.text();


        console.log(
            "Server response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result ||
                "Failed to save appointment"
            );

        }


        closeModal();


        showMessage(
            editingAppointmentId
                ? "Appointment updated successfully"
                : "Appointment added successfully",
            "success"
        );


        editingAppointmentId = null;


        await loadAppointments();


    } catch (error) {

        console.error(error);

        showMessage(
            cleanErrorMessage(
                error.message
            ),
            "error"
        );

    }

}


// =====================================================
// EDIT APPOINTMENT
// =====================================================

async function editAppointment(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const appointment =
            await response.json();


        if (!response.ok) {

            throw new Error(
                typeof appointment === "string"
                    ? appointment
                    : "Appointment not found"
            );

        }


        editingAppointmentId = id;


        document.getElementById(
            "modalTitle"
        ).textContent =
            "Edit Appointment";


        const patientId =
            appointment.patient?.Patient_ID ??
            appointment.patient?.patient_ID;


        const doctorId =
            appointment.doctor?.Doctor_ID ??
            appointment.doctor?.doctor_ID;


        document.getElementById(
            "appointmentId"
        ).value = id;


        document.getElementById(
            "patientId"
        ).value = patientId ?? "";


        document.getElementById(
            "doctorId"
        ).value = doctorId ?? "";


        document.getElementById(
            "appointmentDate"
        ).value =
            appointment.AppointmentDate ??
            appointment.appointmentDate ??
            "";


        let time =
            appointment.AppointmentTime ??
            appointment.appointmentTime ??
            "";


        /*
         * HTML time input accepts HH:mm.
         */

        if (time.length >= 5) {

            time = time.substring(0, 5);

        }


        document.getElementById(
            "appointmentTime"
        ).value = time;


        document.getElementById(
            "consultationRoom"
        ).value =
            appointment.consultationRoom ??
            "";


        document.getElementById(
            "appointmentStatus"
        ).value =
            appointment.appointmentStatus ??
            "Scheduled";


        document.getElementById(
            "appointmentModal"
        ).classList.remove("hidden");


    } catch (error) {

        console.error(error);

        showMessage(
            cleanErrorMessage(
                error.message
            ),
            "error"
        );

    }

}


// =====================================================
// DELETE
// =====================================================

async function deleteAppointment(id) {

    const appointment =
        appointments.find(
            a =>
                Number(a.appointmentId) ===
                Number(id)
        );


    if (!appointment) {

        showMessage(
            "Appointment not found",
            "error"
        );

        return;

    }


    const status =
        appointment.appointmentStatus;


    if (
        status &&
        status.toLowerCase() ===
        "completed"
    ) {

        showPopupMessage(
            "Completed appointment cannot be deleted"
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Are you sure you want to delete appointment ${id}?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/delete/${id}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.text();


        if (!response.ok) {

            throw new Error(
                result ||
                "Appointment cannot be deleted"
            );

        }


        showPopupMessage(
            result ||
            "Appointment deleted successfully"
        );


        await loadAppointments();


    } catch (error) {

        console.error(error);


        /*
         * This displays your backend
         * validation messages.
         *
         * Example:
         *
         * Appointment cannot be deleted because
         * a treatment is linked to this appointment
         */

        showPopupMessage(
            cleanErrorMessage(
                error.message
            )
        );

    }

}


// =====================================================
// VIEW APPOINTMENT
// =====================================================

async function viewAppointment(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const appointment =
            await response.json();


        if (!response.ok) {

            throw new Error(
                typeof appointment === "string"
                    ? appointment
                    : "Appointment not found"
            );

        }


        const patientId =
            appointment.patient?.Patient_ID ??
            appointment.patient?.patient_ID ??
            "-";


        const doctorId =
            appointment.doctor?.Doctor_ID ??
            appointment.doctor?.doctor_ID ??
            "-";


        const date =
            appointment.AppointmentDate ??
            appointment.appointmentDate ??
            "-";


        const time =
            appointment.AppointmentTime ??
            appointment.appointmentTime ??
            "-";


        const room =
            appointment.consultationRoom ??
            "-";


        const status =
            appointment.appointmentStatus ??
            "-";


        document.getElementById(
            "appointmentDetails"
        ).innerHTML = `

            <div class="detail-row">

                <span class="detail-label">
                    Appointment ID
                </span>

                <span>
                    ${id}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Patient ID
                </span>

                <span>
                    ${patientId}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Doctor ID
                </span>

                <span>
                    ${doctorId}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Date
                </span>

                <span>
                    ${formatDate(date)}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Time
                </span>

                <span>
                    ${formatTime(time)}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Consultation Room
                </span>

                <span>
                    ${room}
                </span>

            </div>


            <div class="detail-row">

                <span class="detail-label">
                    Status
                </span>

                <span class="status status-${status}">
                    ${status}
                </span>

            </div>

        `;


        document.getElementById(
            "viewModal"
        ).classList.remove("hidden");


    } catch (error) {

        console.error(error);

        showMessage(
            cleanErrorMessage(
                error.message
            ),
            "error"
        );

    }

}


// =====================================================
// CLOSE VIEW MODAL
// =====================================================

function closeViewModal() {

    document.getElementById(
        "viewModal"
    ).classList.add("hidden");

}


// =====================================================
// SEARCH + FILTER
// =====================================================

function filterAppointments() {

    const search =
        document.getElementById(
            "appointmentSearch"
        ).value
            .trim()
            .toLowerCase();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const date =
        document.getElementById(
            "dateFilter"
        ).value;


    const filtered =
        appointments.filter(
            appointment => {


                const patientId =
                    String(
                        appointment.patient?.Patient_ID ??
                        appointment.patient?.patient_ID ??
                        ""
                    );


                const appointmentStatus =
                    appointment.appointmentStatus ??
                    "";


                const appointmentDate =
                    appointment.AppointmentDate ??
                    appointment.appointmentDate ??
                    "";


                const searchMatch =
                    patientId
                        .toLowerCase()
                        .includes(search);


                const statusMatch =
                    !status ||
                    appointmentStatus === status;


                const dateMatch =
                    !date ||
                    appointmentDate === date;


                return (
                    searchMatch &&
                    statusMatch &&
                    dateMatch
                );

            }
        );


    displayAppointments(filtered);

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {

    if (!date || date === "-") {

        return "-";

    }


    return date;

}


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(time) {

    if (!time || time === "-") {

        return "-";

    }


    return time.substring(0, 5);

}


// =====================================================
// MESSAGE
// =====================================================

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
        type === "error"
            ? "message-error"
            : "message-success";


    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 4000);

}


// =====================================================
// POPUP MESSAGE
// =====================================================

function showPopupMessage(message) {

    alert(message);

}


// =====================================================
// CLEAN BACKEND ERROR
// =====================================================

function cleanErrorMessage(message) {

    if (!message) {

        return "Something went wrong";

    }


    /*
     * Spring Boot sometimes returns
     * a huge JSON error.
     *
     * Try to extract the useful
     * backend message.
     */

    try {

        const json =
            JSON.parse(message);


        if (json.message) {

            return json.message;

        }

        if (json.error) {

            return json.error;

        }

    } catch (e) {

        // Not JSON
    }


    return message;

}