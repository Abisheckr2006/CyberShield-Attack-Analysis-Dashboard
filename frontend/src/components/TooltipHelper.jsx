import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

const TOOLTIP_TEXTS = {
  port: "Open Port: A network socket accepting connections. An open port indicates a reachable service, not an automatic vulnerability.",
  service: "Service: The specific server application (e.g. OpenSSH, nginx, BIND) listening on the port.",
  exposure: "Exposure: The network boundary where the service is reachable (Public, Internal, Management, Unknown).",
  risk: "Risk Level: Calculated exposure severity based on administrative impact, accessibility, and service function.",
  finding: "Security Finding: An identified security weakness or configuration risk requiring mitigation.",
  vulnerability: "Vulnerability: A confirmed software flaw or CVE. Exposure alone is not a vulnerability without configuration evidence.",
  evidence: "Scan Evidence: Concrete empirical data captured during assessment (handshake, version string, probe response)."
};

export default function TooltipHelper({ term, text }) {
  const [visible, setVisible] = useState(false);
  const content = text || TOOLTIP_TEXTS[term.toLowerCase()] || "Defensive network security concept.";

  return (
    <div className="relative inline-flex items-center ml-1 z-20">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        className="text-slate-400 hover:text-cyan-400 transition-colors p-0.5 rounded-full focus:outline-none"
        title="Click for explanation"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-cyan-500/40 text-slate-200 text-xs rounded-lg p-2.5 shadow-xl backdrop-blur-md pointer-events-none z-50">
          <div className="font-semibold text-cyan-400 mb-1 capitalize">{term} Guidance</div>
          <p className="leading-relaxed text-slate-300">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
