import { getProjects } from "@/lib/data";
import type { PortfolioProject } from "@/lib/data";
import ProjectsStory from "./ProjectsStory";

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 1,
    title: "Gamehub",
    description: "Full-Stack E-Commerce Website for gaming products. Implemented secure JWT authentication (access & refresh tokens), middleware-based session validation, and role-based access control. Developed scalable backend services with ASP.NET Core following Clean Architecture principles and RESTful API design. Integrated Razorpay payment gateway with dynamic cart functionality and order processing workflows.",
    image: "/images/gamehub.png",
    githubUrl: "https://github.com/naheel0/GameHub-fullstack",
    demoUrl: "https://gamehub.naheel.me",
    technologies: ["React.js", "ASP.NET Core", "C#", "Entity Framework", "SQL Server", "JWT", "Razorpay"],
    category: "Full Stack",
    featured: true,
  },
  {
    id: 2,
    title: "justDial",
    description: "A clone of JustDial website built with HTML, CSS, and JavaScript.",
    image: "/images/just.jpg",
    githubUrl: "https://github.com/naheel0/justdial-clone",
    demoUrl: "https://naheel0.github.io/justdial-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 3,
    title: "Weather App",
    description: "A weather application that provides current weather information using a live weather API with dynamic UI updates based on weather conditions.",
    image: "/images/weather-app.png",
    githubUrl: "https://github.com/naheel0/react-weather-app",
    demoUrl: "https://naheel0.github.io/react-weather-app/",
    technologies: ["React.js", "API", "Tailwind CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 4,
    title: "W3 School Navbar",
    description: "A responsive navigation bar built with HTML, CSS, and JavaScript.",
    image: "/images/nav-bar.jpg",
    githubUrl: "https://github.com/naheel0/w3school-nav-bar",
    demoUrl: "https://naheel0.github.io/w3school-nav-bar/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
  {
    id: 5,
    title: "Facebook Clone",
    description: "A pixel-perfect clone of the Facebook homepage built with HTML, CSS, and JavaScript focusing on UI fidelity and responsive design.",
    image: "/images/fb.png",
    githubUrl: "https://github.com/naheel0/facebook-login-clone",
    demoUrl: "https://naheel0.github.io/facebook-login-clone/",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Frontend",
  },
];

export default async function ProjectsContent() {
  const adminProjects = await getProjects();
  const projects = adminProjects.length > 0 ? adminProjects : FALLBACK_PROJECTS;

  return <ProjectsStory projects={projects} />;
}