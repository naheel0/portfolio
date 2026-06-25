'use client';

import { useState, useCallback } from "react";
import StarsBackground from "./StarsBackground";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 10 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 12 },
  },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15, delay: 0.3 },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 },
  submitting: {
    scale: [1, 1.05, 1] as number[],
    transition: { repeat: Infinity, duration: 1 },
  },
};

const inputFields = [
  { id: "name", label: "Name", type: "text", placeholder: "Your Name", delay: 0.4 },
  { id: "email", label: "Email", type: "email", placeholder: "Your Email", delay: 0.5 },
  { id: "message", label: "Message", type: "textarea", placeholder: "Your Message", delay: 0.6 },
];

function ContactContent() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const sendEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const module = await import("emailjs-com");
        module.init("VLxM2t4JmL7HsMc4F");
        await module.send("service_6kxz2ig", "template_qd8leoi", {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        });
        setTimeout(() => {
          setIsSubmitting(false);
          alert("Your message has been sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        }, 500);
      } catch {
        setIsSubmitting(false);
        alert("Failed to send message. Please try again.");
      }
    },
    [formData]
  );

  return (
    <div className="main-bg-contact position-relative" id="contact">
      <StarsBackground />
      <div style={{ height: "100px" }}></div>

      <motion.div
        className="container mt-5 position-relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 className="text-center mb-4 contact-title" variants={titleVariants}>
          CONTACT ME
        </motion.h2>

        <div className="row">
          <motion.div className="col-md-6 p-3 contact-info" variants={itemVariants}>
            <motion.h4
              className="contact-subtitle"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Get in Touch
            </motion.h4>
            <motion.p
              className="contact-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              If you have any questions or would like to collaborate, feel free to reach out!
            </motion.p>

            <motion.div
              className="contact-details"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.div className="contact-item" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <span className="contact-label">📧 Email: </span>
                <span className="contact-value">naheelmuhammedpk@gmail.com</span>
              </motion.div>
              <motion.div className="contact-item" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}>
                <span className="contact-label">📍 Location: </span>
                <span className="contact-value">kerala, India</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="col-md-6" variants={formVariants}>
            <form onSubmit={sendEmail} noValidate>
              {inputFields.map((field) => (
                <motion.div
                  key={field.id}
                  className="form-group mb-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: field.delay }}
                >
                  <label htmlFor={field.id} className="form-label">{field.label}</label>
                  {field.type === "textarea" ? (
                    <motion.textarea
                      className="form-control transparent-input"
                      id={field.id}
                      name={field.id}
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  ) : (
                    <motion.input
                      type={field.type}
                      className="form-control transparent-input"
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof typeof formData] as string}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                className="btn transparent-btn w-100"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={isSubmitting ? "submitting" : "initial"}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactContent;
