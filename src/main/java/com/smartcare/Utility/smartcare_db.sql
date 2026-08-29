use smartcare_db;

CREATE TABLE admission (
Admission_ID INT PRIMARY KEY AUTO_INCREMENT,
Patient_ID INT NOT NULL,
Room_ID INT NOT NULL,
Admission_Date DATE NOT NULL,
Discharge_Date DATE,
Bed_Number VARCHAR(10) NOT NULL,
Admission_Status ENUM('Admitted','Discharged') NOT NULL,
						
CONSTRAINT FK_Admission_Patient FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID),
						
CONSTRAINT FK_Admission_Room FOREIGN KEY (Room_ID) REFERENCES room(Room_ID)
);

desc admission;


CREATE TABLE patient (
Patient_ID INT PRIMARY KEY AUTO_INCREMENT,
Full_Name VARCHAR(100) NOT NULL,
Blood_Group VARCHAR(5),
DOB DATE NOT NULL,
Gender ENUM('Male','Female','Other') NOT NULL,
Address VARCHAR(255) NOT NULL,
Contact_Number VARCHAR(15) NOT NULL,
Emergency_Contact_Information VARCHAR(100) NOT NULL
);

INSERT INTO patient (Full_Name,Blood_Group,DOB,Gender,Address,contact_number,Emergency_Contact_Information)
VALUES ("Nimal Kumara","A+",'2005-03-03',"Male","Navagamuva","0752315936","Nimal - 07254673423 - horana"),
('Kamal Perera', 'A+', '1990-05-12', 'Male', 'Colombo', '0712345678', 'Nimal Perera - 0771234567'),
('Nadeesha Silva', 'B+', '1995-08-21', 'Female', 'Kandy', '0723456789', 'Sunil Silva - 0782345678'),
('Ravindu Fernando', 'O+', '1988-03-15', 'Male', 'Galle', '0763456789', 'Amal Fernando - 0773456789'),
('Tharushi Kumar', 'AB+', '2001-11-02', 'Female', 'Jaffna', '0754567890', 'Kumar - 0774567890'),
('Dinesh Raj', 'A-', '1979-07-19', 'Male', 'Negombo', '0775678901', 'Suresh Raj - 0715678901'),
('Hiruni Perera', 'O-', '1998-01-25', 'Female', 'Colombo', '0786789012', 'Ruwan Perera - 0726789012'),
('Arun Wijesinghe', 'B-', '1985-09-30', 'Male', 'Kurunegala', '0717890123', 'Sunil Wijesinghe - 0777890123'),
('Sachini De Silva', 'A+', '1993-04-17', 'Female', 'Matara', '0728901234', 'Nimal De Silva - 0768901234'),
('Praveen Kumar', 'O+', '2000-12-10', 'Male', 'Batticaloa', '0769012345', 'Ravi Kumar - 0759012345'),
('Meena Rajan', 'AB-', '1992-06-28', 'Female', 'Vavuniya', '0750123456', 'Rajan - 0770123456');

desc patient;

SELECT * FROM patient;

CREATE TABLE room (
Room_ID INT PRIMARY KEY AUTO_INCREMENT,
Room_Number VARCHAR(10) NOT NULL UNIQUE,
Room_Category ENUM('General Ward','Private Room','ICU') NOT NULL,
Room_Charge DECIMAL(10,2) NOT NULL CHECK (Room_Charge >= 0),
Availability ENUM('Available','Occupied') NOT NULL
);

desc room;

INSERT INTO room (Room_Number,Room_Category,Room_Charge,Availability) VALUES 
('GW-101', 'General Ward', 5000.00, 'Available'),
('GW-102', 'General Ward', 5000.00, 'Occupied'),
('GW-103', 'General Ward', 5000.00, 'Available'),
('GW-104', 'General Ward', 5000.00, 'Available'),
('PR-201', 'Private Room', 10000.00, 'Occupied'),
('PR-202', 'Private Room', 10000.00, 'Available'),
('PR-203', 'Private Room', 10000.00, 'Available'),
('ICU-301', 'ICU', 25000.00, 'Occupied'),
('ICU-302', 'ICU', 25000.00, 'Available'),
('ICU-303', 'ICU', 25000.00, 'Available');

SELECT * FROM room;


CREATE TABLE billing (
Bill_ID INT PRIMARY KEY AUTO_INCREMENT,
Patient_ID INT NOT NULL,
Bill_Date DATE NOT NULL,
Total_Amount DECIMAL(10,2) NOT NULL CHECK (Total_Amount >= 0),
Payment_Status ENUM('Paid','Unpaid') NOT NULL,
Payment_Method ENUM('Cash','Card','Online') NOT NULL,
					  
CONSTRAINT FK_Billing_Patient FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID)
);

