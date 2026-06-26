'use client';

import { motion } from "framer-motion";
import StarsBackground from "./StarsBackground";
import Image from "next/image";
import { staggerContainer, titleVariants, fadeInUp, itemVariants } from "@/lib/variants";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  demoUrl: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Gamehub",
    description: "A gaming e-commerce website built with React.js and Tailwind CSS.",
    image: "/images/gamehub.png",
    githubUrl: "https://github.com/naheel0/gamehub",
    demoUrl: "https://gamehub-alpha-rose.vercel.app",
    technologies: ["React.js", "Tailwind CSS", "JavaScript"],
  },
  {
    id: 2,
    title: "justDial",
    description: "A clone of JustDial website built with HTML, CSS, and JavaScript.",
    image: "/images/just.jpg",
    githubUrl: "https://github.com/naheel0/justdial-clone",
    demoUrl: "https://naheel0.github.io/justdial-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: 3,
    title: "weather App",
    description: "A weather application that provides current weather information using API.",
    image: "/images/weather-app.png",
    githubUrl: "https://github.com/naheel0/react-weather-app",
    demoUrl: "https://naheel0.github.io/react-weather-app/",
    technologies: ["React.js", "API", "Tailwind CSS", "JavaScript"],
  },
  {
    id: 4,
    title: "W3 School Navbar",
    description: "A responsive navigation bar built with HTML, CSS, and JavaScript.",
    image: "/images/nav-bar.jpg",
    githubUrl: "https://github.com/naheel0/w3school-nav-bar",
    demoUrl: "https://naheel0.github.io/w3school-nav-bar/",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: 5,
    title: "Facebook Clone",
    description: "A clone of Facebook homepage built with HTML, CSS, and JavaScript.",
    image: "/images/fb.png",
    githubUrl: "https://github.com/naheel0/facebook-login-clone",
    demoUrl: "https://naheel0.github.io/facebook-login-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
  hover: {
    y: -10,
    scale: 1.05,
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 },
};

function ProjectsContent() {
  return (
    <div className="main-bg-prj" id="projects">
      <StarsBackground />

      <motion.div
        className="prj-heading"
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>
          My Recent <span style={{ color: "blueviolet" }}>Works</span>
        </h2>
        <motion.p variants={fadeInUp(0.3)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          Here are some of my recent projects:
        </motion.p>
      </motion.div>

      <motion.div
        className="prj-main-pg"
        variants={staggerContainer(0.3, 0.2)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="my-prj-div"
            variants={cardVariants}
            whileHover="hover"
          >
            <Image
              src={project.image}
              alt={`${project.title} Screenshot`}
              className="project-image"
              width={400}
              height={200}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="technologies">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-buttons">
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="github-btn"
                aria-label={`View ${project.title} on GitHub`}
              >
                GitHub
              </motion.a>
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="demo-btn"
                aria-label={`View live demo of ${project.title}`}
              >
                Demo
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default ProjectsContent;
