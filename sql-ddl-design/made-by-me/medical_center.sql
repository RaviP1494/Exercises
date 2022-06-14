--Design the schema for a medical center.

--  A medical center employs several doctors
--  A doctors can see many patients
--  A patient can be seen by many doctors
--  During a visit, a patient may be diagnosed to have one or more diseases.

-- 

DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center

CREATE TABLE doctors(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL
)

CREATE TABLE patients(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL
)

CREATE TABLE diseases(
    id SERIAL PRIMARY KEY,
    term VARCHAR(63)
)

CREATE TABLE diagnoses(
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors (id),
    patient_id INTEGER REFERENCES patients (id),
    disease_id INTEGER REFERENCES diseases (id)
)