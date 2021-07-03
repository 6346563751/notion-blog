import Link from 'next/link'
import Header from '../components/header'

import blogStyles from '../styles/blog.module.css'
import sharedStyles from '../styles/shared.module.css'

import { getBlogLink, getDateStr, postIsPublished } from '../lib/blog-helpers'
import { textBlock } from '../lib/notion/renderers'
import getNotionUsers from '../lib/notion/getNotionUsers'
import getBlogIndex from '../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map((slug) => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)
    .reverse()

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map((post) => {
    post.Authors = post.Authors.map((id) => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  }
}

const Index = ({ posts = [], preview }) => {
  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>
          Hey, I'm <span className="bob">Bob</span> 👋
        </h1>
        <div className="bio">
          <p>
            I am a high school student with a thirst for learning. I am
            specialized in web development. You can follow me on{' '}
            <span className="github">
              <a href="https://github.com/6346563751">Github</a>
            </span>{' '}
            where I post some codes and on{' '}
            <span className="discord">
              <a href="https://discord.gg/tNqBJYQNTB">Discord</a>
            </span>{' '}
            where I'm just chilling.
          </p>
        </div>
        <h2 className="last-articles">Lastest articles</h2>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        <div className="list-posts">
          {posts.map((post) => {
            return (
              <div className={blogStyles.postPreview} key={post.Slug}>
                <h3>
                  <span className={blogStyles.titleContainer}>
                    {!post.Published && (
                      <span className={blogStyles.draftBadge}>Draft</span>
                    )}
                    <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                      <a>{post.Page}</a>
                    </Link>
                  </span>
                </h3>
                {post.Date && (
                  <div className="posted">le {getDateStr(post.Date)}</div>
                )}
                <p>
                  {(!post.preview || post.preview.length === 0) &&
                    'No preview available'}
                  {(post.preview || []).map((block, idx) =>
                    textBlock(block, true, `${post.Slug}${idx}`)
                  )}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Index
