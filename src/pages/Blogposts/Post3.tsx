import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Post3: React.FC = () => {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://colorcura.site/blog/css-gradients-guide" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {/* Header Image */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <img 
            src="/images/Header3.webp" 
            alt="CSS Gradients Header" 
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Title and Metadata */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Guide to CSS Gradients (Linear, Radial, Conic)
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                CSS
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Web Development
              </span>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                Design
              </span>
              <span className="text-sm">Published on March 22, 2025</span>
              <span className="text-sm">18 min read</span>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                CSS gradients are one of the most powerful tools in modern web design, allowing you to create stunning visual effects without relying on images. From subtle background transitions to bold design statements, gradients can transform your website's appearance while maintaining fast loading times and crisp displays on all devices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This comprehensive guide covers everything you need to know about CSS gradients, including syntax, advanced techniques, browser compatibility, and real-world applications with copy-paste code examples.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Are CSS Gradients?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                CSS gradients are smooth transitions between two or more colors, created entirely with CSS code. They're rendered by the browser as background images, which means they're vector-based, infinitely scalable, and don't require HTTP requests like traditional image files.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Types of CSS Gradients</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-b from-blue-500 to-purple-600 p-6 rounded-lg text-white text-center">
                  <h4 className="text-lg font-semibold mb-2">Linear Gradients</h4>
                  <p className="text-sm opacity-90">Colors transition along a straight line</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-6 rounded-lg text-white text-center">
                  <h4 className="text-lg font-semibold mb-2">Radial Gradients</h4>
                  <p className="text-sm opacity-90">Colors radiate outward from a central point</p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-6 rounded-lg text-white text-center">
                  <h4 className="text-lg font-semibold mb-2">Conic Gradients</h4>
                  <p className="text-sm opacity-90">Colors transition around a circle</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Benefits of CSS Gradients</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Performance:</strong> No additional HTTP requests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Scalability:</strong> Vector-based, perfect at any resolution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Customization:</strong> Fully customizable with CSS variables</span>
                  </li>
                </ul>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Accessibility:</strong> Better than images for screen readers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>SEO:</strong> Faster loading improves search rankings</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Linear Gradients</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Linear gradients create smooth color transitions along a straight line. They're the most commonly used gradient type and perfect for backgrounds, buttons, and overlays.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Basic Linear Gradient Syntax</h3>
              <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`background: linear-gradient(direction, color1, color2, ...);`}
                </pre>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Simple Linear Gradients</h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Top-to-Bottom Gradient</h4>
                  <div className="h-24 bg-gradient-to-b from-red-400 to-teal-400 rounded-lg mb-4"></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-basic {
  background: linear-gradient(#ff6b6b, #4ecdc4);
  height: 200px;
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Left-to-Right Gradient</h4>
                  <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mb-4"></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-horizontal {
  background: linear-gradient(to right, #667eea, #764ba2);
  height: 200px;
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Diagonal Gradient</h4>
                  <div className="h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg mb-4"></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-diagonal {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  height: 200px;
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Radial Gradients</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Radial gradients radiate outward from a central point, creating circular or elliptical color transitions perfect for spotlights, buttons, and artistic effects.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Basic Radial Gradient Syntax</h3>
              <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`background: radial-gradient(shape size at position, color1, color2, ...);`}
                </pre>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Circular Gradient</h4>
                  <div className="h-24 bg-gradient-radial from-red-400 to-teal-400 rounded-lg mb-4" style={{background: 'radial-gradient(circle, #ff6b6b, #4ecdc4)'}}></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-radial-basic {
  background: radial-gradient(#ff6b6b, #4ecdc4);
  height: 200px;
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Spotlight Effect</h4>
                  <div className="h-24 rounded-lg mb-4" style={{background: 'radial-gradient(circle 100px at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(0, 0, 0, 0.8) 100%)'}}></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-spotlight {
  background: radial-gradient(circle 300px at center,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.4) 30%,
    rgba(0, 0, 0, 0.8) 100%
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Conic Gradients</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Conic gradients are the newest addition to CSS gradients, creating color transitions that rotate around a central point. They're perfect for pie charts, loading spinners, and unique design effects.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Basic Conic Gradient Syntax</h3>
              <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`background: conic-gradient(from angle at position, color1, color2, ...);`}
                </pre>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Rainbow Wheel</h4>
                  <div className="w-24 h-24 mx-auto rounded-full mb-4" style={{background: 'conic-gradient(#ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #0000ff, #7700ff, #ff0000)'}}></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-rainbow-wheel {
  background: conic-gradient(
    #ff0000, #ff7700, #ffff00, #00ff00,
    #0077ff, #0000ff, #7700ff, #ff0000
  );
  border-radius: 50%;
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Pie Chart Effect</h4>
                  <div className="w-24 h-24 mx-auto rounded-full mb-4" style={{background: 'conic-gradient(#ff6b6b 0deg 120deg, #4ecdc4 120deg 200deg, #45b7d1 200deg 280deg, #f9ca24 280deg 360deg)'}}></div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.gradient-pie-chart {
  background: conic-gradient(
    #ff6b6b 0deg 120deg,
    #4ecdc4 120deg 200deg,
    #45b7d1 200deg 280deg,
    #f9ca24 280deg 360deg
  );
  border-radius: 50%;
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Practical Gradient Applications</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Button Gradients</h3>
              <div className="space-y-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Modern Button Styles</h4>
                  <div className="flex gap-4 mb-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                      Gradient Button
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                      Hover Effect
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
{`.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Text Gradients</h3>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Gradient Text Effect</h4>
                <div className="mb-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Gradient Text
                  </h2>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`.text-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 2rem;
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Browser Compatibility and Fallbacks</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Browser Support</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Linear Gradients</h4>
                  <p className="text-green-700 text-sm">Supported in all modern browsers (IE10+)</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Radial Gradients</h4>
                  <p className="text-green-700 text-sm">Supported in all modern browsers (IE10+)</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">Conic Gradients</h4>
                  <p className="text-yellow-700 text-sm">Modern browsers only (Chrome 69+, Firefox 83+, Safari 12.1+)</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vendor Prefixes</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For maximum compatibility, especially with older browsers:
              </p>
              <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`.gradient-prefixed {
  background: #667eea; /* Fallback */
  background: -webkit-linear-gradient(45deg, #667eea, #764ba2);
  background: -moz-linear-gradient(45deg, #667eea, #764ba2);
  background: -o-linear-gradient(45deg, #667eea, #764ba2);
  background: linear-gradient(45deg, #667eea, #764ba2);
}`}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Performance Optimization</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">GPU Acceleration</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Use transform and opacity for smooth gradient animations:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-xs">
{`.gradient-optimized {
  background: linear-gradient(45deg, #667eea, #764ba2);
  will-change: transform;
}

.gradient-optimized:hover {
  transform: scale(1.05);
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">CSS Custom Properties</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Use CSS variables for dynamic gradients:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-xs">
{`:root {
  --gradient-start: #667eea;
  --gradient-end: #764ba2;
}

.gradient-variable {
  background: linear-gradient(45deg, 
    var(--gradient-start), 
    var(--gradient-end)
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Conclusion</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                CSS gradients are an incredibly powerful tool for modern web design, offering endless possibilities for creating beautiful, performant visual effects. From simple linear gradients to complex conic patterns, mastering these techniques will significantly enhance your design capabilities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Remember to always consider browser compatibility and provide appropriate fallbacks for older browsers. Use gradients strategically to enhance your design without overwhelming users, and always test performance on various devices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                As you experiment with different gradient techniques, keep accessibility in mind and ensure sufficient contrast ratios for text readability. With practice and creativity, CSS gradients can become one of your most valuable design tools.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
              <p className="text-lg font-medium">
                Ready to experiment with CSS gradients? Use ColorCura to preview how different gradient combinations look on real UI components and find the perfect gradient for your next project.
              </p>
            </div>
          </article>

          {/* Back to Blog Link */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all blogs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post3;

