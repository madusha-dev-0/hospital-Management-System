const API_URL = "/api/patients";

document.addEventListener("DOMContentLoaded", loadPatients);

async function loadPatients() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const patients = await response.json();

        console.log("API DATA:");
        console.log(patients);

        displayPatients(patients);

    } catch (error) {

        console.error("ERROR:", error);

    }
}


function displayPatients(patients) {

    const tableBody = document.getElementById("patient-table-body");

    tableBody.innerHTML = "";

    if (!patients || patients.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No patients found
                </td>
            </tr>
        `;

        return;
    }


    patients.forEach(patient => {

        console.log("ONE PATIENT:");
        console.log(patient);

        const row = document.createElement("tr");

        /*
         * Object.values() gets the values directly from
         * the JSON object.
         *
         * This avoids guessing property names.
         */

        const values = Object.values(patient);

        row.innerHTML = `
            <td>${values[0] ?? ""}</td>
            <td>${values[1] ?? ""}</td>
            <td>${values[2] ?? ""}</td>
            <td>${values[3] ?? ""}</td>
            <td>${values[4] ?? ""}</td>
            <td>
                <button class="edit-button">
                    Edit
                </button>

                <button class="delete-button">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });
}