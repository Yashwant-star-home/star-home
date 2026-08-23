import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./Services/supabase";
import Admin from "./Admin";

function App() {
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setProject(data);
    }

    setLoading(false);
  }
  async function deleteEnquiry(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this enquiry?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("enquiries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Enquiry delete nahi hui. Please try again.");
    return;
  }

  setEnquiries((current) =>
    current.filter((enquiry) => enquiry.id !== id)
  );

  alert("Enquiry deleted successfully.");
}

  async function submitEnquiry(e) {
    e.preventDefault();

    if (!name || !mobile || !email || !plotSize) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("enquiries")
      .insert([
        {
          name,
          mobile,
          email,
          "plot-size": plotSize,
          message,
        },
      ]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("Enquiry submit nahi hui. Please try again.");
      return;
    }

    alert("Enquiry submitted successfully!");

    setName("");
    setMobile("");
    setEmail("");
    setPlotSize("");
    setMessage("");
    setShowEnquiry(false);
  }

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-logo">★</div>
        <h2>Star Home</h2>
        <p>Loading your dream destination...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Unable to load project</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="website">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <a href="#home" className="logo">
          <div className="logo-icon">★</div>
          <div>
            <strong>STAR HOME</strong>
            <span>REAL ESTATE</span>
          </div>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <button
            className="nav-enquire"
            onClick={() => setShowEnquiry(true)}
          >
            Enquire Now
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span> PREMIUM RESIDENTIAL PLOTS
          </div>

          <h1>
            Build Your
            <br />
            <span>Dream Home.</span>
          </h1>

          <p>
            Premium residential plots at promising locations,
            designed for a better lifestyle and a brighter future.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="primary-button">
              Explore Project <span>→</span>
            </a>

            <button
              className="secondary-button"
              onClick={() => setShowEnquiry(true)}
            >
              Enquire Now
            </button>
          </div>

          <div className="hero-features">
            <div>
              <strong>✓</strong>
              <span>Prime Location</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Clear Documentation</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Site Visit Available</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <div>↓</div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="intro-section">
        <div className="intro-card">
          <div className="intro-icon">⌂</div>

          <div>
            <span className="small-label">WELCOME TO STAR HOME</span>

            <h2>
              A Place Where
              <br />
              <span>Dreams Take Shape.</span>
            </h2>
          </div>

          <p>
            We bring you carefully selected residential plots
            where location, convenience and long-term value come together.
          </p>
        </div>
      </section>

      {/* ================= PROJECT ================= */}
      <section className="projects-section" id="projects">

        <div className="section-heading">
          <span className="section-label">OUR FEATURED PROJECT</span>

          <h2>{project?.Name || "Star Home Project"}</h2>

          <p>
            Discover a thoughtfully planned residential destination
            made for families who want more from their future home.
          </p>
        </div>

        <div className="project-card">

          {/* Project Visual */}
          <div className="project-visual">
            <div className="visual-overlay"></div>

            <div className="visual-content">
              <div className="location-pill">
                📍 {project?.location || "Prime Location"}
              </div>

              <h3>
                Your Future
                <br />
                Starts Here.
              </h3>

              <div className="visual-bottom">
                <span>Premium Residential Plots</span>
                <span>✦ Star Home</span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="project-info">

            <div className="status-row">
              <span className="available">
                <span className="status-dot"></span>
                {project?.status || "Available"}
              </span>

              <span className="project-location">
                📍 {project?.location || "Prime Location"}
              </span>
            </div>

            <h3>{project?.Name || "Star Home"}</h3>

            <p className="project-description">
              {project?.description ||
                "Premium residential plots with excellent connectivity and a peaceful environment. Choose the plot that fits your dream."}
            </p>

            <div className="divider"></div>

            <span className="plot-label">AVAILABLE PLOT SIZES</span>

            <div className="plot-sizes">

              <div className="plot-box">
                <strong>50</strong>
                <span>Gaj</span>
              </div>

              <div className="plot-box">
                <strong>100</strong>
                <span>Gaj</span>
              </div>

              <div className="plot-box">
                <strong>150</strong>
                <span>Gaj</span>
              </div>

              <div className="plot-box">
                <strong>200</strong>
                <span>Gaj</span>
              </div>

            </div>

            <button
              className="enquiry-button"
              onClick={() => setShowEnquiry(true)}
            >
              Enquire About This Project
              <span>→</span>
            </button>

          </div>
        </div>
      </section>

      {/* ================= WHY STAR HOME ================= */}
      <section className="why-section">

        <div className="section-heading center">
          <span className="section-label">WHY STAR HOME</span>

          <h2>
            More Than Just
            <br />
            <span>A Piece of Land.</span>
          </h2>

          <p>
            We believe buying a plot should be simple,
            transparent and stress-free.
          </p>
        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">📍</div>
            <h3>Prime Locations</h3>
            <p>
              Carefully selected locations with excellent
              connectivity and future growth potential.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">✓</div>
            <h3>Transparent Process</h3>
            <p>
              Clear communication and straightforward
              dealings from enquiry to purchase.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">⌂</div>
            <h3>Build Your Future</h3>
            <p>
              Choose a plot where you can create a home
              and a future for your family.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">★</div>
            <h3>Customer First</h3>
            <p>
              Your requirements matter. We are here to
              help you make the right decision.
            </p>
          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about-section" id="about">

        <div className="about-content">

          <div className="about-number">
            <span>01</span>
            <div></div>
          </div>

          <div>
            <span className="section-label">ABOUT STAR HOME</span>

            <h2>
              Creating Spaces
              <br />
              <span>Worth Coming Home To.</span>
            </h2>

            <p>
              Star Home Real Estate helps customers find quality
              residential plots at promising locations. Our focus
              is on genuine properties, transparent dealings and
              customer satisfaction.
            </p>

            <p>
              Whether you are planning your dream home or looking
              for a valuable piece of land for the future, we are
              here to guide you through the journey.
            </p>

            <a href="#contact" className="text-button">
              Talk To Us <span>→</span>
            </a>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section" id="contact">

        <div className="cta-content">

          <span className="section-label">READY TO TAKE THE NEXT STEP?</span>

          <h2>
            Your Dream Plot
            <br />
            <span>Could Be One Enquiry Away.</span>
          </h2>

          <p>
            Get details about available plots, pricing
            and site visits.
          </p>

          <button
            className="cta-button"
            onClick={() => setShowEnquiry(true)}
          >
            Start Your Enquiry <span>→</span>
          </button>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-top">

          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">★</div>

              <div>
                <strong>STAR HOME</strong>
                <span>REAL ESTATE</span>
              </div>
            </div>

            <p>
              Helping you find the right place
              for your next chapter.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <p>Interested in our plots?</p>

            <button onClick={() => setShowEnquiry(true)}>
              Enquire Now →
            </button>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Star Home Real Estate</span>
          <span>All Rights Reserved.</span>
        </div>

      </footer>

      {/* ================= ENQUIRY MODAL ================= */}
      {showEnquiry && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEnquiry(false);
            }
          }}
        >

          <div className="enquiry-modal">

            <button
              className="modal-close"
              onClick={() => setShowEnquiry(false)}
            >
              ×
            </button>

            <div className="modal-header">
              <span className="section-label">GET IN TOUCH</span>

              <h2>
                Enquire About
                <br />
                <span>{project?.Name || "Star Home"}</span>
              </h2>

              <p>
                Fill in your details and our team will
                get in touch with you.
              </p>
            </div>

            <form onSubmit={submitEnquiry}>

              <div className="form-row">

                <div className="form-group">
                  <label>Your Name *</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Email Address *</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Preferred Plot Size *</label>

                <select
                  value={plotSize}
                  onChange={(e) => setPlotSize(e.target.value)}
                >
                  <option value="" disabled>
                    Select plot size
                  </option>

                  <option value="50">50 Gaj</option>
                  <option value="100">100 Gaj</option>
                  <option value="150">150 Gaj</option>
                  <option value="200">200 Gaj</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>

                <textarea
                  placeholder="Tell us what you are looking for..."
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="submit-enquiry"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Enquiry →"}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;