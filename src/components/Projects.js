import React from "react";
import "./Projects.css";
import StarsBackground from "./StarsBackground";
import just from "../image/just.jpg";
import fb from "../image/fb.png";
import nav from "../image/nav-bar.jpg";

function Projects() {
  const btn_fb_git = () => {
    window.open("https://github.com/naheel0/facebook-login-clone", "_blank");
  };
  const btn_nav_git = () => {
    window.open("https://github.com/naheel0/w3school-nav-bar", "_blank");
  };
  const btn_just_git = () => {
    window.open("https://github.com/naheel0/justdial-clone", "_blank");
  };
  const btn_just_demo = () => {
    window.open("https://naheel0.github.io/justdial-clone/", "_blank");
  };
  const btn_nav_demo = () => {
    window.open("https://naheel0.github.io/w3school-nav-bar/", "_blank");
  };      
  const btn_fb_demo = () => {
    window.open("https://naheel0.github.io/facebook-login-clone/", "_blank");
  };
  return (
    <div className="main-bg-prj">
      <StarsBackground />
      <div className="prj-heading">
        <h3>
          My Recent <span>Works</span>{" "}
        </h3>
        <p>Here are some of my recent projects:</p>
      </div>
      <div className="prj-main-pg">
        <div className="my-prj-div">
          <img
            src={just}
            alt="Project Screenshot"
            className="project-image"
          />
          <h3>justDial</h3>
          <p>
            A clone of JustDial website built with HTML, CSS, and JavaScript.

          </p>
          <button onClick={btn_just_git}>GitHub</button>
          <button onClick={btn_just_demo}>Demo</button>
        </div>
        <div className="my-prj-div">
          <img
            src={nav}
            alt="Project Screenshot"
            className="project-image"
          />
          <h3>W3 school Navbar</h3>
          <p>
            A responsive navigation bar built with HTML, CSS, and JavaScript.
          </p>
          <button onClick={btn_nav_git}>GitHub</button>
          <button onClick={btn_nav_demo}>Demo</button>
        </div>
        <div className="my-prj-div">
          <img
            src={fb}
            alt="Project Screenshot"
            className="project-image"
          />
          <h3>Facebook Clone</h3>
          <p>
            A clone of Facebook homepage built with HTML, CSS, and JavaScript.
          </p>
          <button onClick={btn_fb_git}>GitHub</button>
          <button onClick={btn_fb_demo}>Demo</button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
