import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { myCertificates } from "../../data/mockData.js";

export default function Certificates() {
  return (
    <DashboardLayout
      role="student"
      title="Certificates"
      subtitle="Download certificates issued after attended events."
    >
      {myCertificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Certificates appear here once a coordinator issues one for an event you attended."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {myCertificates.map((cert) => (
            <div key={cert.id} className="card flex items-center justify-between p-5">
              <div>
                <h3 className="font-semibold text-ink-700">{cert.eventTitle}</h3>
                <p className="mt-1 text-xs text-slate">{cert.club} · issued {cert.issuedOn}</p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => alert("Wire this up to certificatesAPI once files are stored (Cloudinary).")}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
