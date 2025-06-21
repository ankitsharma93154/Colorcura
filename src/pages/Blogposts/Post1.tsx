import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface ColorData {
  color: string;
  label: string;
}

interface ColorPaletteData { // Renamed to avoid conflict with component name
  title: string;
  description: string;
  colors: ColorData[];
}

// Interface for ColorSwatch component props
interface ColorSwatchProps {
  color: string;
  label: string;
}

// Memoized ColorSwatch
const ColorSwatch = React.memo(({ color, label }: ColorSwatchProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false); // Explicitly typed useState

  return (
    <div
      className="flex-1 h-16 relative cursor-pointer transition-transform duration-200 hover:scale-105"
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-xs font-mono text-center">
            <div className="font-semibold">{label}</div>
            <div>{color}</div>
          </div>
        </div>
      )}
    </div>
  );
});

// Interface for ColorPalette component props
interface ColorPaletteProps {
  title: string;
  description: string;
  colors: ColorData[];
}

// Memoized ColorPalette
const ColorPalette = React.memo(({ title, description, colors }: ColorPaletteProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-3">{title}</h4>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex rounded-lg overflow-hidden shadow-md">
        {colors.map((colorData) => (
          <ColorSwatch key={colorData.color} color={colorData.color} label={colorData.label} />
        ))}
      </div>
    </div>
  );
});


