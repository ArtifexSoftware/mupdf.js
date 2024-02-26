'use client';
import React, {useEffect, useState} from 'react'
import Image from 'next/image'

export default function Page(props:any) {

  useEffect(() => {
  }, [])

  const imageStyle = {
    borderRadius: '5px',
    border: '1px solid #fff',
    width:'1200px',
    height:'auto'
  }

  return (

    <div className="flex min-h-screen flex-col items-center pl-24 pr-24 mt-[50px]">
      <div>
        <Image
          src={props.page}
          width={500}
          height={500}
          alt="PDF Page"
          style={imageStyle}
        />
      </div>
    </div>
  )
}
