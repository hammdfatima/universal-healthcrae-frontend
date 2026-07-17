import { jsPDF } from "jspdf"

import type { MedicalRecordsSummary } from "@/app/(dashboards)/patient/_lib/medical-records-summary"
import { getProfileDisplayName } from "@/app/(dashboards)/patient/_lib/settings"

const MARGIN = 16
const LINE_HEIGHT = 6
const PAGE_HEIGHT = 297
const LOGO_PATH = "/logo-half.png"
const LOGO_HEIGHT_MM = 16

type LogoImage = {
  dataUrl: string
  width: number
  height: number
}

async function loadLogoImage(src: string): Promise<LogoImage> {
  const response = await fetch(src)
  if (!response.ok) {
    throw new Error("Failed to load logo image.")
  }

  const blob = await response.blob()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read logo image."))
    reader.readAsDataURL(blob)
  })

  return await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({
        dataUrl,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }
    image.onerror = () => reject(new Error("Failed to decode logo image."))
    image.src = dataUrl
  })
}

function addPageIfNeeded(doc: jsPDF, y: number, needed = 12): number {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function writeSectionTitle(doc: jsPDF, title: string, y: number): number {
  y = addPageIfNeeded(doc, y, 14)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(22, 101, 52)
  doc.text(title, MARGIN, y)
  doc.setTextColor(0, 0, 0)
  return y + LINE_HEIGHT + 2
}

function writeLine(doc: jsPDF, text: string, y: number, indent = 0): number {
  y = addPageIfNeeded(doc, y)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const lines = doc.splitTextToSize(text, 210 - MARGIN * 2 - indent)
  for (const line of lines) {
    y = addPageIfNeeded(doc, y)
    doc.text(line, MARGIN + indent, y)
    y += LINE_HEIGHT
  }
  return y
}

export async function downloadMedicalRecordsPdf(
  summary: MedicalRecordsSummary
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const { profile } = summary
  const displayName = getProfileDisplayName(profile)
  let y = MARGIN

  let textX = MARGIN

  try {
    const logo = await loadLogoImage(LOGO_PATH)
    const logoWidth = (logo.width / logo.height) * LOGO_HEIGHT_MM
    doc.addImage(logo.dataUrl, "PNG", MARGIN, y, logoWidth, LOGO_HEIGHT_MM)
    textX = MARGIN + logoWidth + 4
  } catch {
    // Continue without logo if the image fails to load.
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Universal Health Charts", textX, y + 6)

  doc.setFontSize(14)
  doc.text("Medical Records Summary", textX, y + 13)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    textX,
    y + 19
  )
  doc.setTextColor(0, 0, 0)
  y += LOGO_HEIGHT_MM + 6

  y = writeSectionTitle(doc, "Profile", y)
  y = writeLine(doc, `Name: ${displayName}`, y)
  y = writeLine(doc, `Blood Group: ${profile.bloodGroup || "—"}`, y)
  y = writeLine(doc, `Gender: ${profile.gender || "—"}`, y)
  y = writeLine(doc, `Phone: ${profile.phone}`, y)
  y = writeLine(doc, `Email: ${profile.email}`, y)
  if (profile.address) y = writeLine(doc, `Address: ${profile.address}`, y)
  y += 4

  y = writeSectionTitle(doc, "Known Allergies", y)
  if (summary.allergies.length === 0) {
    y = writeLine(doc, "No allergies recorded.", y)
  } else {
    for (const allergy of summary.allergies) {
      const triggers =
        allergy.triggers.length > 0
          ? ` · Triggers: ${allergy.triggers.join(", ")}`
          : ""
      y = writeLine(
        doc,
        `• ${allergy.allergyType} (${allergy.nature}) — ${allergy.symptoms.join(", ")}${triggers}`,
        y
      )
    }
  }
  y += 4

  y = writeSectionTitle(doc, "Active Medications", y)
  if (summary.medications.length === 0) {
    y = writeLine(doc, "No medications recorded.", y)
  } else {
    for (const med of summary.medications) {
      y = writeLine(
        doc,
        `• ${med.medicineName} — ${med.dosage} for ${med.condition} (Dr. ${med.prescribedBy.replace(/^Dr\.\s*/i, "")})`,
        y
      )
    }
  }
  y += 4

  y = writeSectionTitle(doc, "Health History", y)
  if (summary.healthHistory.length === 0) {
    y = writeLine(doc, "No health history recorded.", y)
  } else {
    for (const entry of summary.healthHistory) {
      y = writeLine(
        doc,
        `• ${entry.illnessName} (${entry.diagnosisDate}) — ${entry.details}`,
        y
      )
    }
  }
  y += 4

  y = writeSectionTitle(doc, "Immunizations", y)
  if (summary.vaccinations.length === 0) {
    y = writeLine(doc, "No vaccinations recorded.", y)
  } else {
    for (const vax of summary.vaccinations) {
      y = writeLine(
        doc,
        `• ${vax.vaccineName} — ${vax.date} (${vax.dosage})`,
        y
      )
    }
  }
  y += 4

  y = writeSectionTitle(doc, "Care Providers", y)
  if (summary.careProviders.length === 0) {
    y = writeLine(doc, "No care providers recorded.", y)
  } else {
    for (const provider of summary.careProviders) {
      y = writeLine(
        doc,
        `• ${provider.name} — ${provider.phone}${provider.clinicDetails ? ` · ${provider.clinicDetails}` : ""}`,
        y
      )
    }
  }

  const fileName = `${displayName.replace(/\s+/g, "-").toLowerCase()}-medical-records.pdf`
  doc.save(fileName)
}
