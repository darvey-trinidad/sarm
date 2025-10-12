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
    // Check if mobile view
    const wasMobileView = window.innerWidth < 768;

    // Find all scrollable elements and expand them
    const scrollArea = calendarRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    const scrollAreaContainer =
      calendarRef.current.querySelector(".h-\\[75vh\\]");
    const allScrollContainers = calendarRef.current.querySelectorAll(
      '[style*="overflow"]',
    );

    // Store original styles including viewport width
    const originalStyles = new Map<
      HTMLElement | string,
      | {
          height?: string;
          overflow?: string;
          maxHeight?: string;
          width?: string;
          minWidth?: string;
        }
      | string
    >();

    // Store original viewport meta for mobile
    let originalViewport = "";
    if (wasMobileView) {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        originalViewport = viewportMeta.getAttribute("content") || "";
        viewportMeta.setAttribute("content", "width=1200");
      }
    }

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

    // Force desktop layout on mobile with proper width
    if (wasMobileView && calendarRef.current) {
      originalStyles.set("rootWidth", calendarRef.current.style.width);
      originalStyles.set("rootMinWidth", calendarRef.current.style.minWidth);
      calendarRef.current.style.width = "1200px";
      calendarRef.current.style.minWidth = "1200px";

      // Also force the parent containers to be wide enough
      const parent = calendarRef.current.parentElement;
      if (parent) {
        originalStyles.set("parentWidth", parent.style.width);
        parent.style.width = "1200px";
      }
    }

    // Wait longer for layout to settle and re-render
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture image with explicit width
    const dataUrl = await toPng(calendarRef.current, {
      quality: 0.92,
      pixelRatio: 1.5,
      backgroundColor: "#ffffff",
      cacheBust: true,
      width: wasMobileView ? 1200 : undefined,
    });

    // Restore viewport meta
    if (wasMobileView && originalViewport) {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute("content", originalViewport);
      }
    }

    // Restore all original styles
    originalStyles.forEach((styles, element) => {
      if (element === "rootWidth" && calendarRef.current) {
        calendarRef.current.style.width = styles as string;
      } else if (element === "rootMinWidth" && calendarRef.current) {
        calendarRef.current.style.minWidth = styles as string;
      } else if (
        element === "parentWidth" &&
        calendarRef.current?.parentElement
      ) {
        calendarRef.current.parentElement.style.width = styles as string;
      } else if (typeof element !== "string") {
        const htmlElement = element as HTMLElement;
        const styleObj = styles as {
          height?: string;
          overflow?: string;
          maxHeight?: string;
          width?: string;
          minWidth?: string;
        };
        if (styleObj.height !== undefined)
          htmlElement.style.height = styleObj.height;
        if (styleObj.overflow !== undefined)
          htmlElement.style.overflow = styleObj.overflow;
        if (styleObj.maxHeight !== undefined)
          htmlElement.style.maxHeight = styleObj.maxHeight;
        if (styleObj.width !== undefined)
          htmlElement.style.width = styleObj.width;
        if (styleObj.minWidth !== undefined)
          htmlElement.style.minWidth = styleObj.minWidth;
      }
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