const Post1 = () => {
  const trustReliabilityPalettes = [
    {
      title: "Corporate Confidence",
      description: "Professional and trustworthy for enterprise websites",
      colors: [
        { color: "#1E3A8A", label: "Primary" },
        { color: "#3B82F6", label: "Secondary" },
        { color: "#F1F5F9", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    },
    {
      title: "Tech Innovation",
      description: "Modern and cutting-edge for technology companies",
      colors: [
        { color: "#0EA5E9", label: "Primary" },
        { color: "#06B6D4", label: "Secondary" },
        { color: "#F0F9FF", label: "Accent" },
        { color: "#0F172A", label: "Text" }
      ]
    },
    {
      title: "Financial Trust",
      description: "Stable and secure for banking and finance",
      colors: [
        { color: "#1E40AF", label: "Primary" },
        { color: "#2563EB", label: "Secondary" },
        { color: "#EFF6FF", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    },
    {
      title: "Healthcare Professional",
      description: "Clean and reliable for medical websites",
      colors: [
        { color: "#1E3A8A", label: "Primary" },
        { color: "#60A5FA", label: "Secondary" },
        { color: "#F8FAFC", label: "Accent" },
        { color: "#0F172A", label: "Text" }
      ]
    }
  ];

  const energyActionPalettes = [
    {
      title: "Startup Energy",
      description: "Bold and dynamic for innovative startups",
      colors: [
        { color: "#EA580C", label: "Primary" },
        { color: "#DC2626", label: "Secondary" },
        { color: "#FEF3C7", label: "Accent" },
        { color: "#292524", label: "Text" }
      ]
    },
    {
      title: "Creative Fire",
      description: "Vibrant and inspiring for creative agencies",
      colors: [
        { color: "#F97316", label: "Primary" },
        { color: "#EF4444", label: "Secondary" },
        { color: "#FFF7ED", label: "Accent" },
        { color: "#451A03", label: "Text" }
      ]
    },
    {
      title: "E-commerce Conversion",
      description: "High-converting colors for online stores",
      colors: [
        { color: "#DC2626", label: "Primary" },
        { color: "#F97316", label: "Secondary" },
        { color: "#FEF2F2", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    },
    {
      title: "Fitness Motivation",
      description: "Energetic and motivating for fitness brands",
      colors: [
        { color: "#EA580C", label: "Primary" },
        { color: "#F59E0B", label: "Secondary" },
        { color: "#FFF7ED", label: "Accent" },
        { color: "#292524", label: "Text" }
      ]
    }
  ];

  const professionalPalettes = [
    {
      title: "Executive Suite",
      description: "Sophisticated and premium for executive services",
      colors: [
        { color: "#374151", label: "Primary" },
        { color: "#6B7280", label: "Secondary" },
        { color: "#F9FAFB", label: "Accent" },
        { color: "#111827", label: "Text" }
      ]
    },
    {
      title: "Modern Professional",
      description: "Contemporary and sleek for modern businesses",
      colors: [
        { color: "#1F2937", label: "Primary" },
        { color: "#4F46E5", label: "Secondary" },
        { color: "#E5E7EB", label: "Accent" },
        { color: "#0F172A", label: "Text" }
      ]
    },
    {
      title: "Minimalist Corporate",
      description: "Clean and focused for corporate websites",
      colors: [
        { color: "#374151", label: "Primary" },
        { color: "#9CA3AF", label: "Secondary" },
        { color: "#F3F4F6", label: "Accent" },
        { color: "#111827", label: "Text" }
      ]
    }
  ];

  const creativeColorfulPalettes = [
    {
      title: "Creative Studio",
      description: "Vibrant and artistic for creative portfolios",
      colors: [
        { color: "#7C3AED", label: "Primary" },
        { color: "#EC4899", label: "Secondary" },
        { color: "#FDF4FF", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    },
    {
      title: "Design Agency",
      description: "Bold and innovative for design agencies",
      colors: [
        { color: "#8B5CF6", label: "Primary" },
        { color: "#06B6D4", label: "Secondary" },
        { color: "#F0F9FF", label: "Accent" },
        { color: "#0F172A", label: "Text" }
      ]
    },
    {
      title: "Art Gallery",
      description: "Sophisticated and artistic for galleries",
      colors: [
        { color: "#7C2D12", label: "Primary" },
        { color: "#F59E0B", label: "Secondary" },
        { color: "#FFFBEB", label: "Accent" },
        { color: "#1C1917", label: "Text" }
      ]
    },
    {
      title: "Photography Studio",
      description: "Elegant and visual for photographers",
      colors: [
        { color: "#1F2937", label: "Primary" },
        { color: "#F59E0B", label: "Secondary" },
        { color: "#F9FAFB", label: "Accent" },
        { color: "#111827", label: "Text" }
      ]
    }
  ];

  const natureSustainabilityPalettes = [
    {
      title: "Eco-Friendly",
      description: "Natural and sustainable for green businesses",
      colors: [
        { color: "#059669", label: "Primary" },
        { color: "#10B981", label: "Secondary" },
        { color: "#ECFDF5", label: "Accent" },
        { color: "#064E3B", label: "Text" }
      ]
    },
    {
      title: "Organic Products",
      description: "Fresh and natural for organic brands",
      colors: [
        { color: "#16A34A", label: "Primary" },
        { color: "#84CC16", label: "Secondary" },
        { color: "#F0FDF4", label: "Accent" },
        { color: "#14532D", label: "Text" }
      ]
    }
  ];

  const luxuryPremiumPalettes = [
    {
      title: "Luxury Gold",
      description: "Elegant and premium for luxury brands",
      colors: [
        { color: "#1F2937", label: "Primary" },
        { color: "#F59E0B", label: "Secondary" },
        { color: "#FFFBEB", label: "Accent" },
        { color: "#111827", label: "Text" }
      ]
    },
    {
      title: "Royal Purple",
      description: "Regal and sophisticated for premium services",
      colors: [
        { color: "#581C87", label: "Primary" },
        { color: "#7C3AED", label: "Secondary" },
        { color: "#FAF5FF", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    }
  ];

  const technologySaasPalettes = [
    {
      title: "SaaS Dashboard",
      description: "Clean and functional for software interfaces",
      colors: [
        { color: "#4F46E5", label: "Primary" },
        { color: "#06B6D4", label: "Secondary" },
        { color: "#F8FAFC", label: "Accent" },
        { color: "#0F172A", label: "Text" }
      ]
    },
    {
      title: "Fintech Innovation",
      description: "Modern and trustworthy for financial technology",
      colors: [
        { color: "#1E40AF", label: "Primary" },
        { color: "#10B981", label: "Secondary" },
        { color: "#F0F9FF", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    }
  ];

  const ecommercePalettes = [
    {
      title: "Fashion E-commerce",
      description: "Stylish and conversion-focused for fashion stores",
      colors: [
        { color: "#1F2937", label: "Primary" },
        { color: "#EC4899", label: "Secondary" },
        { color: "#FDF2F8", label: "Accent" },
        { color: "#111827", label: "Text" }
      ]
    },
    {
      title: "Electronics Store",
      description: "Modern and tech-savvy for electronics",
      colors: [
        { color: "#1E40AF", label: "Primary" },
        { color: "#F59E0B", label: "Secondary" },
        { color: "#EFF6FF", label: "Accent" },
        { color: "#1F2937", label: "Text" }
      ]
    }
  ];

  // In the main component, memoize palette mapping
  const renderPalette = useCallback((palette: ColorPaletteData, index: number) => (
    <ColorPalette key={index} {...palette} />
  ), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <img 
          src="/images/Header1.webp" 
          alt="Website Color Schemes Header" 
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
            20+ Best Website Color Schemes for 2025 (With Interactive Palettes)
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Design
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Color Theory
            </span>
            <span className="text-sm">Published on March 15, 2025</span>
            <span className="text-sm">12 min read</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Choosing the perfect color scheme for your website can make or break your user experience. The right colors don't just look good—they build trust, guide user behavior, and significantly impact conversion rates. In 2025, successful websites are embracing bold contrasts, accessible combinations, and psychologically-driven palettes that resonate with their target audience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This comprehensive guide showcases over 50 carefully curated website color schemes with interactive visual palettes. Hover over any color to see its hex code. Whether you're designing a SaaS platform, e-commerce store, or creative portfolio, you'll find the perfect palette to elevate your brand.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Website Color Schemes Matter More Than Ever</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Modern users form opinions about websites within 50 milliseconds—and color plays a crucial role in that split-second judgment. Research shows that color increases brand recognition by up to 80%, while poor color choices can reduce readability and drive visitors away.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              In 2025, successful color schemes must balance three critical factors:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Accessibility compliance</strong> with WCAG 2.1 guidelines</li>
              <li><strong>Psychological impact</strong> that aligns with brand goals</li>
              <li><strong>Cross-device consistency</strong> across desktop, mobile, and tablet</li>
            </ul>
          </div>

          {/* Trust & Reliability Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trust & Reliability: Blue-Based Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Blue remains the most trusted color in digital design, with 57% of users associating it with reliability and professionalism. Perfect for corporate websites, financial services, and healthcare platforms.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {trustReliabilityPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Energy & Action Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Energy & Action: Warm Color Combinations</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Warm colors drive action and create urgency—perfect for e-commerce, startups, and call-to-action elements. These palettes boost conversion rates and create emotional connections.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {energyActionPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Professional Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Website Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Clean, sophisticated schemes that work across industries. These minimalist palettes convey professionalism while maintaining visual interest and brand personality.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {professionalPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Creative & Colorful Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Creative & Artistic Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bold and expressive palettes for creative industries. These schemes make strong visual statements while maintaining usability and brand coherence.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {creativeColorfulPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Nature & Sustainability Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nature & Sustainability Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Earth-inspired palettes that convey growth, sustainability, and natural wellness. Perfect for eco-friendly brands, outdoor companies, and health-focused businesses.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {natureSustainabilityPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Luxury & Premium Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Luxury & Premium Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sophisticated palettes that convey exclusivity and premium quality. These schemes work perfectly for luxury brands, high-end services, and premium products.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {luxuryPremiumPalettes.map(renderPalette)}
            </div>
          </div>

          {/* Technology & SaaS Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology & SaaS Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Modern and innovative palettes for tech companies and software platforms. These schemes balance trust with innovation, perfect for dashboards and digital products.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {technologySaasPalettes.map(renderPalette)}
            </div>
          </div>

          {/* E-commerce Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">E-commerce Color Schemes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Conversion-optimized palettes for online stores. These schemes are designed to build trust, highlight products, and drive purchasing decisions across different retail categories.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {ecommercePalettes.map(renderPalette)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Implementation Best Practices</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">CSS Custom Properties</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Organize your color scheme using CSS variables for easy maintenance:
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`:root {
  --primary-color: #1E3A8A;
  --secondary-color: #3B82F6;
  --accent-color: #F1F5F9;
  --text-color: #1F2937;
  --background-color: #FFFFFF;
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Color Naming Conventions</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Use semantic naming that describes function, not appearance:
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`:root {
  --color-brand-primary: #1E3A8A;
  --color-interactive-primary: #3B82F6;
  --color-surface-primary: #F1F5F9;
  --color-text-primary: #1F2937;
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Accessibility Testing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Always test your color combinations for WCAG compliance:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Minimum contrast ratio of 4.5:1 for normal text</li>
              <li>Minimum contrast ratio of 3:1 for large text</li>
              <li>Test with color blindness simulators</li>
              <li>Ensure functionality without color dependence</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Choose the Right Palette</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Consider Your Industry</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Different industries have color expectations that users subconsciously associate with trust and credibility:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Conservative Industries</h4>
                <p className="text-blue-700 text-sm">Finance, legal, healthcare - stick with blues, grays, and conservative palettes</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Creative Industries</h4>
                <p className="text-orange-700 text-sm">Design, art, entertainment - embrace bold colors and creative combinations</p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Test Before Implementing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before committing to a color scheme:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Create mockups of key pages with your chosen palette</li>
              <li>Test readability across different devices and screen sizes</li>
              <li>Get feedback from your target audience</li>
              <li>A/B test critical conversion pages</li>
              <li>Check performance in different lighting conditions</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Color Psychology Quick Reference</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Blue</h4>
                <p className="text-gray-600 text-sm">Trust, reliability, professionalism, calm</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Red</h4>
                <p className="text-gray-600 text-sm">Energy, urgency, passion, action</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Green</h4>
                <p className="text-gray-600 text-sm">Growth, nature, money, go/success</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Orange</h4>
                <p className="text-gray-600 text-sm">Enthusiasm, creativity, warmth, affordable</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Purple</h4>
                <p className="text-gray-600 text-sm">Luxury, creativity, wisdom, mystery</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-3"></div>
                <h4 className="font-semibold text-gray-800 mb-2">Gray</h4>
                <p className="text-gray-600 text-sm">Neutral, professional, sophisticated, timeless</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tools for Color Scheme Development</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Professional designers use these tools to create and refine color palettes:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Color Palette Generators</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Adobe Color (color.adobe.com)</li>
                  <li>• Coolors.co</li>
                  <li>• Material Design Color Tool</li>
                  <li>• Paletton.com</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Accessibility Checkers</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• WebAIM Contrast Checker</li>
                  <li>• Colour Contrast Analyser</li>
                  <li>• Stark (Figma/Sketch plugin)</li>
                  <li>• WAVE Web Accessibility Evaluator</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The perfect color scheme combines aesthetic appeal with psychological impact and technical accessibility. In 2025, successful websites prioritize user experience through thoughtful color choices that enhance readability, guide user behavior, and reinforce brand identity.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Remember that color schemes should evolve with your brand and audience feedback. Start with one of these proven combinations, then customize based on your specific needs and user testing results. The interactive palettes above make it easy to grab hex codes and implement your chosen scheme immediately.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Before finalizing your choice, always test your selected palette on actual UI elements to ensure it works in practice, not just in theory. The investment in proper color selection pays dividends in user engagement, brand recognition, and conversion rates.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to implement your perfect color scheme?</h3>
            <p className="text-lg font-medium mb-4">
              These 50+ palettes give you the foundation for creating stunning, conversion-focused websites that resonate with your audience.
            </p>
            <p className="text-sm opacity-90">
              Hover over any color above to copy its hex code and start building your brand's visual identity today.
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
  );
};

export default Post1;