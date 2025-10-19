import React from "react";
import "./Projects.css";
import StarsBackground from "./StarsBackground";

function Projects() {
  return (
    <div className="main-bg">
      <StarsBackground />
      <div className="prj-heading">
        <h3>My Recent <span>Works</span> </h3>
        <p>Here are some of my recent projects:</p>
      </div>
      <div className="prj-main-pg">
        <div className="my-prj-div"></div>
        <div className="my-prj-div"></div>
        <div className="my-prj-div"></div>
      </div>
    </div>
  );
}

export default Projects;
