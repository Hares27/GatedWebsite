
import './App.css';
import { useState } from "react";
import PolygonIDVerifier from "./PolygonIDVerifier";


function App() {
  const [provedAccessBirthday, setProvedAccessBirthday] = useState(false);
  console.log(provedAccessBirthday);
  return (
    
  //     {provedAccessBirthday ? <div>Arjun</div> :(<p>
  //                 This is a fullstack template for creating a Polygon ID VC{" "}
  //                 <a href="https://0xpolygonid.github.io/tutorials/#core-concepts-of-polygon-id-verifiable-credentials-identity-holder-issuer-and-verifier-triangle-of-trust">
  //                   (Verifiable Credential)
  //                 </a>{" "}
  //                 gated dapp. Prove you were born before January 1, 2023 to use
  //                 the dapp
  //               </p>

  //               <PolygonIDVerifier
  //                 // publicServerURL={
  //                 //   process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
  //                 // }
  //                 localServerURL={
  //                   process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
  //                 }
  //                 credentialType={"KYCAgeCredential"}
  //                 issuerOrHowToLink={
  //                   "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
  //                 }
  //                 onVerificationResult={setProvedAccessBirthday}
  //               />
  //               {/* <image
  //                 src="https://bafybeibcgo5anycve5flw6pcz5esiqkvrzlmwdr37wcqu33u63olskqkze.ipfs.nftstorage.link/"
  //                 alt="Polygon devs image"
  //                 borderRadius="lg"
  //               />  */}
  // )};

  <div>
     {provedAccessBirthday ? (
        <div>LoggedIn</div>
      ) : (
        <center >
          <div>
            
              
                <p>
                  This is a fullstack template for creating a Polygon ID VC{" "}
                  <a href="https://0xpolygonid.github.io/tutorials/#core-concepts-of-polygon-id-verifiable-credentials-identity-holder-issuer-and-verifier-triangle-of-trust">
                    (Verifiable Credential)
                  </a>{" "}
                  gated dapp. Prove you were born before January 1, 2023 to use
                  the dapp
                </p>

                <PolygonIDVerifier
                  publicServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                  }
                  localServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                  }
                  credentialType={"KYCAgeCredential"}
                  issuerOrHowToLink={
                    "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
                  }
                  onVerificationResult={setProvedAccessBirthday}
                />
                {/* <image
                  src="https://bafybeibcgo5anycve5flw6pcz5esiqkvrzlmwdr37wcqu33u63olskqkze.ipfs.nftstorage.link/"
                  alt="Polygon devs image"
                  borderRadius="lg"
                /> */}
             
              
                
                 
             
            
          </div>
        </center>
      )}
  </div>
    
   
  );
}

export default App;
