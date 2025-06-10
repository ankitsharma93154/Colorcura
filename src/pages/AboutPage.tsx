import React from 'react';
import { Palette, Mail, Twitter, Linkedin, Eye, Layout, Lightbulb, ExternalLink, Volume2, Type } from 'lucide-react';

const AboutContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <header className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img
                  src="/colorcura-icon2.webp"
                  alt="Colorcura Logo"
                  className="h-24 w-24 object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              ColorCura
            </h1>
            <p className="text-xl text-gray-600 font-medium bg-white/60 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/30 shadow-lg inline-block">
              Visualize Roles. Preview UIs. Pick Better Colors.
            </p>
          </header>
          
          {/* Enhanced About Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center">
              About This Project
            </h2>
            
            <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl mb-8">
                <p className="text-2xl mb-8 font-medium">
                  When I started creating websites, one of the hardest things wasn't the code — it was picking the <strong className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">right color combinations</strong>.
                </p>
                
                <p className="mb-8 text-lg">
                  I'd often browse palettes on ColorHunt (which are amazing), but when I applied them directly to a UI, they rarely looked as good as I imagined. The problem? I couldn't <strong>visualize</strong> how those colors would work together in a real interface. There were no hints, no direction — just isolated hex codes.
                </p>
                
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-lg p-8 rounded-2xl border border-indigo-200/50 mb-8 shadow-lg">
                  <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-0">
                    That frustration sparked an idea: <strong>What if there was a tool that gave you not just colors — but context?</strong>
                  </p>
                </div>
                
                <p className="mb-8 text-lg font-medium text-center">This site was born from that idea.</p>
              </div>
              
              {/* Enhanced Feature Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Palette className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">Curated 4-color palettes</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    With a focus on real-world UI usage, each palette is carefully selected for practical application.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">Live UI mockups</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    See how each color looks when applied to text, buttons, backgrounds, and more in real-time.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-yellow-800 bg-clip-text text-transparent">Suggested color roles</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Get intelligent suggestions like "Heading", "Accent", or "Background" to guide your choices — fully editable, of course.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Layout className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">Gradient generator</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Create beautiful gradients with CSS export functionality for seamless integration.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-xl p-8 rounded-2xl border border-indigo-200/50 shadow-xl">
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Designed to let you experiment, visualize, and customize your own combinations — quickly and intuitively.
                </p>
                <p className="text-xl font-semibold bg-gradient-to-r from-indigo-800 to-blue-800 bg-clip-text text-transparent mb-0">
                  It's a tool I wish I had earlier — and I hope it helps you too.
                </p>
              </div>
            </div>
          </section>

          {/* Other Projects Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center flex items-center justify-center">
              <ExternalLink className="mr-4 h-10 w-10 text-indigo-600" />
              Other Projects by Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Volume2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                    <a 
                      href="https://quickpronounce.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-700 transition-colors flex items-center gap-2"
                    >
                      QuickPronounce
                      <ExternalLink size={18} />
                    </a>
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Instant audio pronunciation for any English word with American, British, Australian & Indian accents. Includes meanings, phonetics, examples, and speed controls.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="flex items-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Type className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                    <a 
                      href="https://lushfonts.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-700 transition-colors flex items-center gap-2"
                    >
                      LushFonts
                      <ExternalLink size={18} />
                    </a>
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Generate fancy text in various font styles instantly with customizable borders and themed emojis - perfect for social media and design.
                </p>
              </div>
            </div>
          </section>

          {/* Enhanced Contact Section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center flex items-center justify-center">
              <Mail className="mr-4 h-10 w-10 text-indigo-600" />
              Contact
            </h2>
            
            <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-xl p-12 rounded-2xl border border-gray-200/50 shadow-2xl">
              <p className="text-xl text-gray-700 mb-12 text-center leading-relaxed">
                Have feedback, ideas, or just want to say hi? Feel free to reach out:
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <a 
                  href="mailto:hello.colorcura@gmail.com" 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-110 group"
                >
                  <Mail className="h-12 w-12 text-indigo-600 group-hover:text-indigo-700 transition-colors mb-4 group-hover:scale-110  duration-300" />
                  <span className="text-lg font-semibold text-gray-700">Email</span>
                </a>
                
                <a 
                  href="https://twitter.com/AnkitKumar11451" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-110 group"
                >
                  <Twitter className="h-12 w-12 text-blue-500 group-hover:text-blue-600 transition-colors mb-4 group-hover:scale-110  duration-300" />
                  <span className="text-lg font-semibold text-gray-700">Twitter</span>
                </a>
                
                <a 
                  href="https://linkedin.com/in/ankitkumar11451" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-110 group"
                >
                  <Linkedin className="h-12 w-12 text-blue-700 group-hover:text-blue-800 transition-colors mb-4 group-hover:scale-110  duration-300" />
                  <span className="text-lg font-semibold text-gray-700">LinkedIn</span>
                </a>
              </div>
            </div>
          </section>
          
          {/* Enhanced Why Color Selection Matters Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center">
              Why Color Selection Matters in Web Design
            </h2>
            
            <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl mb-12">
                <p className="mb-8 text-lg">
                  Color is more than just aesthetics in web design — it's a powerful communication tool that affects user behavior, brand perception, and accessibility. Studies show that users form opinions about websites within 50 milliseconds, and color plays a crucial role in that split-second judgment.
                </p>
                
                <p className="mb-8 text-lg">
                  The challenge for designers and developers isn't just finding beautiful colors, but understanding how those colors work together in a functional interface. A palette that looks stunning in isolation might fail when applied to buttons, text, backgrounds, and interactive elements.
                </p>
              </div>
              
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent text-center">
                Common Color Selection Challenges
              </h3>
              
              {/* Enhanced Challenge Cards */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-xl p-8 rounded-2xl border border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <h4 className="font-bold text-red-800 mb-4 text-xl">Contrast Issues</h4>
                  <p className="text-red-700 leading-relaxed">
                    Many designers struggle with ensuring sufficient contrast ratios for accessibility while maintaining visual appeal.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-xl p-8 rounded-2xl border border-orange-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <h4 className="font-bold text-orange-800 mb-4 text-xl">Context Blindness</h4>
                  <p className="text-orange-700 leading-relaxed">
                    Colors that work in one context may fail in another — what looks good as a background might be terrible for text.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50/80 to-yellow-100/80 backdrop-blur-xl p-8 rounded-2xl border border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <h4 className="font-bold text-yellow-800 mb-4 text-xl">Brand Consistency</h4>
                  <p className="text-yellow-700 leading-relaxed">
                    Maintaining consistent color usage across different UI elements while ensuring functionality can be challenging.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-xl p-8 rounded-2xl border border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <h4 className="font-bold text-green-800 mb-4 text-xl">Decision Paralysis</h4>
                  <p className="text-green-700 leading-relaxed">
                    With millions of color combinations possible, choosing the right palette can become overwhelming.
                  </p>
                </div>
              </div>
              
              {/* Enhanced Solution Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl mb-12">
                <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent text-center">
                  The Colorcura Solution
                </h3>
                
                <p className="mb-8 text-lg">
                  Colorcura addresses these challenges by providing a comprehensive color selection and visualization platform. Instead of guessing how colors will work together, you can see immediate previews in realistic UI contexts.
                </p>
                
                <p className="mb-8 text-lg">
                  Our curated palettes are specifically chosen for web and app interfaces, with each color tested across different use cases. The intelligent role suggestions help you understand which colors work best for headings, body text, buttons, backgrounds, and accent elements.
                </p>
              </div>
            </div>
          </section>
          
          {/* Enhanced FAQ Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Is Colorcura free to use?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, Colorcura is completely free to use. All features including palette generation, UI previews, and CSS export are available without any cost or registration requirements.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Can I use these colors in commercial projects?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Absolutely! All color palettes generated by Colorcura can be used in both personal and commercial projects without any restrictions or attribution requirements.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How often are new palettes added?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We continuously curate and add new color palettes based on current design trends, user feedback, and seasonal themes. Check back regularly for fresh inspiration.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Do you support other color formats besides hex?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, Colorcura displays colors in hex format and rgb, but we're working on adding support for HSL, and other color formats based on user demand.
                </p>
              </div>
            </div>
          </section>
          
          
        </div>
      </div>
    </div>
  );
};

export default AboutContactPage;