import React from "react";
import "./styles/AboutUs.css";

const developers = [
  {
    id: 1,
    name: "CHINNAKOTALA MALLIKARJUNA",
    designation: "Frontend Developer",
    bio: "Loves creating sleek and user-friendly web designs.",
    image: "/photos/Malli.jpg",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 2,
    name: "BOVILLA RAVI SHANKAR REDDY",
    designation: "Backend Developer",
    bio: "Specializes in database management and API integration.",
    image: "/photos/Revi.jpg",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 3,
    name: "ROOPENDRA M",
    designation: "Full Stack Developer",
    bio: "Enjoys working on both frontend and backend challenges.",
    image: "/photos/RM.jpg",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    id: 4,
    name: "SHAIK MOHAMMAD ISHRATH",
    designation: "UI/UX Designer",
    bio: "Passionate about crafting intuitive user experiences.",
    image: "/photos/Ishrath.jpg",
    socialLinks: {
      linkedin: "#",
      github: "#",
    },
  },
];

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        {/* <h1>About Us</h1> */}
        <p>Meet the creative minds behind our application.</p>
      </div>
      <div className="developer-list">
        {developers.map((developer) => (
          <div className="developer-card" key={developer.id}>
            <img
              src={developer.image}
              alt={`${developer.name}`}
              className="developer-image"
            />
            <h3>{developer.name}</h3>
            <p className="designation">{developer.designation}</p>
            <p className="bio">{developer.bio}</p>
            <div className="social-links">
              <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
