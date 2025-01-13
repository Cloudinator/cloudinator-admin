'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Loading = () => {
    const [progress, setProgress] = useState(0)
    const [currentPhrase, setCurrentPhrase] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress + 1) % 100)
        }, 50)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const phraseTimer = setInterval(() => {
            setCurrentPhrase((prevPhrase) => (prevPhrase + 1) % motivationalPhrases.length)
        }, 3000)

        return () => clearInterval(phraseTimer)
    }, [])

    const stages = [
        { name: 'Plan-', color: 'bg-blue-500' },
        { name: 'Code-', color: 'bg-green-500' },
        { name: 'Build-', color: 'bg-yellow-500' },
        { name: 'Test-', color: 'bg-orange-500' },
        { name: 'Release-', color: 'bg-red-500' },
        { name: 'Deploy-', color: 'bg-purple-500' },
        { name: 'Operate-', color: 'bg-indigo-500' },
        { name: 'Monitor', color: 'bg-pink-500' },
    ]

    const motivationalPhrases = [
        "Pipeline in progress...",
        "Integrating for success...",
        "Deploying with confidence...",
        "Monitoring for excellence...",
        "Collaborating across the pipeline...",
        "Optimizing for performance...",
        "Securing the delivery chain...",
    ]

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="mb-4 text-center text-lg font-semibold text-purple-700">
                {motivationalPhrases[currentPhrase]}
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-purple-500"
                    style={{ width: `${progress}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <div className="mt-4 flex justify-between">
                {stages.map((stage, index) => (
                    <div key={stage.name} className="flex flex-col items-center">
                        <motion.div
                            className={`w-4 h-4 rounded-full ${stage.color}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: progress >= ((index + 1) / stages.length) * 100 ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <span className="mt-2 text-xs text-gray-600">{stage.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Loading

