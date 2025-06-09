# Epic 3D Portfolio

A legendary 3D portfolio website built with Next.js, Three.js, and Sanity CMS. Experience your projects and blog posts in an immersive galaxy-themed environment.

## 🌟 Features

- **Enhanced 3D Neural Environment**: Navigate through an immersive "brain-universe"
- **Immersive Navigation**: Smooth camera transitions between sections
- **CMS Integration**: Sanity CMS for easy content management
- **Responsive Design**: Works beautifully on all devices
- **Blog System**: Full-featured blog with rich content support
- **Project Showcase**: Display your projects with detailed case studies
- **Performance Optimized**: Adaptive rendering with LOD and performance monitoring
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Three.js** - 3D graphics library
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

### Backend & CMS
- **Sanity Studio** - Headless CMS for content management
- **Sanity Client** - API client for fetching content
- **Portable Text** - Rich text content format

### Performance & DevX
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Sharp** - Image optimization
- **Bundle Analyzer** - Bundle size analysis

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account (free at [sanity.io](https://sanity.io))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd epic-3d-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Sanity project details:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_api_token (optional, for preview mode)
   ```

4. **Set up Sanity CMS**
   ```bash
   # Create a new Sanity project
   npx sanity init --project-id your_project_id --dataset production
   
   # Or use existing project
   npm run sanity
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
epic-3d-portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── blog/              # Blog pages
│   │   │   └── [slug]/        # Individual blog posts
│   │   ├── explore/           # Project showcase pages
│   │   │   └── [slug]/        # Individual project pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── 3d/               # Three.js components
│   │   │   ├── Galaxy.tsx     # Main 3D scene
│   │   │   ├── Starfield.tsx  # Particle effects
│   │   │   └── ...
│   │   ├── blog/             # Blog-related components
│   │   ├── explore/          # Project-related components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utilities and configurations
│   │   ├── hooks/            # Custom React hooks
│   │   ├── sanity/           # Sanity client and queries
│   │   └── utils/            # Helper functions
│   └── types/                # TypeScript type definitions
├── sanity/                   # Sanity CMS configuration
│   ├── schemas/              # Content schemas
│   └── sanity.config.ts      # Sanity configuration
├── public/                   # Static assets
└── package.json
```

## 🎨 Customization

### Styling
The project uses Tailwind CSS with custom galaxy-themed colors defined in `globals.css`. You can modify the color scheme by updating the CSS variables:

```css
:root {
  --galaxy-purple: #8B5CF6;
  --galaxy-cyan: #06B6D4;
  --galaxy-amber: #F59E0B;
  /* Add your colors */
}
```

### 3D Scene
Camera positions and animations are configured in `src/lib/utils/constants.ts`. Modify the `CAMERA_CONFIGS` object to change navigation behavior:

```typescript
export const CAMERA_CONFIGS = {
  HOME: {
    position: [0, 0, 10],
    target: [0, 0, 0],
  },
  // Add your camera positions
}
```

### Content Schema
Add new content types by creating schema files in `sanity/schemas/`. The CMS supports:
- Blog posts with rich content
- Project showcases with galleries
- Categories and tags
- Author profiles
- Site settings

## 📝 Content Management

### Adding Blog Posts
1. Navigate to your Sanity Studio (usually `localhost:3333`)
2. Create a new blog post
3. Add title, content, categories, and featured image
4. Publish to see it on your site

### Adding Projects
1. Create a new project in Sanity Studio
2. Add project details, technologies, links, and metrics
3. Upload screenshots and documentation
4. Publish to showcase on your site

### Customizing Navigation
The 3D navigation planets are configured in `NavigationPlanets.tsx`. You can add new sections or modify existing ones.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The project works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## ⚡ Performance

The portfolio includes several performance optimizations:
- **Adaptive Quality**: Automatically adjusts 3D quality based on device
- **Lazy Loading**: Components load only when needed
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Code splitting for optimal loading
- **Reduced Motion**: Respects user's motion preferences

## 🎯 SEO & Analytics

- **Meta Tags**: Dynamic meta tags for each page
- **Structured Data**: JSON-LD for better search engine understanding
- **Sitemap**: Automatic sitemap generation
- **Analytics Ready**: Google Analytics integration ready

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity` - Start Sanity Studio

### Environment Variables
```env
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional
SANITY_API_TOKEN=your_token
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For the amazing 3D library
- **React Three Fiber** - For making Three.js + React seamless
- **Sanity** - For the excellent headless CMS
- **Vercel** - For the fantastic deployment platform
- **Next.js Team** - For the powerful React framework

## 🐛 Troubleshooting

### Common Issues

**3D Scene Not Loading**
- Check if WebGL is supported in your browser
- Ensure Three.js dependencies are properly installed
- Check browser console for Three.js errors

**Sanity Content Not Showing**
- Verify environment variables are correct
- Check if Sanity project is published
- Ensure CORS settings in Sanity allow your domain

**Build Errors**
- Clear `.next` folder and rebuild
- Check TypeScript errors
- Verify all dependencies are installed

**Performance Issues**
- Reduce particle count in constants
- Disable post-processing effects
- Check if hardware acceleration is enabled

### Getting Help

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/epic-3d-portfolio/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/epic-3d-portfolio/discussions)

---

**Built with ❤️ by Webb3Fitty**

*Crafting legendary digital experiences that bridge cutting-edge technology with human creativity.*
