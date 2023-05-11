import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const LayoutWrapper = ({ children }) => {
  const parallaxRef = useRef()

  useEffect(() => {
    const onScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.top = `${-window.scrollY / 2}px`
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <SectionContainer>
      <div className="relative">
        {/* Added relative positioning here */}
        <div className="absolute z-10 w-full">
          {/* Added absolute positioning and z-index for header */}
          <header className="flex items-center justify-between bg-black bg-opacity-30 p-4 shadow-2xl">
            <div>
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="flex items-center justify-between">
                  <div className="mr-3">
                    <Image src="/static/images/logo.png" width={150} height={150} alt="Listen German Stories" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center text-base leading-5">
              <div className="hidden sm:block">
                {headerNavLinks.map((link) => (
                  <Link key={link.title} href={link.href} className="p-1 text-xl font-medium text-slate-200 dark:text-gray-100 sm:p-4">
                    {link.title}
                  </Link>
                ))}
              </div>
              <ThemeSwitch />
              <MobileNav />
            </div>
          </header>
        </div>
        <div className="relative z-0">
          {/* Hero section with lower z-index */}
          <div className="relative h-[400px] w-full overflow-hidden">
            <div ref={parallaxRef} className="absolute inset-0 h-[150%]">
              <Image className="object-cover" src="/static/images/hero-image.png" layout="fill" objectFit="cover" quality={100} alt="Hero Background" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-6xl font-bold text-white">
                <span className="">
                  <span className="text-shadow-sm text-6xl">Listen German Stories</span>
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Restored relative positioning for rest of the content */}
            <main className="mb-auto">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