Drop TABLE billing;



INSERT INTO billing
(Patient_ID, Bill_Date, Total_Amount, Payment_Status, Payment_Method)
VALUES
(1, '2025-01-22', 25000.00, 'Paid', 'Cash'),
(2, '2025-02-15', 18500.00, 'Paid', 'Card'),
(3, '2025-03-10', 32000.00, 'Unpaid', 'Online'),
(4, '2025-04-05', 15000.00, 'Paid', 'Cash'),
(5, '2025-05-18', 45000.00, 'Paid', 'Online'),
(6, '2025-06-12', 27500.00, 'Unpaid', 'Card'),
(7, '2025-07-20', 12500.00, 'Paid', 'Cash'),
(8, '2025-08-14', 68000.00, 'Paid', 'Card'),
(9, '2025-08-20', 52000.00, 'Unpaid', 'Online'),
(10, '2025-08-25', 35000.00, 'Paid', 'Cash');


desc billing;

CREATE TABLE appointment (
Appointment_ID INT PRIMARY KEY AUTO_INCREMENT,
Patient_ID INT NOT NULL,
Doctor_ID INT NOT NULL,
Appointment_Date DATE NOT NULL,
Appointment_Time TIME NOT NULL,
Appointment_Status ENUM('Scheduled','Completed','Cancelled') NOT NULL,
Consultation_Room VARCHAR(20) NOT NULL,
						  
CONSTRAINT FK_Appointment_Patient FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID),
						  
CONSTRAINT FK_Appointment_Doctor FOREIGN KEY (Doctor_ID) REFERENCES doctor(Doctor_ID),
						  
CONSTRAINT UQ_Doctor_Appointment UNIQUE (Doctor_ID, Appointment_Date, Appointment_Time)
);


desc appointment;

INSERT INTO appointment
(Patient_ID, Doctor_ID, Appointment_Date, Appointment_Time, Appointment_Status, Consultation_Room)
VALUES
(1, 1, '2026-08-26', '09:00:00', 'Scheduled', 'CR-101'),
(2, 2, '2026-08-26', '09:30:00', 'Scheduled', 'CR-102'),
(3, 3, '2026-08-26', '10:00:00', 'Completed', 'CR-103'),
(4, 4, '2026-08-26', '10:30:00', 'Scheduled', 'CR-104'),
(5, 5, '2026-08-27', '09:00:00', 'Cancelled', 'CR-105'),
(6, 6, '2026-08-27', '09:30:00', 'Scheduled', 'CR-106'),
(7, 7, '2026-08-27', '10:00:00', 'Completed', 'CR-107'),
(8, 8, '2026-08-28', '11:00:00', 'Scheduled', 'CR-108'),
(9, 9, '2026-08-28', '11:30:00', 'Scheduled', 'CR-109'),
(10, 10, '2026-08-29', '14:00:00', 'Scheduled', 'CR-110');

CREATE TABLE doctor (
Doctor_ID INT PRIMARY KEY AUTO_INCREMENT,
Department_ID INT NOT NULL,
Doctor_Name VARCHAR(100) NOT NULL,
Specialization VARCHAR(100) NOT NULL,
Qualification VARCHAR(100),
Contact_Number VARCHAR(15) NOT NULL,
Consultation_Fee DECIMAL(10,2) NOT NULL ,
					 
CONSTRAINT  FK_Doctor_Department FOREIGN KEY (Department_ID) REFERENCES department(Department_ID)
);

ALTER TABLE department
ADD CONSTRAINT FK_Department_HeadDoctor
FOREIGN KEY (HeadDoctor_ID)
REFERENCES doctor(Doctor_ID);


ALTER TABLE appointment ADD FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id);

INSERT INTO doctor
(Department_ID, Doctor_Name, Specialization, Qualification, Contact_Number, Consultation_Fee)
VALUES
(1, 'Dr. Nimal Perera', 'Cardiology', 'MBBS, MD Cardiology', '0712345678', 3500.00),
(2, 'Dr. Kasun Silva', 'Neurology', 'MBBS, MD Neurology', '0723456789', 4000.00),
(3, 'Dr. Amali Fernando', 'Pediatrics', 'MBBS, MD Pediatrics', '0734567890', 3000.00),
(4, 'Dr. Saman Jayawardena', 'Orthopedics', 'MBBS, MS Orthopedics', '0745678901', 3500.00),
(5, 'Dr. Dilani Perera', 'Dermatology', 'MBBS, MD Dermatology', '0756789012', 3000.00),
(1, 'Dr. Ruwan Bandara', 'General Medicine', 'MBBS, MD Medicine', '0767890123', 2500.00),
(6, 'Dr. Tharindu Kumara', 'ENT', 'MBBS, MS ENT', '0778901234', 3000.00),
(7, 'Dr. Ishara Wijesinghe', 'Gynecology', 'MBBS, MD Gynecology', '0789012345', 4000.00),
(8, 'Dr. Chamara Gunasekara', 'Psychiatry', 'MBBS, MD Psychiatry', '0790123456', 3500.00),
(9, 'Dr. Sanduni Madushani', 'Ophthalmology', 'MBBS, MS Ophthalmology', '0701234567', 3000.00);


