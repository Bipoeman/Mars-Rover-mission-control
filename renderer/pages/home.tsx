import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image';
import { K2D } from 'next/font/google'
import Lottie from 'lottie-react';
import waiting from "./pending.json"
import pass from "./img-pass.json"
import not_pass from "./img-not-pass.json"
import { motion } from "motion/react"
import { stat } from 'fs';
const k2d = K2D({ weight: "500", subsets: ['latin', 'thai'] })
interface fileTranmit {
  filename: string;
  team: string;
}
interface submitInterface{
  status : string;
  team : string;
}
interface uploadAllowed {
  enable: boolean;
}
export default function HomePage() {
  var [imageSrc, setImageSrc] = useState("");
  var [animation, setAnimation] = useState<Object>(waiting);
  var [team, setTeam] = useState("");
  var [uploadAllowedState,setUploadAllowedState] = useState(true)

  function preloadImage(fileName: string) {
    // var image = new Image()
    setImageSrc((prev) => "")
    setImageSrc((prev) => fileName)
  }

  useEffect(() => {
    window.ipc.on("image", (file: fileTranmit) => {
      console.log(file)
      setImageSrc((prev) => "")
      setTeam(prev => file.team)
      setTimeout(() => setImageSrc((prev) => file.filename), 500)
      // setTimeout(() => {
      //   setImageSrc(prev => "")
      // }, 5000)
    })
    window.ipc.on("imageState", (state: uploadAllowed) => {
      setUploadAllowedState(prev=>state.enable)
    })
  })

  function clearImage() {
    setImageSrc(prev => "")
    setTeam(prev=>"")
  }

  function onAcept() {
    clearImage();
    setAnimation(prev => pass)
    var status : submitInterface = {
      status : "acept",
      team : team,
    }
    window.ipc.send("submit",status)
  }
  function onReject() {
    clearImage();
    setAnimation(prev => not_pass)
    var status : submitInterface = {
      status : "reject",
      team : team
    }
    window.ipc.send("submit",status)
  }
  function animationEnded() {
    setAnimation(prev => waiting)
  }
  function onToggleUpload(){
    window.ipc.send("imageAllow",{"enable" : !uploadAllowedState})
  }

  return (
    <div className={`${k2d.className} flex flex-col justify-between py-[5vh] h-dvh`}>
      <Head>
        <title>MARS Rover Mission control</title>
      </Head>
      <span className='block text-6xl text-center'>
        {"Team "}
        <span >
          {imageSrc.length > 0 ? team : "..."}
        </span>
      </span>
      <span className='rounded-3xl my-10 mx-[10vw] flex justify-center h-[70vh] border-white border-[6px] border-solid'>
        {imageSrc.length > 0 ?
          <img src={imageSrc} className='object-cover rounded-3xl' alt="" />
          // <Image src={imageSrc} className='block mx-10 relative object-cover' alt='123' width={1920} height={1080} objectFit='cover' />
          : <Lottie animationData={animation} onLoopComplete={animationEnded}></Lottie>}

      </span>
      <span className='flex justify-around mx-[10vw]'>
        <button onClick={onAcept} className='px-[8vw] py-6 bg-[#137140] hover:bg-[#125331] hover:transition-colors hover:duration-200 hover:ease-in-out text-3xl rounded-lg'>Acept</button>
        <button onClick={onReject} className='px-[8vw] py-6 bg-[#711313] hover:bg-[#571212] hover:transition-colors hover:duration-200 hover:ease-in-out text-3xl rounded-lg'>Reject</button>
        <button onClick={onToggleUpload} className='px-6 py-6 bg-[#641371] hover:bg-[#4c1354] hover:transition-colors hover:duration-200 hover:ease-in-out text-3xl rounded-lg'>{`Upload ${uploadAllowedState ? "Allowed 🔓" : "Unallowed 🔒"}`}</button>
      </span>
    </div>
  )
}
