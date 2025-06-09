// Debug script to check blog post slugs from Sanity
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'ntqs7f5z',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-12-14',
})

async function checkSlugs() {
  try {
    console.log('Fetching blog posts from Sanity...')
    const posts = await client.fetch(`*[_type == "post" && defined(slug.current)] {
      _id,
      title,
      slug,
      publishedAt
    }`)

    console.log(`Found ${posts.length} blog posts:`)
    posts.forEach(post => {
      console.log(`- Title: "${post.title}"`)
      console.log(`  Slug: "${post.slug.current}"`)
      console.log(`  Has spaces: ${post.slug.current.includes(' ')}`)
      console.log(`  Encoded: ${encodeURIComponent(post.slug.current)}`)
      console.log(`  ID: ${post._id}`)
      console.log('')
    })

    // Check for specific problematic slug
    const problematicPosts = posts.filter(post => 
      post.slug.current.includes(' ') || 
      post.slug.current.includes('building-for-tomorrow')
    )

    if (problematicPosts.length > 0) {
      console.log('⚠️  PROBLEMATIC SLUGS FOUND:')
      problematicPosts.forEach(post => {
        console.log(`- "${post.title}": "${post.slug.current}"`)
      })
    } else {
      console.log('✅ No problematic slugs found in Sanity data')
    }

  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

checkSlugs()