CREATE TABLE department (
Department_ID INT PRIMARY KEY AUTO_INCREMENT,
Department_Name VARCHAR(100) NOT NULL UNIQUE,
Location VARCHAR(100) NOT NULL,
HeadDoctor_ID INT NULL
);

ALTER TABLE doctor ADD FOREIGN KEY(department_id) REFERENCES department(department_id);

desc doctor;

ALTER TABLE department
ADD CONSTRAINT fk_department_headdoctor
FOREIGN KEY (HeadDoctor_ID)
REFERENCES doctor(doctor_id);

INSERT INTO department
(Department_Name, Location, HeadDoctor_ID)
VALUES
('Cardiology', 'Main Building - 1st Floor', 1),
('Neurology', 'Main Building - 2nd Floor', 2),
('Pediatrics', 'Children Building - 1st Floor', 3),
('Orthopedics', 'Main Building - 3rd Floor', 4),
('Dermatology', 'Main Building - 2nd Floor', 5),
('General Medicine', 'Main Building - 1st Floor', 6),
('ENT', 'Main Building - 3rd Floor', 7),
('Gynecology', 'Women Building - 1st Floor', 8),
('Psychiatry', 'Main Building - 4th Floor', 9),
('Ophthalmology', 'Main Building - 2nd Floor', 10);

CREATE TABLE treatment (
Treatment_ID INT NOT NULL AUTO_INCREMENT,
Appointment_ID INT NOT NULL,
Diagnosis VARCHAR(255) NOT NULL,
Prescription_Details TEXT,
Treatment_Notes TEXT,
Treatment_Date DATE NOT NULL,

PRIMARY KEY (Treatment_ID),
CONSTRAINT FK_Treatment_Appointment FOREIGN KEY (Appointment_ID) REFERENCES appointment(Appointment_ID)
);


CREATE TABLE laboratory (
Lab_Test_ID INT PRIMARY KEY AUTO_INCREMENT,
Patient_ID INT NOT NULL,
Doctor_ID INT NOT NULL,
Test_Name VARCHAR(100) NOT NULL,
Test_Date DATE NOT NULL,
Test_Result TEXT,
Technician_Name VARCHAR(100) NOT NULL,
Test_Status ENUM('Pending','Completed') NOT NULL,
						 
CONSTRAINT FK_Laboratory_Patient FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID),
						 
CONSTRAINT FK_Laboratory_Doctor FOREIGN KEY (Doctor_ID) REFERENCES doctor(Doctor_ID)
);

INSERT INTO laboratory
(Patient_ID, Doctor_ID, Test_Name, Test_Date, Test_Result, Technician_Name, Test_Status)
VALUES
(1, 1, 'Complete Blood Count', '2025-01-20',
 'Hemoglobin and blood cell counts within normal range.',
 'Nuwan Perera', 'Completed'),

(2, 2, 'Blood Sugar Test', '2025-02-12',
 'Fasting blood glucose: 108 mg/dL.',
 'Kasun Fernando', 'Completed'),

(3, 3, 'Urine Test', '2025-03-08',
 'No significant abnormality detected.',
 'Amal Silva', 'Completed'),

(4, 4, 'X-Ray Right Arm', '2025-04-03',
 'Fracture identified in the right arm.',
 'Dinesh Kumar', 'Completed'),

(5, 5, 'Allergy Test', '2025-05-15',
 'Mild allergic reaction detected.',
 'Tharindu Jayasuriya', 'Completed'),

(6, 6, 'HbA1c Test', '2025-06-10',
 'HbA1c: 6.8%.',
 'Saman Wijesinghe', 'Completed'),

(7, 7, 'Sinus X-Ray', '2025-07-05',
 NULL,
 'Ruwan Bandara', 'Pending'),

(8, 8, 'Liver Function Test', '2025-07-18',
 'Liver function parameters within acceptable range.',
 'Chamara Silva', 'Completed'),

(9, 9, 'Thyroid Function Test', '2025-08-10',
 NULL,
 'Ishara Perera', 'Pending'),

(10, 10, 'Eye Examination', '2025-08-20',
 'Mild eye infection detected.',
 'Sanduni Fernando', 'Completed');

CREATE TABLE user (
id int PRIMARY KEY AUTO_INCREMENT, 
userName VARCHAR(122) NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('admin','user','staff','doctor')
);
