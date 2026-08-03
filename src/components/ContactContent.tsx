'use client';

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin } from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me";

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = "idle" | "success" | "error";

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
  const [status, setStatus] = useState<FormStatus>("idle");
  const [contactCards, setContactCards] = useState([
    { icon: FaEnvelope, label: "Email", value: "hello@naheel.me", href: "mailto:hello@naheel.me", color: "#22d3ee" },
    { icon: FaPhone, label: "Phone", value: "+91 7306912910", href: "tel:+917306912910", color: "#34d399" },
    { icon: FaGithub, label: "GitHub", value: "naheel0", href: "https://github.com/naheel0", color: "#c4b5fd" },
    { icon: FaLinkedin, label: "LinkedIn", value: "Naheel Muhammed", href: "https://www.linkedin.com/in/naheel-muhammed", color: "#60a5fa" },
  ]);

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio/settings`)
      .then(r => r.json())
      .then(s => {
        setContactCards([
          { icon: FaEnvelope, label: "Email", value: s.email || "hello@naheel.me", href: `mailto:${s.email || "hello@naheel.me"}`, color: "#22d3ee" },
          { icon: FaPhone, label: "Phone", value: s.phone || "+91 7306912910", href: `tel:${(s.phone || "+917306912910").replace(/\s/g, "")}`, color: "#34d399" },
          { icon: FaGithub, label: "GitHub", value: (s.github || "https://github.com/naheel0").split("/").pop() || "naheel0", href: s.github || "https://github.com/naheel0", color: "#c4b5fd" },
          { icon: FaLinkedin, label: "LinkedIn", value: s.name || "Naheel Muhammed", href: s.linkedin || "https://www.linkedin.com/in/naheel-muhammed", color: "#60a5fa" },
        ]);
      })
      .catch(() => {});
  }, []);

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
      setStatus("idle");
      try {
        const emailjs = await import("@emailjs/browser");
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
          },
          { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
        );
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } catch (err) {
        console.error("EmailJS send failed:", err);
        setStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <div className="main-bg-contact" id="contact">
      <div style={{ height: "100px" }}></div>

      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 className="text-center contact-title" variants={titleVariants}>
          CONTACT <span>ME</span>
        </motion.h2>

        <div className="contact-row">
          <div className="contact-unified">
            <motion.div className="contact-col contact-info" variants={itemVariants}>
              <motion.h3
                className="contact-subtitle"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Get in Touch
              </motion.h3>
              <motion.p
                className="contact-text"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Open to full-time opportunities in <span className="text-accent">Full Stack Development (.NET + React)</span>. Let&apos;s build something great together.
              </motion.p>

              <div className="contact-cards-grid">
                {contactCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.a
                      key={card.label}
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="contact-card-v2"
                      style={{ "--card-accent": card.color } as React.CSSProperties}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 120, damping: 14 }}
                      aria-label={`${card.label}: ${card.value}`}
                    >
                      <span className="contact-card-v2-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="contact-card-v2-label">{card.label}</span>
                      <span className="contact-card-v2-value">{card.value}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            <span className="contact-divider" aria-hidden="true" />

            <motion.div className="contact-col contact-form-col" variants={formVariants}>
              <div className="contact-form-card">
                <form onSubmit={sendEmail}>
                  {inputFields.map((field) => (
                    <motion.div
                      key={field.id}
                      className="form-group"
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
                    className="btn transparent-btn contact-full-width"
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

                  <AnimatePresence>
                    {status !== "idle" && (
                      <motion.p
                        key={status}
                        role="status"
                        aria-live="polite"
                        className={`form-status form-status-${status}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                      >
                        {status === "success"
                          ? "✓ Your message has been sent successfully! I'll get back to you soon."
                          : "✗ Failed to send message. Please try again or email me directly at hello@naheel.me."}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ContactContent;
