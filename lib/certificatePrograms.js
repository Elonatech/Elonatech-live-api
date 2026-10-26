// Every programme a certificate can be issued for. This is the one place that
// knows how a programme is named, coded and coloured; adding a programme means
// adding an entry here (and mirroring its label in the frontend,
// src/utils/certificate.js) and uploading its seal/signature if it has its own.
//
//   key          stored on the certificate and used in URLs (letters only)
//   label        what is printed as the programme name
//   header       the line under "ELONATECH NIGERIA LIMITED"
//   prefix       start of the certificate code, e.g. ETMPDP-7K4P9XQ2-C3
//   fileName     start of the downloaded PDF's name
//   seal         the two lines inside the drawn seal
//   theme        accent = the border, brand = the programme name and flourishes
//   description  (CompTIA) what the course covers, printed on the certificate

const ETMPDP_HEADER = "Executive Technology Mentorship & Professional Development Program";
const COMPTIA_HEADER = "CompTIA Training Program";

const PROGRAM_INFO = {
  Core: {
    label: "ETMPDP Core",
    header: ETMPDP_HEADER,
    prefix: "ETMPDP",
    fileName: "ETMPDP-Core",
    seal: ["ETMPDP", "CORE"],
    theme: { accent: "#c23a34", brand: "#ce1a18" },
  },
  Ignite: {
    label: "ETMPDP Ignite",
    header: ETMPDP_HEADER,
    prefix: "ETMPDP",
    fileName: "ETMPDP-Ignite",
    seal: ["ETMPDP", "IGNITE"],
    theme: { accent: "#34548c", brand: "#33548f" },
  },
  NetworkPlus: {
    label: "CompTIA Network+",
    header: COMPTIA_HEADER,
    prefix: "COMPTIA",
    fileName: "CompTIA-Network-Plus",
    seal: ["COMPTIA", "NETWORK+"],
    theme: { accent: "#0f766e", brand: "#0f766e" },
    description: "Network engineering, infrastructure configuration, connectivity, security, and troubleshooting.",
  },
  APlus: {
    label: "CompTIA A+",
    header: COMPTIA_HEADER,
    prefix: "COMPTIA",
    fileName: "CompTIA-A-Plus",
    seal: ["COMPTIA", "A+"],
    theme: { accent: "#b45309", brand: "#b45309" },
    description: "Computer Engineering, hardware, operating systems, maintenance, and introductory networking.",
  },
};

const PROGRAMS = Object.keys(PROGRAM_INFO);
// Every code prefix in use (several programmes can share one)
const PREFIXES = [...new Set(Object.values(PROGRAM_INFO).map((p) => p.prefix))];

const programInfo = (program) => PROGRAM_INFO[program] || PROGRAM_INFO.Core;

module.exports = { PROGRAM_INFO, PROGRAMS, PREFIXES, programInfo };
