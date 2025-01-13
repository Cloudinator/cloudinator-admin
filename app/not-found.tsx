'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Lottie from 'lottie-react'
import NotFoundAnimation from '@/public/NotFound.json' // Adjust the path to your animation file

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#070B1B] relative overflow-hidden flex items-center justify-center">
      {/* Stars animation */}
      <div className="absolute inset-0">
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Blue planet */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center w-full">
        <div className="bg-[#0B1023] rounded-lg p-8 mb-8 shadow-xl backdrop-blur-sm border border-gray-800 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">404 Not Found</h1>
          <p className="text-gray-400 mb-4">This page doesn&apos;t exist...</p>
          <p className="text-gray-400">
            We couldn&apos;t find a page at the URL you&apos;re on. You can try{' '}
            <Link href="/login" className="text-purple-400 font-bold hover:text-purple-500 transition-all ease-in-out">
              logging in
            </Link>{' '}
            or going back to the{' '}
            <Link href="/" className="text-purple-400 font-bold hover:text-purple-500 transition-all ease-in-out">
              homepage
            </Link>
            .
          </p>
        </div>

        {/* Lottie animation */}
        <div className="w-full max-w-xl mx-auto h-64 animate-float ">
          {NotFoundAnimation ? (
            <Lottie
              animationData={NotFoundAnimation}
              loop={true}
              autoplay={true}
            />
          ) : (
            <p className="text-gray-400">Animation not available</p>
          )}
        </div>
      </div>
    </div>
  )
}