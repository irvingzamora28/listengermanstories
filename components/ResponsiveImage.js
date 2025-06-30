import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ResponsiveImage({ src, alt, originalWidth, originalHeight }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Initial check
      setIsMobile(window.innerWidth < 768)

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
      }

      window.addEventListener('resize', handleResize)

      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // For mobile: use original aspect ratio but scaled down
  // For desktop: use 16:9 aspect ratio
  const mobileWidth = originalWidth / 2
  const mobileHeight = originalHeight / 2

  // Calculate 16:9 dimensions while preserving width for desktop
  const desktopWidth = originalWidth
  const desktopHeight = Math.round((desktopWidth * 9) / 16)

  return (
    <div className="story-image-container">
      <Image src={src} alt={alt} width={isMobile ? mobileWidth : desktopWidth} height={isMobile ? mobileHeight : desktopHeight} className="story-image" priority={true} />
      <style jsx>{`
        .story-image-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        :global(.story-image) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          object-fit: ${isMobile ? 'contain' : 'cover'};
        }

        @media (min-width: 768px) {
          .story-image-container {
            margin: 3rem 0;
          }
        }
      `}</style>
    </div>
  )
}
