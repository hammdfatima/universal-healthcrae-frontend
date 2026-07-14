import { jsPDF } from "jspdf"

import {
  type AdminPayment,
  formatPaymentStatus,
} from "@/app/(dashboards)/admin/_lib/payments"
import { ensureCurrencyPrice } from "@/lib/subscription/format-price"

const MARGIN = 16
const LINE_HEIGHT = 6
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

export async function downloadPaymentInvoicePdf(payment: AdminPayment) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
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

  doc.setFontSize(12)
  doc.text("Platform Invoice", textX, y + 13)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("support@universalhealthcharts.com", textX, y + 19)
  doc.setTextColor(0, 0, 0)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(payment.invoiceNumber, 210 - MARGIN, y + 6, { align: "right" })
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Date: ${payment.date}`, 210 - MARGIN, y + 13, { align: "right" })
  doc.text(
    `Status: ${formatPaymentStatus(payment.status)}`,
    210 - MARGIN,
    y + 19,
    {
      align: "right",
    }
  )

  y += LOGO_HEIGHT_MM + 12

  doc.setDrawColor(220, 220, 220)
  doc.line(MARGIN, y, 210 - MARGIN, y)
  y += 10

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("Bill To", MARGIN, y)
  y += LINE_HEIGHT + 2

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(payment.user, MARGIN, y)
  y += LINE_HEIGHT
  doc.text(payment.email, MARGIN, y)
  y += LINE_HEIGHT
  if (payment.phone) {
    doc.text(payment.phone, MARGIN, y)
    y += LINE_HEIGHT
  }
  if (payment.address) {
    doc.text(payment.address, MARGIN, y)
    y += LINE_HEIGHT
  }
  y += 8

  doc.setFont("helvetica", "bold")
  doc.text("Description", MARGIN, y)
  doc.text("Amount", 210 - MARGIN, y, { align: "right" })
  y += 4
  doc.line(MARGIN, y, 210 - MARGIN, y)
  y += LINE_HEIGHT + 2

  doc.setFont("helvetica", "normal")
  doc.text(`${payment.plan} (${payment.billingCycle})`, MARGIN, y)
  doc.text(ensureCurrencyPrice(payment.amount), 210 - MARGIN, y, {
    align: "right",
  })
  y += LINE_HEIGHT + 8

  doc.line(MARGIN, y, 210 - MARGIN, y)
  y += LINE_HEIGHT + 2
  doc.setFont("helvetica", "bold")
  doc.text("Total", MARGIN, y)
  doc.text(ensureCurrencyPrice(payment.amount), 210 - MARGIN, y, {
    align: "right",
  })
  y += LINE_HEIGHT + 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Payment Method: ${payment.paymentMethod}`, MARGIN, y)
  y += LINE_HEIGHT
  doc.text(`Transaction ID: ${payment.transactionId}`, MARGIN, y)
  y += LINE_HEIGHT + 8

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text(
    "Thank you for your subscription to Universal Health Charts.",
    MARGIN,
    y
  )

  doc.save(`${payment.invoiceNumber.toLowerCase()}.pdf`)
}
