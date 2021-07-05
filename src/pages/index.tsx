import Link from 'next/link'
import Header from '../components/header'

import blogStyles from '../styles/blog.module.css'
import sharedStyles from '../styles/shared.module.css'

import { getBlogLink, getDateStr, postIsPublished } from '../lib/blog-helpers'
import { textBlock } from '../lib/notion/renderers'
import getNotionUsers from '../lib/notion/getNotionUsers'
import getBlogIndex from '../lib/notion/getBlogIndex'

import Image from 'next/image'

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
      <div className={`bg-white`}>
        <div className="flex flex-row lg:mx-60 lg:mt-20">
          <div className="flex flex-col text-center lg:text-left">
            <div>
              <p className="text-4xl font-bold text-green-400 mb-5">
                Hey, I'm <span className="bob">Bob</span> 👋
              </p>
            </div>
            <div className="bio mr-5">
              <p className="text-gray-600">
                I am a high school student with a thirst for learning. I am
                specialized in web development. You can follow me on{' '}
                <span className="text-black border-b-2 border-black">
                  <a href="https://github.com/6346563751">Github</a>
                </span>{' '}
                where I post some codes and on{' '}
                <span className="text-blue-800 border-b-2 border-blue-800">
                  <a href="https://discord.gg/tNqBJYQNTB">Discord</a>
                </span>{' '}
                where I'm just chilling.
              </p>
            </div>
            <div className="mt-10">
              <button
                type="button"
                className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition duration-200 each-in-out text-sm"
              >
                Download Resume
              </button>
            </div>
          </div>
          <div className="hidden lg:block right">
            <Image
              src="/kj.jpg"
              className="rounded-full flex-shrink-0"
              width={650}
              height={650}
            />
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
          <path
            fill="#f87171"
            fill-opacity="1"
            d="M0,96L1440,64L1440,320L0,320Z"
          ></path>
        </svg>
        <div className="w-full bg-red-400  px-10">
          <h2 className="text-white font-medium mb-2">Lastest articles</h2>
          <div className="border-2 bg-white">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
          <path
            fill="#f87171"
            fill-opacity="1"
            d="M0,96L1440,64L1440,0L0,0Z"
          ></path>
        </svg>
      </div>
    </>
  )
}

export default Index
