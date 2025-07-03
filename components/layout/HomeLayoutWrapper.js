import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from '../Link'
import SectionContainer from '../SectionContainer'
import Footer from '../Footer'
import MobileNav from '../MobileNav'
import ThemeSwitch from '../ThemeSwitch'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const HomeLayoutWrapper = ({ children }) => {
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
        <div className="sticky top-0 z-20 bg-gradient-to-r from-black via-red-600 to-yellow-500 shadow-md">
          <header className="flex items-center justify-between px-4 py-2">
            <div>
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="flex items-center justify-between">
                  <div className="py-2 md:hidden">
                    <Image src="/static/images/logo.webp" width={48} height={48} alt="Listen German Stories" />
                  </div>
                  <div className="hidden py-2 md:block">
                    <Image src="/static/images/logo.webp" width={64} height={64} alt="Listen German Stories" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">Listen German Stories</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center text-base leading-5">
              <div className="hidden sm:block">
                {headerNavLinks.map((link) => (
                  <Link key={link.title} href={link.href} className="p-1 text-lg font-medium text-white hover:text-gray-200 sm:p-3">
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
          <div className="relative">
            <main className="mb-auto">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

export default HomeLayoutWrapper
