import { BlogPost, Project } from '@/types'
import Link from 'next/link'

interface HomeContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
    skills: string[]
  }
  blogs: BlogPost[]
  projects: Project[]
}

interface ServerContentProps {
  content: HomeContent
}

export default function ServerContent({ content }: ServerContentProps) {
  return (
    <main className="relative z-0 min-h-screen text-white bg-gradient-to-b from-slate-900 via-purple-900 to-black">
      {/* Hero Section - Server Rendered */}
      <section className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-6xl font-bold text-transparent md:text-8xl bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text">
            {content.hero.title}
          </h1>
          <h2 className="mb-8 text-2xl text-gray-300 md:text-3xl">
            {content.hero.subtitle}
          </h2>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-400 md:text-xl">
            {content.hero.description}
          </p>
          
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 mt-12">
            <Link 
              href="/blog" 
              className="px-6 py-3 transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              View Blog
            </Link>
            <Link 
              href="/explore" 
              className="px-6 py-3 transition-colors rounded-lg bg-cyan-600 hover:bg-cyan-700"
            >
              Explore Projects
          </Link>
        </nav>
      </div>
    </section>

      {/* About Section - Server Rendered */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-4xl font-bold text-center md:text-5xl">
            {content.about.title}
          </h2>
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-8 text-lg leading-relaxed text-gray-300">
                {content.about.content}
              </p>
            </div>
            <div>
              <h3 className="mb-6 text-2xl font-semibold">Core Expertise</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {content.about.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"></div>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects - Server Rendered */}
      {content.projects.length > 0 && (
        <section className="px-4 py-20 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-12 text-4xl font-bold text-center md:text-5xl">
              {content.projects.some(p => p.featured) ? 'Featured Projects' : 'Latest Projects'}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.projects.slice(0, 6).map((project) => (
                <article key={project._id} className="p-6 transition-colors rounded-lg bg-slate-800/50 hover:bg-slate-800/70 group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold transition-colors group-hover:text-cyan-400">{project.title}</h3>
                    {project.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'live' ? 'bg-green-600/30 text-green-300' :
                        project.status === 'beta' ? 'bg-yellow-600/30 text-yellow-300' :
                        project.status === 'development' ? 'bg-blue-600/30 text-blue-300' :
                        'bg-gray-600/30 text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  {project.category && (
                    <div className="mb-2">
                      <span className="text-xs tracking-wider text-gray-500 uppercase">
                        {project.category.title}
                      </span>
                    </div>
                  )}
                  <p className="mb-4 text-gray-400 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 4).map((tech, index) => (
                      <span key={index} className="px-2 py-1 text-sm text-purple-300 rounded bg-purple-600/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/explore/${project.slug.current}`}
                    className="transition-colors text-cyan-400 hover:text-cyan-300"
                  >
                    View Project →
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link 
                href="/explore"
                className="px-8 py-3 transition-colors rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Blog Posts - Server Rendered */}
      {content.blogs.length > 0 && (
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-12 text-4xl font-bold text-center md:text-5xl">
              {content.blogs.some(b => b.featured) ? 'Featured Insights' : 'Latest Insights'}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.blogs.slice(0, 6).map((blog) => (
                <article key={blog._id} className="p-6 transition-colors rounded-lg bg-slate-800/50 hover:bg-slate-800/70 group">
                  <div className="flex items-center gap-2 mb-3">
                    {blog.featured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-600/30 text-amber-300">
                        Featured
                      </span>
                    )}
                    {blog.categories && blog.categories.length > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full" style={{
                        backgroundColor: `${blog.categories[0].color}20`,
                        color: blog.categories[0].color
                      }}>
                        {blog.categories[0].title}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-cyan-400">{blog.title}</h3>
                  <p className="mb-4 text-gray-400 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {blog.author && (
                        <span>{blog.author.name}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <span>{blog.estimatedReadTime} min read</span>
                  </div>
                  <Link 
                    href={`/blog/${blog.slug.current}`}
                    className="inline-block mt-4 transition-colors text-cyan-400 hover:text-cyan-300"
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link 
                href="/blog"
                className="px-8 py-3 transition-colors rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer - Server Rendered */}
      <footer className="px-4 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            #TreeFitty | #Webb3Fitty | #Web3
          </p>
          <p className="text-gray-400">
            © 2025 Webb3Fitty. Crafting legendary digital experiences.
          </p>
        </div>
      </footer>
    </main>
  )
}
