import React from 'react';
import { Palette, Mail, Twitter, Linkedin, Eye, Layout, Lightbulb } from 'lucide-react';

const AboutContactPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
            src="/colorcura-icon2.png"
            alt="Colorcura Logo"
            className="h-20 w-20 object-contain drop-shadow-lg"
            />
                </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900 ">ColorCura</h1>
            <p className="text-xl text-gray-600 font-medium">
              Visualize Roles. Preview UIs. Pick Better Colors.
            </p>
          </header>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
              About This Project
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                When I started creating websites, one of the hardest things wasn't the code — it was picking the <strong>right color combinations</strong>.
              </p>
              
              <p className="mb-6">
                I'd often browse palettes on ColorHunt (which are amazing), but when I applied them directly to a UI, they rarely looked as good as I imagined. The problem? I couldn't <strong>visualize</strong> how those colors would work together in a real interface. There were no hints, no direction — just isolated hex codes.
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 mb-8 shadow-sm">
                <p className="text-xl font-semibold text-indigo-700 mb-0">
                  That frustration sparked an idea: <strong>What if there was a tool that gave you not just colors — but context?</strong>
                </p>
              </div>
              
              <p className="mb-8">This site was born from that idea.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Palette className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Curated 4-color palettes</h3>
                  </div>
                  <p className="text-gray-600">
                    With a focus on real-world UI usage, each palette is carefully selected for practical application.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Eye className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Live UI mockups</h3>
                  </div>
                  <p className="text-gray-600">
                    See how each color looks when applied to text, buttons, backgrounds, and more in real-time.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Lightbulb className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Suggested color roles</h3>
                  </div>
                  <p className="text-gray-600">
                    Get intelligent suggestions like "Heading", "Accent", or "Background" to guide your choices — fully editable, of course.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Layout className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Gradient generator</h3>
                  </div>
                  <p className="text-gray-600">
                    Create beautiful gradients with CSS export functionality for seamless integration.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 mb-8 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Designed to let you experiment, visualize, and customize your own combinations — quickly and intuitively.
                </p>
                <p className="text-lg font-semibold text-indigo-800 mb-0">
                  It's a tool I wish I had earlier — and I hope it helps you too.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Why Color Selection Matters in Web Design</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6">
                Color is more than just aesthetics in web design — it's a powerful communication tool that affects user behavior, brand perception, and accessibility. Studies show that users form opinions about websites within 50 milliseconds, and color plays a crucial role in that split-second judgment.
              </p>
              
              <p className="mb-6">
                The challenge for designers and developers isn't just finding beautiful colors, but understanding how those colors work together in a functional interface. A palette that looks stunning in isolation might fail when applied to buttons, text, backgrounds, and interactive elements.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Common Color Selection Challenges</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm">
                  <h4 className="font-bold text-red-800 mb-2">Contrast Issues</h4>
                  <p className="text-red-700">
                    Many designers struggle with ensuring sufficient contrast ratios for accessibility while maintaining visual appeal.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 shadow-sm">
                  <h4 className="font-bold text-orange-800 mb-2">Context Blindness</h4>
                  <p className="text-orange-700">
                    Colors that work in one context may fail in another — what looks good as a background might be terrible for text.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 shadow-sm">
                  <h4 className="font-bold text-yellow-800 mb-2">Brand Consistency</h4>
                  <p className="text-yellow-700">
                    Maintaining consistent color usage across different UI elements while ensuring functionality can be challenging.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
                  <h4 className="font-bold text-green-800 mb-2">Decision Paralysis</h4>
                  <p className="text-green-700">
                    With millions of color combinations possible, choosing the right palette can become overwhelming.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">The Colorcura Solution</h3>
              
              <p className="mb-6">
                Colorcura addresses these challenges by providing a comprehensive color selection and visualization platform. Instead of guessing how colors will work together, you can see immediate previews in realistic UI contexts.
              </p>
              
              <p className="mb-6">
                Our curated palettes are specifically chosen for web and app interfaces, with each color tested across different use cases. The intelligent role suggestions help you understand which colors work best for headings, body text, buttons, backgrounds, and accent elements.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Features for Modern Designers</h3>
              
              <p className="mb-6">
                Modern web design requires tools that understand both aesthetics and functionality. Colorcura bridges this gap by offering features specifically designed for today's design challenges:
              </p>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Accessibility-first approach:</strong> All color combinations are tested for WCAG compliance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Mobile-responsive previews:</strong> See how your colors work across different screen sizes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Export functionality:</strong> Generate CSS, Sass, and design system tokens</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Version control:</strong> Save and compare different color variations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Team collaboration:</strong> Share palettes with team members and clients</span>
                  </li>
                </ul>
              </div>
              
              <p className="mb-6">
                Whether you're building a startup's brand identity, designing an e-commerce platform, or creating a portfolio website, Colorcura provides the tools and context you need to make confident color decisions.
              </p>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is Colorcura free to use?</h3>
                <p className="text-gray-700">
                  Yes, Colorcura is completely free to use. All features including palette generation, UI previews, and CSS export are available without any cost or registration requirements.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I use these colors in commercial projects?</h3>
                <p className="text-gray-700">
                  Absolutely! All color palettes generated by Colorcura can be used in both personal and commercial projects without any restrictions or attribution requirements.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How often are new palettes added?</h3>
                <p className="text-gray-700">
                  We continuously curate and add new color palettes based on current design trends, user feedback, and seasonal themes. Check back regularly for fresh inspiration.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Do you support other color formats besides hex?</h3>
                <p className="text-gray-700">
                  Yes, Colorcura displays colors in hex format and rgb , but we're working on adding support for HSL, and other color formats based on user demand.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
              <Mail className="mr-3 h-8 w-8 text-indigo-600" />
              Contact
            </h2>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-lg text-gray-700 mb-8 text-center">
                Have feedback, ideas, or just want to say hi? Feel free to reach out:
              </p>
              
              <div className="flex justify-center gap-8">
                <a 
                  href="mailto:hello.colorcura@gmail.com" 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Mail className="h-8 w-8 mx-auto text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </a>
                
                <a 
                  href="https://twitter.com/AnkitKumar11451" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Twitter className="h-8 w-8 mx-auto text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/ankit-kumar-sharma-99698028a/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Linkedin className="h-8 w-8 mx-auto text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </a>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  I'm always open to feedback and improvements — let's build better tools for developers, together.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">About Color Theory and Design</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6">
                Understanding color theory is fundamental to creating effective digital experiences. Colors evoke emotions, convey meaning, and guide user actions. In web design, strategic color use can increase conversion rates by up to 80% and improve user engagement significantly.
              </p>
              
              <p className="mb-6">
                The psychology of color plays a crucial role in user interface design. Blue conveys trust and professionalism, making it popular for financial and corporate websites. Green suggests growth and nature, often used for environmental or health-related brands. Red creates urgency and excitement, commonly used for call-to-action buttons and sales promotions.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Color Harmony in Digital Design</h3>
              
              <p className="mb-6">
                Creating harmonious color schemes involves understanding relationships between colors on the color wheel. Complementary colors (opposite on the wheel) create high contrast and visual impact. Analogous colors (adjacent on the wheel) create harmony and are pleasing to the eye. Triadic colors (evenly spaced) offer vibrant contrast while maintaining balance.
              </p>
              
              <p className="mb-6">
                Modern web design often employs monochromatic color schemes with subtle variations in shade and tint. This approach creates sophisticated, cohesive designs that are easy on the eyes and work well across different devices and screen sizes.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Accessibility and Inclusive Design</h3>
              
              <p className="mb-6">
                Color accessibility is not just good practice — it's essential for inclusive design. Approximately 8% of men and 0.5% of women have some form of color vision deficiency. Designing with accessibility in mind ensures your website is usable by everyone, regardless of their visual abilities.
              </p>
              
              <p className="mb-6">
                WCAG (Web Content Accessibility Guidelines) provides specific contrast ratios that ensure text remains readable against background colors. Normal text requires a contrast ratio of at least 4.5:1, while large text needs at least 3:1. These guidelines help ensure that people with low vision or color blindness can effectively use your website.
              </p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trends in Modern Color Design</h3>
              
              <p className="mb-6">
                Contemporary web design embraces both minimalist and bold approaches to color. Dark mode has become increasingly popular, requiring designers to think about color palettes that work in both light and dark contexts. Gradient backgrounds and subtle color transitions add depth and visual interest without overwhelming the content.
              </p>
              
              <p className="mb-6">
                Sustainable design practices are also influencing color choices. Darker backgrounds can reduce energy consumption on OLED screens, while carefully chosen color palettes can extend battery life on mobile devices. These considerations show how color choices can impact both user experience and environmental responsibility.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default AboutContactPage;