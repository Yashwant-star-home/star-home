import { useState } from "react";
import { supabase } from "./Services/supabase";
import "./App.css";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const ADMIN_PASSWORD = "StarHome@123";

  function handleLogin(e) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchEnquiries();
    } else {
      alert("Wrong password!");
    }
  }

  async function fetchEnquiries() {
    setLoading(true);

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Enquiries load nahi hui.");
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  }

  async function deleteEnquiry(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) {
      return;
    }

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

  function isToday(dateString) {
    if (!dateString) return false;

    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  const todayEnquiries = enquiries.filter((enquiry) =>
    isToday(enquiry.created_at)
  ).length;

  function plotCount(size) {
    return enquiries.filter(
      (enquiry) => String(enquiry["plot-size"]).trim() === String(size)
    ).length;
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const text = search.toLowerCase();

    return (
      String(enquiry.name || "").toLowerCase().includes(text) ||
      String(enquiry.mobile || "").toLowerCase().includes(text) ||
      String(enquiry.email || "").toLowerCase().includes(text) ||
      String(enquiry["plot-size"] || "").toLowerCase().includes(text) ||
      String(enquiry.message || "").toLowerCase().includes(text)
    );
  });

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h1>Star Home</h1>
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Star Home - Enquiries</h1>
          <p>Customer enquiries received from website</p>
        </div>

        <div className="admin-header-buttons">
          <button
            className="refresh-button"
            onClick={fetchEnquiries}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

          <button
            className="logout-button"
            onClick={() => {
              setLoggedIn(false);
              setPassword("");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading Enquiries...</div>
      ) : (
        <>

          {/* STATISTICS */}
          <div className="admin-stats">

            <div className="stat-card">
              <span>Total Enquiries</span>
              <strong>{enquiries.length}</strong>
            </div>

            <div className="stat-card">
              <span>Today's Enquiries</span>
              <strong>{todayEnquiries}</strong>
            </div>

            <div className="stat-card">
              <span>50 Gaj Enquiries</span>
              <strong>{plotCount(50)}</strong>
            </div>

            <div className="stat-card">
              <span>100 Gaj Enquiries</span>
              <strong>{plotCount(100)}</strong>
            </div>

            <div className="stat-card">
              <span>150 Gaj Enquiries</span>
              <strong>{plotCount(150)}</strong>
            </div>

            <div className="stat-card">
              <span>200 Gaj Enquiries</span>
              <strong>{plotCount(200)}</strong>
            </div>

          </div>

          {/* SEARCH */}
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search by name, mobile, email, plot size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                Clear
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="enquiry-table-container">

            <table className="enquiry-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Plot Size</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredEnquiries.length === 0 ? (

                  <tr>
                    <td colSpan="7">
                      {search
                        ? "No matching enquiries found."
                        : "No enquiries found."}
                    </td>
                  </tr>

                ) : (

                  filteredEnquiries.map((enquiry, index) => (

                    <tr
                      key={enquiry.id}
                      className={index < 3 ? "recent-enquiry" : ""}
                    >

                      {/* DATE */}
                      <td>
                        {enquiry.created_at
                          ? new Date(
                              enquiry.created_at
                            ).toLocaleString()
                          : "-"}

                        {index < 3 && (
                          <span className="new-badge">
                            NEW
                          </span>
                        )}
                      </td>

                      {/* NAME */}
                      <td>
                        {enquiry.name || "-"}
                      </td>

                      {/* MOBILE */}
                      <td>

                        {enquiry.mobile ? (
                          <div className="contact-buttons">

                            <a
                              className="call-button"
                              href={`tel:${enquiry.mobile}`}
                            >
                              📞 Call
                            </a>

                            <a
                              className="whatsapp-button"
                              href={`https://wa.me/91${String(
                                enquiry.mobile
                              ).replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              💬 WhatsApp
                            </a>

                          </div>
                        ) : (
                          "-"
                        )}

                      </td>

                      {/* EMAIL */}
                      <td>
                        {enquiry.email || "-"}
                      </td>

                      {/* PLOT SIZE */}
                      <td>
                        <strong>
                          {enquiry["plot-size"]
                            ? `${enquiry["plot-size"]} Gaj`
                            : "-"}
                        </strong>
                      </td>

                      {/* MESSAGE */}
                      <td>
                        {enquiry.message || "-"}
                      </td>

                      {/* DELETE */}
                      <td>
                        <button
                          className="delete-enquiry-button"
                          onClick={() =>
                            deleteEnquiry(enquiry.id)
                          }
                        >
                          🗑 Delete
                        </button>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* SEARCH RESULT COUNT */}
          {search && (
            <div className="search-result-count">
              Showing {filteredEnquiries.length} of{" "}
              {enquiries.length} enquiries
            </div>
          )}

        </>
      )}

    </div>
  );
}

export default Admin;