import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function MVPLandingPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeSocialPost, setActiveSocialPost] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content: "Colmena transformed how our team collaborates. The intuitive interface and powerful features make project management effortless.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "CEO at StartupHub",
      content: "We've tried many project management tools, but Colmena's combination of simplicity and power is unmatched. Our productivity increased by 40%.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Design Lead at CreativeStudio",
      content: "The Markdown support and real-time collaboration features are game-changers. Our designers and developers finally speak the same language.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Operations Director at LogiFlow",
      content: "Colmena's role-based access control gives us the security we need while keeping workflows smooth. Highly recommended!",
      rating: 5
    }
  ];

  const socialPosts = [
    { id: 1, platform: "Twitter", likes: "2.4K" },
    { id: 2, platform: "LinkedIn", likes: "1.8K" },
    { id: 3, platform: "Instagram", likes: "3.1K" },
    { id: 4, platform: "Facebook", likes: "1.5K" },
    { id: 5, platform: "Twitter", likes: "2.9K" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Up to 3 projects",
        "5 team members",
        "Basic task management",
        "Email support",
        "1GB storage",
        "Mobile app access"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: { monthly: 29, annual: 290 },
      description: "For growing teams that need advanced collaboration",
      features: [
        "Unlimited projects",
        "15 team members",
        "Advanced task management",
        "Priority email support",
        "Custom labels & tags",
        "10GB storage",
        "Real-time collaboration",
        "Markdown editor",
        "Custom views & filters"
      ],
      cta: "Start 14-Day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 99, annual: 990 },
      description: "For large organizations with complex needs",
      features: [
        "Unlimited everything",
        "Unlimited team members",
        "Advanced RBAC controls",
        "24/7 priority support",
        "Dedicated account manager",
        "100GB storage",
        "Advanced analytics",
        "API access",
        "Custom integrations",
        "SSO & SAML",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSocialPost = () => {
    setActiveSocialPost((prev) => (prev + 1) % socialPosts.length);
  };

  const prevSocialPost = () => {
    setActiveSocialPost((prev) => (prev - 1 + socialPosts.length) % socialPosts.length);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐝</span>
              <span className="text-2xl font-bold text-gray-900">Colmena</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Join the Hive.<br />
              <span className="text-amber-600">Work Smarter Together.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Colmena brings your team together with powerful project management tools that feel natural. 
              Collaborate seamlessly, track progress effortlessly, and deliver projects on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg text-lg font-semibold transition-all border-2 border-gray-200"
              >
                Watch Demo
              </button>
            </div>
            <p className="mt-6 text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Trusted by teams at leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <div className="text-2xl font-bold text-gray-400">TECHCORP</div>
            <div className="text-2xl font-bold text-gray-400">STARTUPHUB</div>
            <div className="text-2xl font-bold text-gray-400">CREATIVESTUDIO</div>
            <div className="text-2xl font-bold text-gray-400">LOGIFLOW</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help your team collaborate better and deliver faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Project Management</h3>
              <p className="text-gray-600">
                Create and organize projects with intuitive tools. Track progress, set deadlines, and keep everything on schedule.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Task Management</h3>
              <p className="text-gray-600">
                Break down projects into manageable tasks. Assign team members, set priorities, and track completion in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏷️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Labels & Tags</h3>
              <p className="text-gray-600">
                Organize work your way with custom labels. Filter and sort tasks instantly to find exactly what you need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Assign team members to projects and tasks. Everyone knows their responsibilities and deadlines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rich Markdown Editor</h3>
              <p className="text-gray-600">
                Write detailed task descriptions with live Markdown rendering. Add formatting, lists, and code blocks effortlessly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">
                Role-based access control keeps your data secure. JWT authentication and granular permissions protect sensitive information.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Views</h3>
              <p className="text-gray-600">
                Visualize work your way. Switch between list, board, timeline, and calendar views to match your workflow.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deadline Tracking</h3>
              <p className="text-gray-600">
                Never miss a deadline again. Visual indicators and notifications keep your team on track and accountable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">
                Powerful admin tools for team management. Monitor usage, manage permissions, and maintain control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See Colmena in Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how teams transform their workflow with Colmena
            </p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <span className="text-4xl text-amber-500">▶</span>
              </div>
              <p className="text-gray-600 font-medium">Demo Video Placeholder</p>
              <p className="text-sm text-gray-500 mt-2">Replace with actual demo video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your team's needs
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-medium ${selectedPlan === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors"
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-amber-500 rounded-full transition-transform ${
                    selectedPlan === 'annual' ? 'transform translate-x-8' : ''
                  }`}
                />
              </button>
              <span className={`font-medium ${selectedPlan === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                Save 17%
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all ${
                  plan.popular ? 'ring-2 ring-amber-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-amber-500 text-white text-center py-2 rounded-t-2xl font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 min-h-12">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price[selectedPlan]}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{selectedPlan === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/signup")}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-8 ${
                      plan.popular
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </button>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Colmena
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl p-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-3xl text-amber-500">★</span>
                  ))}
                </div>
                <p className="text-2xl text-gray-700 mb-8 italic leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </p>
                <div className="mb-2">
                  <p className="text-xl font-semibold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl text-gray-600">‹</span>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl text-gray-600">›</span>
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeTestimonial ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600">
              Follow us on social media for tips, updates, and inspiration
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              {[0, 1, 2].map((offset) => {
                const index = (activeSocialPost + offset) % socialPosts.length;
                const post = socialPosts[index];
                return (
                  <div
                    key={post.id}
                    className="flex-shrink-0 w-full md:w-1/3 bg-white rounded-xl shadow-sm p-6 transition-transform"
                  >
                    <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-2 block">📱</span>
                        <p className="text-gray-600 font-medium">{post.platform}</p>
                        <p className="text-sm text-gray-500">Image Placeholder</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-xl">❤️</span>
                        <span className="font-semibold text-gray-700">{post.likes}</span>
                      </div>
                      <span className="text-sm text-gray-500">{post.platform}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={prevSocialPost}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl text-gray-600">‹</span>
            </button>
            <button
              onClick={nextSocialPost}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl text-gray-600">›</span>
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <a href="#" className="text-gray-600 hover:text-amber-500 transition-colors">
              <span className="text-3xl">📘</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-amber-500 transition-colors">
              <span className="text-3xl">🐦</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-amber-500 transition-colors">
              <span className="text-3xl">📷</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-amber-500 transition-colors">
              <span className="text-3xl">💼</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">support@colmena.com</p>
                    <p className="text-gray-600">sales@colmena.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                    <p className="text-gray-600">Available 24/7</p>
                    <button className="text-amber-600 hover:text-amber-700 font-medium mt-1">
                      Start a conversation →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office</h4>
                    <p className="text-gray-600">123 Innovation Drive</p>
                    <p className="text-gray-600">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Team?
          </h2>
          <p className="text-xl text-amber-50 mb-8">
            Join thousands of teams already working smarter with Colmena
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white hover:bg-gray-100 text-amber-600 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-lg font-semibold transition-all border-2 border-white/20"
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🐝</span>
                <span className="text-2xl font-bold text-white">Colmena</span>
              </div>
              <p className="text-gray-400">
                Empowering teams to work smarter together.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Colmena. All rights reserved. Made with ☕ by @lvcaspacifico
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}