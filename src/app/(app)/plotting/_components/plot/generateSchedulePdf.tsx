import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

export async function generateSchedulePDF({
  calendarRef,
  selectedBuildingName,
  selectedClassroomName,
}: {
  calendarRef: React.RefObject<HTMLDivElement | null>;
  selectedBuildingName?: string;
  selectedClassroomName?: string;
}) {
  if (!calendarRef.current) return;

  try {
    // Find all scrollable elements and expand them
    const scrollArea = calendarRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    const scrollAreaContainer =
      calendarRef.current.querySelector(".h-\\[75vh\\]");
    const allScrollContainers = calendarRef.current.querySelectorAll(
      '[style*="overflow"]',
    );

    // Store original styles
    const originalStyles = new Map<
      HTMLElement,
      { height?: string; overflow?: string; maxHeight?: string }
    >();

    if (scrollArea instanceof HTMLElement) {
      originalStyles.set(scrollArea, {
        height: scrollArea.style.height,
        overflow: scrollArea.style.overflow,
        maxHeight: scrollArea.style.maxHeight,
      });
      scrollArea.style.height = "auto";
      scrollArea.style.maxHeight = "none";
      scrollArea.style.overflow = "visible";
    }

    if (scrollAreaContainer instanceof HTMLElement) {
      originalStyles.set(scrollAreaContainer, {
        height: scrollAreaContainer.style.height,
        maxHeight: scrollAreaContainer.style.maxHeight,
      });
      scrollAreaContainer.style.height = "auto";
      scrollAreaContainer.style.maxHeight = "none";
    }

    // Expand any other scroll containers
    allScrollContainers.forEach((el) => {
      if (el instanceof HTMLElement && el !== scrollArea) {
        originalStyles.set(el, {
          overflow: el.style.overflow,
          height: el.style.height,
          maxHeight: el.style.maxHeight,
        });
        el.style.overflow = "visible";
        if (el.style.height) el.style.height = "auto";
        if (el.style.maxHeight) el.style.maxHeight = "none";
      }
    });

    // Wait for layout to settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Capture image
    const dataUrl = await toPng(calendarRef.current, {
      quality: 0.92,
      pixelRatio: 1.5,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    // Restore styles
    originalStyles.forEach((styles, element) => {
      if (styles.height !== undefined) element.style.height = styles.height;
      if (styles.overflow !== undefined)
        element.style.overflow = styles.overflow;
      if (styles.maxHeight !== undefined)
        element.style.maxHeight = styles.maxHeight;
    });

    // Create image to get dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    // Setup PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const headerHeight = 20;

    // Header
    pdf.setFontSize(16);
    pdf.setFont("", "bold");
    pdf.text(
      `${selectedBuildingName} - ${selectedClassroomName}`,
      pageWidth / 2,
      15,
      { align: "center" },
    );

    pdf.setFontSize(10);
    pdf.setFont("", "normal");
    pdf.text("Weekly Schedule", pageWidth / 2, 22, { align: "center" });

    // Fit calendar image
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - headerHeight - 2 * margin;

    const scaleWidth = availableWidth / img.width;
    const scaleHeight = availableHeight / img.height;
    const scale = Math.min(scaleWidth, scaleHeight);

    const finalWidth = img.width * scale;
    const finalHeight = img.height * scale;

    const xOffset = margin + (availableWidth - finalWidth) / 2;
    const yOffset = headerHeight + margin;

    pdf.addImage(
      dataUrl,
      "JPEG",
      xOffset,
      yOffset,
      finalWidth,
      finalHeight,
      undefined,
      "FAST",
    );

    const filename = `${selectedBuildingName}_${selectedClassroomName}_Schedule.pdf`;
    toast.success("PDF generated successfully");
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
  }
}
