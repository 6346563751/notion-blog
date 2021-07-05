import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import Image from 'next/image'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Blog', page: '/' },
  { label: 'Ressources', page: '/ressources' },
]

const ogImageUrl = 'https://media.giphy.com/media/QBA56XrGs3i2zMiryz/giphy.gif'

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''} Bob</title>
        <meta
          name="description"
          content="みなさん、こんにちは！私のブログへようこそ、あなたは本当にこのページへの道を失ったに違いありません。"
        />
        <meta
          property="og:description"
          content="みなさん、こんにちは！私のブログへようこそ、あなたは本当にこのページへの道を失ったに違いありません。"
        />

        <meta name="og:title" content="Bob" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@_ijjk" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <div className="relative select-none bg-white lg:flex lg:items-stretch w-full pt-5 pl-5">
        <div className="lg:flex ml-10">
          <a className="cursor-pointer">
            <Link href="/">
              <Image src="/home.svg" width={32} height={32} />
            </Link>
          </a>
        </div>
        <div className="lg:flex lg:items-stretch lg:flex-no-shrink lg:flex-grow">
          <div className="lg:flex lg:items-stretch lg:justify-end ml-auto mr-10">
            {navItems.map(({ label, page, link }) => (
              <Link href={page}>
                <a
                  className={
                    'flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-black no-underline flex items-center hover:bg-grey-dark ' +
                    (pathname === page ? 'font-bold' : '')
                  }
                >
                  {label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
