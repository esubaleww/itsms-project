import QRCode from "qrcode";

export const generateSessionQR = async (sessionId, sessionData, trainerId) => {
  const qrData = {
    sessionId,
    title: sessionData.title,
    date: sessionData.date,
    duration: sessionData.duration,
    trainerId,
    timestamp: Date.now(),
  };

  const qrString = JSON.stringify(qrData);
  const qrCodeDataURL = await QRCode.toDataURL(qrString, {
    width: 300,
    margin: 2,
    color: {
      dark: "#10B981",
      light: "#FFFFFF",
    },
  });

  return qrCodeDataURL;
};

export const verifyQRData = (qrData, sessionId) => {
  try {
    const parsed = JSON.parse(qrData);
    return parsed.sessionId === sessionId;
  } catch {
    return false;
  }
};
