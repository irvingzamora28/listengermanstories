import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from '../Link'
import SectionContainer from '../SectionContainer'
import Footer from '../Footer'
import MobileNav from '../MobileNav'
import ThemeSwitch from '../ThemeSwitch'
import Image from 'next/image'

const GeneralLayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between p-2">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3 mt-1 p-2">
                  <Image src="/static/images/logo.webp" width={48} height={48} alt="Listen German Stories" />
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link key={link.title} href={link.href} className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4">
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch textColor="text-gray-900 dark:text-gray-100" />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto px-8 md:px-28 lg:px-72">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default GeneralLayoutWrapper
