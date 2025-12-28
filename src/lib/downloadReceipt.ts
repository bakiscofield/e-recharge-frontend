import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
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
    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
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
    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add image to PDF
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(`recu-${orderId.slice(0, 8)}-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Erreur lors du téléchargement du reçu PDF');
  }
}
