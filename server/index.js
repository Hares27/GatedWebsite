const express=require("express");
const {Server}=require("socket.io");
const {auth, resolver, loaders} = require('@iden3/js-iden3-auth');
const cors=require("cors");
require("dotenv").config();
const app=express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

const server=app.listen(8080,()=>
{
    console.log("Listening");
})

const io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
    },
});

const authRequests=new Map();

const apiPath={
    getAuthQr:"/api/get-auth-qr",
    handleVerification:"/api/verification-callback",
}

const STATUS={
    IN_PROGRESS:"IN_PROGRESS",
    ERROR:"ERROR",
    DONE:"DONE",
};
const socketMessage=(fn,status,data)=>{
    fn,status,data;
};

app.get("/",(req,res)=>
{
    res.send("Arjun");
})

app.get(apiPath.getAuthQr,(req,res)=>{
    getAuthqr(req,res);
});
app.post(apiPath.handleVerification,(req,res)=>
{
    handleVerification(req,res);
});

async function getAuthqr(req,res){
    const sessionId=req.query.sessionId;
    console.log(sessionId);
    io.sockets.emit(sessionId,{fn:"getAuthqr",status:STATUS.INPROGRESS,data:sessionId});
    const uri=`${process.env.LOCAL_URL}${apiPath.handleVerification}?sessionId=${sessionId}`;
    const request=auth.createAuthorizationRequest(
        "Must born before this year",
        process.env.VERIFIER_DID,
        uri
        

    );

    request.id=sessionId;
    request.thid=sessionId;

    const proofRequest = {
        id: 1,
        circuitId: 'credentialAtomicQuerySigV2',
        query: {
          allowedIssuers: ['*'],
          type: 'KYCAgeCredential',
          context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
          credentialSubject: {
            birthday: {
              $lt: 20000101,
            },
          },
      },
      };

      const scope = request.body.scope ?? [];
      request.body.scope=[...scope,proofRequest];
      authRequests.set(sessionId,request);
      io.sockets.emit(sessionId,{fn:"getAuthqr",status:STATUS.DONE,data:request});
      res.send(request);
};

async function handleVerification(req,res){
    const  sessionId=req.query.sessionId;

    const authRequest=authRequests(sessionId);
    
  io.sockets.emit(
    sessionId,
    {fn:"handleVerification", status:STATUS.IN_PROGRESS, data:authRequest}
  );

  const raw=await getRawBody(req);
  const tokenstr=raw.toString().trim();
  const mumbaiContractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = "./keys";

  const ethStateResolver = new resolver.EthStateResolver(
    process.env.RPC_URL_MUMBAI,
    mumbaiContractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);


  try{
    const opts = {
        AcceptedStateTransitionDelay: 5 * 60 * 1000, // up to a 5 minute delay accepted by the Verifier
      };

      const authresponse=await verifier.fullVerify(tokenstr,authrequest,opts);
      const userId=authResponse.from;

      io.sockets.emit(
        sessionId,
        {fn:"handleVerification", status:STATUS.DONE, data:authResponse}
      );

      return res.send("Successfully Authenticated");

  }
  catch(error){
    console.log(
        "Error handling verification: Double check the value of your RPC_URL_MUMBAI in the .env file. Are you using a valid api key for Polygon Mumbai from your RPC provider? Visit https://alchemy.com/?r=zU2MTQwNTU5Mzc2M and create a new app with Polygon Mumbai"
      );
      console.log("handleVerification error", sessionId, error);
      io.sockets.emit(
        sessionId,
        {fn:"handleVerification", status:STATUS.ERROR, data:error}
      );

      return res.send(error,"Error");
  }


}