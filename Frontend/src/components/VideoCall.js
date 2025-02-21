import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const VideoCall = () => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        myVideoRef.current.srcObject = stream;
      });

    socket.on("user_joined", (userId) => {
      peerRef.current = new Peer({ initiator: true, trickle: false, stream: myStream });
      peerRef.current.on("signal", (signal) => {
        socket.emit("offer", { signal, to: userId });
      });

      peerRef.current.on("stream", (stream) => {
        setRemoteStream(stream);
        remoteVideoRef.current.srcObject = stream;
      });
    });

    socket.on("offer", ({ signal, from }) => {
      peerRef.current = new Peer({ initiator: false, trickle: false, stream: myStream });
      peerRef.current.signal(signal);
      peerRef.current.on("stream", (stream) => {
        setRemoteStream(stream);
        remoteVideoRef.current.srcObject = stream;
      });
    });

  }, []);

  return (
    <div>
      <h2>Video Call</h2>
      <video ref={myVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoCall;
