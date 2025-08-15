import { parseUBL } from './parser_ubl.js';
import { parseCII } from './parser_cii.js';

console.log("✅ main.v1.js loaded");

function parseXML(xml) {
  const root = xml.documentElement.localName;
  console.log("📦 XML Root:", root);

  if (xml.getElementsByTagNameNS("*", "Invoice").length > 0) {
    console.log("📄 Detected UBL");
    parseUBL(xml);
  } else if (xml.getElementsByTagNameNS("*", "CrossIndustryInvoice").length > 0) {
    console.log("📄 Detected CII");
    parseCII(xml);
  } else {
    console.warn("❌ Unrecognized XML format:", root);
    alert("Unbekanntes Format: " + root);
  }
}

function handleFile(event) {
  console.log("📥 File selected");
  const file = event.target.files[0];
  if (!file) {
    console.log("❌ No file selected");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    console.log("📄 File read");
    const text = e.target.result;
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    parseXML(xml);
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌍 DOM loaded");

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");

  if (fileInput) {
    fileInput.addEventListener("change", handleFile);
    console.log("📂 File input listener attached");
  }

  if (dropzone) {
    ["dragenter", "dragover"].forEach(event =>
      dropzone.addEventListener(event, e => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      })
    );
    ["dragleave", "drop"].forEach(event =>
      dropzone.addEventListener(event, e => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
      })
    );
    dropzone.addEventListener("drop", e => {
      const file = e.dataTransfer.files[0];
      if (file) {
        console.log("📥 File dropped");
        handleFile({ target: { files: [file] } });
      }
    });
  }
});
