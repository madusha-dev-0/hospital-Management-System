const API_URL = "http://localhost:8080/api/room";

let rooms = [];

let editingRoomId = null;


/* ================================
   PAGE LOAD
================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadRooms();

    document
        .getElementById("addRoomBtn")
        .addEventListener("click", openAddModal);

    document
        .getElementById("closeModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelModal")
        .addEventListener("click", closeModal);

    document
        .getElementById("roomForm")
        .addEventListener("submit", saveRoom);

    document
        .getElementById("roomSearch")
        .addEventListener("input", filterRooms);

    document
        .getElementById("statusFilter")
        .addEventListener("change", filterRooms);

    document
        .getElementById("typeFilter")
        .addEventListener("change", filterRooms);

    document
        .getElementById("refreshBtn")
        .addEventListener("click", loadRooms);

    document
        .getElementById("closeViewModal")
        .addEventListener("click", closeViewModal);

    document
        .getElementById("closeViewButton")
        .addEventListener("click", closeViewModal);

});


/* ================================
   LOAD ROOMS
================================ */

async function loadRooms() {

    showMessage("Loading rooms...", "success");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Backend returned status " + response.status
            );

        }

        rooms = await response.json();

        console.log("Rooms received:", rooms);

        displayRooms(rooms);

        showMessage(
            rooms.length + " room(s) loaded successfully.",
            "success"
        );

    } catch (error) {

        console.error("Backend connection error:", error);

        rooms = [];

        displayRooms([]);

        showMessage(
            "Cannot connect to backend. Please make sure Spring Boot is running.",
            "error"
        );

        alert(
            "Cannot connect to backend.\n\n" +
            "Please make sure your Spring Boot backend is running.\n\n" +
            "Expected API:\n" +
            API_URL
        );
    }
}


/* ================================
   DISPLAY ROOMS
================================ */

function displayRooms(roomList) {

    const tableBody =
        document.getElementById("room-table-body");

    tableBody.innerHTML = "";


    if (!roomList || roomList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No rooms found.
                </td>
            </tr>
        `;

        return;
    }


    roomList.forEach(room => {

        const row = document.createElement("tr");

        const roomId =
            room.roomId ??
            room.id ??
            "-";

        const roomNumber =
            room.roomNumber ??
            room.roomNo ??
            "-";

        const roomType =
            room.roomType ??
            room.type ??
            "-";

        const status =
            room.status ??
            "Available";


        row.innerHTML = `

            <td>
                ${escapeHtml(roomId)}
            </td>

            <td>
                ${escapeHtml(roomNumber)}
            </td>

            <td>
                ${escapeHtml(roomType)}
            </td>

            <td>

                <span class="status status-${escapeHtml(status)}">
                    ${escapeHtml(status)}
                </span>

            </td>

            <td>

                <button
                    class="view-button"
                    onclick="viewRoom(${JSON.stringify(roomId)})">
                    View
                </button>

                <button
                    class="edit-button"
                    onclick="editRoom(${JSON.stringify(roomId)})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteRoom(${JSON.stringify(roomId)})">
                    Delete
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });
}


/* ================================
   SEARCH + FILTER
================================ */

function filterRooms() {

    const search =
        document
            .getElementById("roomSearch")
            .value
            .trim()
            .toLowerCase();


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const type =
        document
            .getElementById("typeFilter")
            .value;


    const filteredRooms = rooms.filter(room => {

        const roomId =
            String(
                room.roomId ??
                room.id ??
                ""
            ).toLowerCase();


        const roomNumber =
            String(
                room.roomNumber ??
                room.roomNo ??
                ""
            ).toLowerCase();


        const roomType =
            String(
                room.roomType ??
                room.type ??
                ""
            );


        const roomStatus =
            String(
                room.status ??
                ""
            );


        const matchesSearch =
            roomId.includes(search) ||
            roomNumber.includes(search);


        const matchesStatus =
            status === "" ||
            roomStatus === status;


        const matchesType =
            type === "" ||
            roomType === type;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesType
        );

    });


    displayRooms(filteredRooms);
}


/* ================================
   OPEN ADD MODAL
================================ */

function openAddModal() {

    editingRoomId = null;

    document
        .getElementById("modalTitle")
        .textContent = "Add Room";


    document
        .getElementById("roomForm")
        .reset();


    document
        .getElementById("roomId")
        .value = "";


    document
        .getElementById("roomModal")
        .classList.remove("hidden");

}


/* ================================
   EDIT ROOM
================================ */

