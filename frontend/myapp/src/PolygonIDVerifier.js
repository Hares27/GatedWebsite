
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";

const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

function PolygonIDVerifier({
    credentialType,
  issuerOrHowToLink,
  onVerificationResult,
 
  localServerURL,
}){
    const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState();
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);
  // const serverUrl = window.location.href.startsWith("http")
  //   ? publicServerURL
  //   : localServerURL;
  const serverUrl=localServerURL;

    const getQrCodeApi = (sessionId) =>
    serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

  const socket = io(serverUrl);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);
      console.log(socket.id);

     
      socket.on(socket.id, (arg) => {
        console.log(arg)
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
  }, []);


  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      // console.log(data)
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode().then(setQrCodeData).catch(console.error);
    }
  }, [sessionId]);

  
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];
      console.log(currentSocketEvent);

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("Verified proof");
            setTimeout(() => {
              reportVerificationResult(true);
            }, "2000");
            socket.close();
          } else {
            setVerfificationMessage("Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);
  const reportVerificationResult = (result) => {
    onVerificationResult(result);
  };

  return(
      <div>
          
          {isHandlingVerification && (
                <div>
                  <p>Authenticating...</p>
                  
                </div>
              )}
              {verificationMessage}
              {qrCodeData &&
                !isHandlingVerification &&
                !verificationCheckComplete && (
                  <center marginBottom={1}>
                    <QRCode value={JSON.stringify(qrCodeData)} />

                  </center>
                )}

              {qrCodeData.body?.scope[0].query && (
                <p>Type: {qrCodeData.body?.scope[0].query.type}</p>
              )}

              {qrCodeData.body.message && <p>{qrCodeData.body.message}</p>}

              {qrCodeData.body.reason && (
                <p>Reason: {qrCodeData.body.reason}</p>
              )}
      </div>
  )

}
export default PolygonIDVerifier;