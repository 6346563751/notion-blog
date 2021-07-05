import ExtLink from './ext-link'

export default function Footer() {
  return (
    <>
      <footer className="mb-8">
        <span>
          Based on{' '}
          <ExtLink href="https://github.com/ijjk/notion-blog">
            notion-blog
          </ExtLink>
        </span>
      </footer>
    </>
  )
}
