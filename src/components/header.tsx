import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Blog', page: '/' },
  { label: 'Ressources', page: '/ressources' },
]

const ogImageUrl = 'https://media.giphy.com/media/QBA56XrGs3i2zMiryz/giphy.gif'

const Header = ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
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
      <div>
        {navItems.map(({ label, page, link }) => (
          <p key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </p>
        ))}
      </div>
    </header>
  )
}

export default Header
