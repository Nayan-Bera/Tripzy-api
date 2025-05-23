import QRCode from 'qrcode';

export const generateQRCode = async (userId: string): Promise<string> => {
    try {
        // Generate a unique QR code data
        const qrData = JSON.stringify({
            userId,
            timestamp: new Date().toISOString(),
            type: 'identity_verification'
        });

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}; 