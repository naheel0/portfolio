import React, { useState } from "react";
import "./Contact.css";
import StarsBackground from "./StarsBackground";
import emailjs from "emailjs-com";

emailjs.init("VLxM2t4JmL7HsMc4F");

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const serviceID = "service_6kxz2ig";
    const templateID = "template_qd8leoi";

    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      message: formData.message,
    };

    emailjs
      .send(serviceID, templateID, templateParams)
      .then((res) => {
        console.log("✅ Email sent:", res);
        alert("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.error("❌ Email failed:", err);
        alert("Failed to send message. Please try again.");
      });
  };

  return (
    <div className="main-bg-contact position-relative">
      <StarsBackground />
      <div style={{ height: "100px" }}></div>
      
      {/* Remove the container background completely */}
      <div className="container mt-5 position-relative">
        <h2 className="text-center mb-4 contact-title">CONTACT ME</h2>
        <div className="row">
          <div className="col-md-6 p-3 contact-info">
            <h4 className="contact-subtitle">Get in Touch</h4>
            <p className="contact-text">
              If you have any questions or would like to collaborate, feel free
              to reach out!
            </p>
          </div>
          <div className="col-md-6">
            <form onSubmit={sendEmail}>
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control transparent-input"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control transparent-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  className="form-control transparent-input"
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn transparent-btn w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;