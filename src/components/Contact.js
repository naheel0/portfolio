import React, { useState } from "react";
import "./Contact.css";
import StarsBackground from "./StarsBackground";
import emailjs from "emailjs-com";

// ✅ Initialize EmailJS with your Public Key
emailjs.init("VLxM2t4JmL7HsMc4F"); // Replace with your real public key

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

    // ✅ Match template variables: from_name, reply_to, message
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
    <div className="main-bg position-relative">
      <StarsBackground />
      <div style={{ height: "100px" }}></div>
      <div className="contact container border mt-5 bg-light p-4 rounded position-relative">
        <h2 className="text-center mb-4">CONTACT ME</h2>
        <div className="row">
          <div className="col-md-6 p-3">
            <h4>Get in Touch</h4>
            <p>
              If you have any questions or would like to collaborate, feel free
              to reach out!
            </p>
          </div>
          <div className="col-md-6">
            <form onSubmit={sendEmail}>
              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
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
