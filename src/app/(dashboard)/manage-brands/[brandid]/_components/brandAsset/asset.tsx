import React from 'react'

export default function BrandAssets({brandId}: {brandId: string}) {
  return (
    <div className="flex items-center justify-center h-[20rem] rounded-lg">
      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300">Under Development</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">This feature is coming soon</p>
      </div>
    </div>
  )
}
