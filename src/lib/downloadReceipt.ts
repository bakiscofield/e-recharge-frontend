import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Wait for all images in an element to be fully loaded
 * @param element - The DOM element containing images
 */
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Continue even if image fails
    });
  });
  await Promise.all(promises);
}

/**
 * Convert external images to base64 to avoid CORS issues
 * @param element - The DOM element containing images
 */
async function convertImagesToBase64(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');

  for (const img of Array.from(images)) {
    if (!img.src || img.src.startsWith('data:')) continue;

    try {
      const response = await fetch(img.src, { mode: 'cors' });
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      img.src = base64;
    } catch (error) {
      // If CORS fails, try without mode: 'cors' for same-origin images
      console.warn('Could not convert image to base64:', img.src);
    }
  }
}

/**
 * Preview a transaction receipt without downloading
 * @param orderId - The ID of the order to preview
 */
export async function previewReceipt(orderId: string): Promise<void> {
  const element = document.getElementById(`receipt-${orderId}`);

  if (!element) {
    throw new Error('Receipt element not found');
  }

  try {
    // Wait for images to load and convert to base64
    await waitForImages(element);
    await convertImagesToBase64(element);

    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };

    const img = document.createElement('img');
    img.src = imageData;
    img.className = 'max-w-full max-h-[90vh] rounded-lg shadow-2xl';
    img.alt = 'Aperçu du reçu';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Fermer';
    closeBtn.className = 'absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition';
    closeBtn.onclick = () => document.body.removeChild(modal);

    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error previewing receipt:', error);
    throw new Error('Erreur lors de la prévisualisation du reçu');
  }
}

/**
 * Download a transaction receipt as PNG
 * @param orderId - The ID of the order to download
 */
export async function downloadReceiptAsPNG(orderId: string): Promise<void> {
  const element = document.getElementById(`receipt-${orderId}`);

  if (!element) {
    throw new Error('Receipt element not found');
  }

  try {
    // Wait for images to load and convert to base64
    await waitForImages(element);
    await convertImagesToBase64(element);

    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recu-${orderId.slice(0, 8)}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error downloading PNG:', error);
    throw new Error('Erreur lors du téléchargement du reçu PNG');
  }
}

/**
 * Download a transaction receipt as PDF
 * @param orderId - The ID of the order to download
 */
export async function downloadReceiptAsPDF(orderId: string): Promise<void> {
  const element = document.getElementById(`receipt-${orderId}`);

  if (!element) {
    throw new Error('Receipt element not found');
  }

  try {
    // Wait for images to load and convert to base64
    await waitForImages(element);
    await convertImagesToBase64(element);

    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // Calculate PDF dimensions
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // Margin in mm

    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    // Calculate aspect ratio and scale to fit on one page
    const aspectRatio = canvas.width / canvas.height;
    let imgWidth = availableWidth;
    let imgHeight = imgWidth / aspectRatio;

    // If height exceeds available space, scale down to fit
    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = imgHeight * aspectRatio;
    }

    // Center the image on the page
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add image to PDF - always on one page, centered
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // Download PDF
    pdf.save(`recu-${orderId.slice(0, 8)}-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Erreur lors du téléchargement du reçu PDF');
  }
}
