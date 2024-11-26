import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());



const API_BASE_URL = "https://healthcare-chatbot-442806-default-rtdb.firebaseio.com";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState(""); // Separate message for booking

  useEffect(() => {
    const fetchAppointmentsAndDoctors = async () => {
      try {
        const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`);
        const doctorsResponse = await axios.get(`${API_BASE_URL}/doctors`);
        setAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error loading appointments and doctors.");
      }
    };
    fetchAppointmentsAndDoctors();
  }, []);


  const bookAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, { id: appointmentId });
      setBookingMessage(response.data.message);
      const updatedAppointments = await axios.get(`${API_BASE_URL}/appointments`);
      setAppointments(updatedAppointments.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingMessage("Error booking appointment. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Healthcare Chatbot</h1>
      <h2>Available Appointments</h2>
      {message && <p className="error-message">{message}</p>}
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>Loading appointments...</p>
        ) : (
          appointments.map((appointment) => {
            const doctor = doctors[appointment.doctor_id]; // Get doctor details by ID
            return (
              <div key={appointment.id} className="appointment-card">
                <h3>{doctor ? doctor.name : "Unknown Doctor"}</h3>
                <p>{doctor ? doctor.specialization : "Specialization not available"}</p>
                <p><strong>Time:</strong> {new Date(appointment.time).toLocaleString()}</p>
                <p><strong>Status:</strong> {appointment.available ? "Available" : "Booked"}</p>
                {appointment.available && (
                  <button onClick={() => bookAppointment(appointment.id)}>Book Appointment</button>
                )}
                {!appointment.available && (
                  <p>This slot is already booked.</p>
                )}
              </div>
            );
          })
        )}
      </div>
      {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
    </div>
  );
}

export default App;
