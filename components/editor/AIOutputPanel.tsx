"use client"
import React from 'react'

interface AIOutputPanelProps {
  aiOutput: string
  aiOutputType: 'strategy' | 'build' | null
  isGenerating: boolean
  isGeneratingPlan: boolean
  isSuggestingBuild: boolean
  onClear: () => void
}

// Format AI output with bold headers and better structure
function formatAIOutput(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    
    // Skip empty lines
    if (!trimmed) {
      elements.push(<div key={index} className="h-2" />)
      return
    }
    
    // Headers (ALL CAPS or ending with colon or numbered sections)
    if (
      trimmed === trimmed.toUpperCase() && trimmed.length > 3 ||
      /^\d+\.\s*[A-Z]/.test(trimmed) ||
      /^[A-Z][^.!?]*:$/.test(trimmed)
    ) {
      elements.push(
        <div key={index} className="text-base font-bold text-white mt-4 mb-2">
          {trimmed}
        </div>
      )
    }
    // Bullet points or list items
    else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
      const content = trimmed.substring(1).trim()
      elements.push(
        <div key={index} className="flex gap-2 ml-2 mb-1.5">
          <span className="text-purple-400 mt-1">•</span>
          <span className="flex-1">{content}</span>
        </div>
      )
    }
    // Regular text
    else {
      elements.push(
        <div key={index} className="mb-1.5 leading-relaxed">
          {trimmed}
        </div>
      )
    }
  })
  
  return elements
}

export default function AIOutputPanel({
  aiOutput,
  aiOutputType,
  isGenerating,
  isGeneratingPlan,
  isSuggestingBuild,
  onClear
}: AIOutputPanelProps) {
  return (
    <div className="w-[500px] flex-shrink-0">
      <div className="sticky top-6 bg-gradient-to-b from-[#2a3439] to-[#1f2629] border border-white/10 rounded-xl p-4 backdrop-blur-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-white">AI Assistant</h3>
          </div>
          {aiOutput && (
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5 rounded"
              title="Clear output"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Model Badge */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 font-mono font-semibold">
            GPT-4o-mini
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">AI-Generated</span>
        </div>

        {/* Output Display */}
        <div className="bg-[#1a1f22] rounded-lg p-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent border border-white/5">
          {aiOutput ? (
            <div className="space-y-3">
              {/* Output Type Badge */}
              {aiOutputType && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 font-semibold mb-3">
                  {aiOutputType === 'strategy' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Strategy Plan
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Build Suggestion
                    </>
                  )}
                </div>
              )}
              
              {/* Output Content */}
              <div className="text-sm text-gray-200 leading-relaxed space-y-1">
                {formatAIOutput(aiOutput)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-purple-600/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-semibold">AI Assistant Ready</p>
              <p className="text-gray-500 text-xs max-w-xs">
                Click <span className="text-purple-400 font-semibold">"Generate Strategy Plan"</span> or{' '}
                <span className="text-yellow-400 font-semibold">"Suggest Build"</span> to receive AI-powered recommendations
              </p>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        {(isGeneratingPlan || isSuggestingBuild) && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-500/20 rounded-lg">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-purple-300">
              {isGeneratingPlan ? 'Generating strategy plan...' : 'Analyzing build options...'}
            </span>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 text-center">
            ⚠️ AI-generated content may contain inaccuracies. Use as guidance only.
          </p>
        </div>
      </div>
    </div>
  )
}