function editRoom(id) {

    const room = rooms.find(r => {

        const roomId =
            r.roomId ??
            r.id;

        return String(roomId) === String(id);

    });


    if (!room) {

        showMessage(
            "Room not found.",
            "error"
        );

        return;
    }


    editingRoomId =
        room.roomId ??
        room.id;


    document
        .getElementById("modalTitle")
        .textContent = "Edit Room";


    document
        .getElementById("roomId")
        .value = editingRoomId;


    document
        .getElementById("roomNumber")
        .value =
        room.roomNumber ??
        room.roomNo ??
        "";


    document
        .getElementById("roomType")
        .value =
        room.roomType ??
        room.type ??
        "";


    document
        .getElementById("roomStatus")
        .value =
        room.status ??
        "Available";


    document
        .getElementById("roomModal")
        .classList.remove("hidden");
}


/* ================================
   SAVE ROOM
================================ */

async function saveRoom(event) {

    event.preventDefault();


    const roomNumber =
        document
            .getElementById("roomNumber")
            .value
            .trim();


    const roomType =
        document
            .getElementById("roomType")
            .value;


    const status =
        document
            .getElementById("roomStatus")
            .value;


    if (!roomNumber || !roomType || !status) {

        showMessage(
            "Please fill all required fields.",
            "error"
        );

        return;
    }


    const roomData = {

        roomNumber: roomNumber,

        roomType: roomType,

        status: status

    };


    try {

        let response;


        /* EDIT */

        if (editingRoomId !== null) {

            response = await fetch(
                `${API_URL}/${editingRoomId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(roomData)

                }
            );

        }


        /* ADD */

        else {

            response = await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(roomData)

                }
            );

        }


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Request failed"
            );

        }


        closeModal();


        showMessage(
            editingRoomId !== null
                ? "Room updated successfully."
                : "Room added successfully.",
            "success"
        );


        await loadRooms();


        editingRoomId = null;


    } catch (error) {

        console.error(
            "Save room error:",
            error
        );


        showMessage(
            "Cannot connect to backend or save room.",
            "error"
        );


        alert(
            "Cannot connect to backend.\n\n" +
            "Please check that Spring Boot is running."
        );

    }

}


/* ================================
   DELETE ROOM
================================ */

async function deleteRoom(id) {

    const room =
        rooms.find(r => {

            const roomId =
                r.roomId ??
                r.id;

            return String(roomId) === String(id);

        });


    const roomNumber =
        room
            ? (
                room.roomNumber ??
                room.roomNo ??
                id
            )
            : id;


    const confirmed =
        confirm(
            `Are you sure you want to delete Room ${roomNumber}?`
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

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Delete failed"
            );

        }


        showMessage(
            "Room deleted successfully.",
            "success"
        );


        await loadRooms();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "Cannot delete room. Backend connection failed.",
            "error"
        );


        alert(
            "Cannot connect to backend.\n\n" +
            "Room was not deleted."
        );

    }

}


/* ================================
   VIEW ROOM
================================ */

function viewRoom(id) {

    const room =
        rooms.find(r => {

            const roomId =
                r.roomId ??
                r.id;

            return String(roomId) === String(id);

        });


    if (!room) {

        showMessage(
            "Room not found.",
            "error"
        );

        return;
    }


    document
        .getElementById("viewRoomId")
        .textContent =
        room.roomId ??
        room.id ??
        "-";


    document
        .getElementById("viewRoomNumber")
        .textContent =
        room.roomNumber ??
        room.roomNo ??
        "-";


    document
        .getElementById("viewRoomType")
        .textContent =
        room.roomType ??
        room.type ??
        "-";


    document
        .getElementById("viewRoomStatus")
        .textContent =
        room.status ??
        "-";


    document
        .getElementById("viewModal")
        .classList.remove("hidden");

}


/* ================================
   CLOSE ADD/EDIT MODAL
================================ */

function closeModal() {

    document
        .getElementById("roomModal")
        .classList.add("hidden");


    document
        .getElementById("roomForm")
        .reset();


    editingRoomId = null;

}


/* ================================
   CLOSE VIEW MODAL
================================ */

function closeViewModal() {

    document
        .getElementById("viewModal")
        .classList.add("hidden");

}


/* ================================
   MESSAGE
================================ */

function showMessage(text, type) {

    const message =
        document.getElementById("message");


    message.textContent = text;


    message.className = "";


    if (type === "success") {

        message.classList.add(
            "message-success"
        );

    }

    else {

        message.classList.add(
            "message-error"
        );

    }


    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 4000);

}


/* ================================
   HTML SECURITY
================================ */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}