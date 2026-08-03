'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin } from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me";

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = "idle" | "success" | "error";

const inputFields = [
  { id: "name", label: "Name", type: "text", placeholder: "Your Name" },
  { id: "email", label: "Email", type: "email", placeholder: "Your Email" },
  { id: "message", label: "Message", type: "textarea", placeholder: "Your Message" },
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

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoColRef = useRef<HTMLDivElement>(null);
  const formColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [containerRef.current, titleRef.current, infoColRef.current, formColRef.current].filter(Boolean);
    elements.forEach((el) => { if (el) observer.observe(el); });
    return () => { elements.forEach((el) => { if (el) observer.unobserve(el); }); };
  }, []);

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

      <div className="contact-container contact-scroll-reveal" ref={containerRef}>
        <h2 className="text-center contact-title contact-title-reveal" ref={titleRef}>
          CONTACT <span>ME</span>
        </h2>

        <div className="contact-row">
          <div className="contact-unified">
            <div className="contact-col contact-info contact-scroll-reveal" ref={infoColRef}>
              <h3 className="contact-subtitle">Get in Touch</h3>
              <p className="contact-text">
                Open to full-time opportunities in <span className="text-accent">Full Stack Development (.NET + React)</span>. Let&apos;s build something great together.
              </p>

              <div className="contact-cards-grid">
                {contactCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.label}
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="contact-card-v2"
                      style={{ "--card-accent": card.color } as React.CSSProperties}
                      aria-label={`${card.label}: ${card.value}`}
                    >
                      <span className="contact-card-v2-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="contact-card-v2-label">{card.label}</span>
                      <span className="contact-card-v2-value">{card.value}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <span className="contact-divider" aria-hidden="true" />

            <div className="contact-col contact-form-col contact-scroll-reveal" ref={formColRef}>
              <div className="contact-form-card">
                <form onSubmit={sendEmail}>
                  {inputFields.map((field) => (
                    <div key={field.id} className="form-group">
                      <label htmlFor={field.id} className="form-label">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="form-control transparent-input"
                          id={field.id}
                          name={field.id}
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                        />
                      ) : (
                        <input
                          type={field.type}
                          className="form-control transparent-input"
                          id={field.id}
                          name={field.id}
                          value={formData[field.id as keyof typeof formData] as string}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="btn transparent-btn contact-full-width"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  {status !== "idle" && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`form-status form-status-${status}`}
                    >
                      {status === "success"
                        ? "✓ Your message has been sent successfully! I'll get back to you soon."
                        : "✗ Failed to send message. Please try again or email me directly at hello@naheel.me."}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactContent;
