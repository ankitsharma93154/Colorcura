import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 'post1',
      title: '20+ Best Website Color Schemes for 2025 (With Interactive Palettes)',
      excerpt: 'Explore 20+ diverse and modern website color schemes for 2025, each with interactive palettes and real-world inspiration. Perfect for SaaS, e-commerce, portfolios, and more.',
      thumbnail: '/images/Thumbnail1.webp',
      slug: '/blog/website-color-schemes-2025',
      category: 'Design',
      readTime: '12 min read',
      publishDate: 'March 15, 2025',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 'post2',
      title: 'Website Color Schemes Psychology: How Colors Affect Conversions',
      excerpt: 'Explore the science behind color psychology in web design. Learn how strategic color choices can boost conversions by up to 200% and discover the psychological triggers that influence user behavior and decision-making.',
      thumbnail: '/images/Thumbnail2.webp',
      slug: '/blog/color-psychology-conversions',
      category: 'Psychology',
      readTime: '15 min read',
      publishDate: 'March 18, 2025',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'post3',
      title: 'Complete Guide to CSS Gradients (Linear, Radial, Conic)',
      excerpt: 'Master CSS gradients with this comprehensive guide covering linear, radial, and conic gradients. Includes syntax, advanced techniques, browser compatibility, and real-world applications with copy-paste code examples.',
      thumbnail: '/images/Thumbnail3.webp',
      slug: '/blog/css-gradients-guide',
      category: 'Development',
      readTime: '18 min read',
      publishDate: 'March 22, 2025',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600'
    }
  ];

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://colorcura.site/blog" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Colorcura Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the latest insights on color theory, design psychology, and web development. 
                Learn how to create stunning color palettes that drive conversions and enhance user experience.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid gap-8 md:gap-12">
            {blogPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    {/* <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-90`}></div> */}
                    <img 
                      src={post.thumbnail} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="space-y-6">
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <time>{post.publishDate}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                        <Link to={post.slug} className="hover:underline">
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="pt-4">
                        <Link 
                          to={post.slug}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 group/link"
                        >
                          Read full article
                          <svg 
                            className="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>


          {/* Featured Tools Section */}
          <div className="mt-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Try Colorcura Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Test your color schemes on live UI components and see how they perform 
                before implementing them in your projects.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Live UI Preview</h3>
                <p className="text-gray-600">
                  See your color schemes applied to real UI components instantly.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility Check</h3>
                <p className="text-gray-600">
                  Ensure your color combinations meet WCAG accessibility standards.
                </p>
              </div>

              <div className="text-center group md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Gradients</h3>
                <p className="text-gray-600">
                  Generate beautiful CSS gradients with our intuitive gradient editor.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                         <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg">
              Try Colorcura Now
            </button>
                      </Link>
           
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;

