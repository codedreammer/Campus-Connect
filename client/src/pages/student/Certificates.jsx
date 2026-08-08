import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { certificatesAPI, getErrorMessage } from "../../services/api.js";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      setLoading(true);
      setError("");
      const res = await certificatesAPI.myCertificates();
      const list = res.data?.data || res.data || [];
      setCertificates(list);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load certificates."));
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(cert) {
    const url = cert.certificate?.url || "#";
    if (url && url !== "#") {
      window.open(url, "_blank");
    } else {
      alert(`Certificate ID: ${cert.certificateId}\nVerification Code: ${cert.verificationCode}`);
    }
  }

  return (
    <DashboardLayout
      role="student"
      title="Certificates"
      subtitle="Download certificates issued after attended events."
    >
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Certificates appear here once a coordinator issues one for an event you attended."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => {
            const eventTitle = cert.event?.title || cert.eventTitle || "Event";
            const clubName = typeof cert.event?.club === "object" ? cert.event?.club?.name : cert.club || "Campus Club";
            const issuedOn = cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : cert.issuedOn || "Recently";

            return (
              <div key={cert._id || cert.id || cert.certificateId} className="card flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold text-ink-700">{eventTitle}</h3>
                  <p className="mt-1 text-xs text-slate">{clubName} · issued {issuedOn}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate">ID: {cert.certificateId}</p>
                </div>
                <button
                  className="btn-secondary text-xs"
                  onClick={() => handleDownload(cert)}
                >
                  View Certificate
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
