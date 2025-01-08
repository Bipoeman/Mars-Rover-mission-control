import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image';
import { K2D } from 'next/font/google'
import Lottie from 'lottie-react';
import waiting from "./deliver.json"
import pass from "./img-pass.json"
import not_pass from "./img-not-pass.json"
const k2d = K2D({ weight: "500", subsets: ['latin', 'thai'] })
interface fileTranmit {
  filename: string;
  team: string;
}
export default function HomePage() {
  var [imageSrc, setImageSrc] = useState("");
  var [animation, setAnimation] = useState<Object>(waiting);
  var [team, setTeam] = useState("");

  function preloadImage(fileName: string) {
    // var image = new Image()
    setImageSrc((prev) => {
      var src = `/images/${fileName}`
      console.log(`Image SRC : ${src}`)
      return src
    })
  }

  useEffect(() => {
    window.ipc.on("image", (file: fileTranmit) => {
      console.log(file)
      preloadImage(file.filename)
      setTeam(prev => file.team)
      // setTimeout(() => {
      //   setImageSrc(prev => "")
      // }, 5000)
    })
  })

  function clearImage() {
    setImageSrc(prev => "")
  }

  function onAcept() {
    clearImage();
    setAnimation(prev => pass)
  }
  function onReject() {
    clearImage();
    setAnimation(prev => not_pass)
  }
  function animationEnded(){
    setAnimation(prev => waiting)
  }

  return (
    <div className={`${k2d.className} flex flex-col justify-between py-[5vh] h-dvh`}>
      <Head>
        <title>MARS Rover Mission control</title>
      </Head>
      <span className='block text-6xl text-center'>
        {"Team "}
        <span>
          {imageSrc.length > 0 ? team : "..."}
        </span>
      </span>
      <span className='rounded-3xl my-10 mx-[10vw] flex justify-center h-[70vh] border-white border-[6px] border-solid'>
        {imageSrc.length > 0 ?
          <img src={imageSrc} className='object-cover' alt="" />
          // <Image src={imageSrc} className='block mx-10 relative object-cover' alt='123' width={1920} height={1080} objectFit='cover' />
          : <Lottie animationData={animation} onLoopComplete={animationEnded}></Lottie>}

      </span>
      <span className='flex justify-around mx-[10vw]'>
        <button onClick={onAcept} className='px-[8vw] py-6 bg-[#137140] hover:bg-[#125331] hover:transition-colors hover:duration-200 hover:ease-in-out text-3xl rounded-lg'>Acept</button>
        <button onClick={onReject} className='px-[8vw] py-6 bg-[#711313] hover:bg-[#571212] hover:transition-colors hover:duration-200 hover:ease-in-out text-3xl rounded-lg'>Reject</button>
      </span>
    </div>
  )
}
