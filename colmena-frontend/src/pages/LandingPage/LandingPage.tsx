import { useNavigate } from "react-router-dom";
import { GenericLink } from "../../components/General/GenericLink";
import { GenericButton } from "../../components/Forms/GenericButton";

import csst from "../../assets/brand-assets/ccst.svg";
import cdt from "../../assets/brand-assets/cdt.svg";
import csmt from "../../assets/brand-assets/csmt.svg";
import socialMediaPost1 from "../../assets/brand-assets/social-medial-post.png"

import { useState } from "react";
import { GenericTextInput } from "../../components/Forms/GenericTextInput";

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonail] = useState(0);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const testimonials = [
    { company: "Colmena Client Support Team" , name: "Bob", testimonial: "The best thing I did was hiring this tool. My team went from 60% completion of tasks to 97% em just two monts!"},
    { company: "Colmena Development Team" ,name: "Kane", testimonial: "If you're looking for a minimalist tool to boost your productivity, you found it."},
    { company: "Colmena Social Media Team" ,name: "Wanessa", testimonial: "Colmena is the beeeest! I love you guys!"}
  ]

  function handlePreviousTestimonial(){
    setCurrentTestimonail(c => c !== 0 ? c-1 : testimonials.length-1)
  }
  function handleNextTestimonial(){
    setCurrentTestimonail(c => c === testimonials.length-1 ? 0 : c+1)
  }
  
  const [currentPost, setCurrentPost] = useState(1);
  const [formSent, setFormSent] = useState(false);

  const socialMediaPosts = [
      { 
        at: "@colmenacst", 
        likeCount: "5.5K", 
        source: "X (Formerly Twitter)", 
        image: socialMediaPost1 
      },
      { 
        at: "@colmenacdt", 
        likeCount: "20.7K", 
        source: "Instagram", 
        image: socialMediaPost1 
      },
      { 
        at: "@colmenacsmt", 
        likeCount: "10.5K", 
        source: "LinkedIn", 
        image: socialMediaPost1 
      },
    ];
    
    function handlePreviousPost() {
      setCurrentPost((p) =>
        p === 0 ? socialMediaPosts.length - 1 : p - 1
      );
    }

    function handleNextPost() {
      setCurrentPost((p) =>
        p === socialMediaPosts.length - 1 ? 0 : p + 1
      );
    }
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full">
      
      <section id="hero" className="py-20 text-center">
        <h1 className=" text-black font-black text-5xl">
          Join the hive:
        </h1>
        <h1 className="text-colmena-orange font-black text-5xl">Work Smarter Together</h1>
        <p className="mt-4 text-xl max-w-200"><span className="italic font-bold">Colmena</span> brings your team together with powerful project management tools that feel natural.
         Collaborate seamlessly, track progress effortlessly, and deliver projects on time.</p>

         <div className="flex gap-2 items-center justify-center text-center mt-4 p-0">
          <GenericButton
          extraClassName="max-w-40 h-15 shadow mb-4"
          onClick={() => navigate("/signup")}
          >
            Start Free Trial
          </GenericButton>
          <a href="#features" className="p-4 hover:cursor-pointer font-bold rounded-lg w-40 m-0 h-15 shadow bg-white text-gray-700 border-1 border-gray-700 hover:bg-gray-100">
            Learn More
          </a>
         </div>
         <p className="text-sm text-gray-600 font-semibold mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
      </section>
      
      <section
        id="trusted-by"
        className="flex flex-col items-center justify-center p-10 border-y-1 border-y-gray-400 w-full overflow-hidden"
        >
          <h2 className="text-gray-500 font-semibold text-lg">
            Trusted by collaborative teams at awesome companies:
          </h2>

          <div className="relative w-full  mt-4">
            <div className="flex animate-slide gap-10">
              <img src={csst} alt="Logo csst" className="w-48 h-auto opacity-50" />
              <img src={cdt} alt="Logo cdt" className="w-48 h-auto opacity-50" />
              <img src={csmt} alt="Logo csmt" className="w-48 h-auto opacity-50" /> 
              <img src={csst} alt="Logo csst" className="w-48 h-auto opacity-50" />
              <img src={cdt} alt="Logo cdt" className="w-48 h-auto opacity-50" />
              <img src={csmt} alt="Logo csmt" className="w-48 h-auto opacity-50" />
            </div>
          </div>
      </section>
      
      <section id="testimonials">
          
        <div className="bg-gray-200 rounded-lg w-180 h-40 m-12 p-20 flex flex-col justify-center items-center relative shadow-2xl">
          <button className="absolute flex  p-4 justify-center items-center -left-3 hover:cursor-pointer
           text-md font-black rounded-full h-4 w-4  bg-white shadow" onClick={handlePreviousTestimonial}>&lt;</button>
          <button className="absolute flex  p-4 justify-center items-center -right-3 hover:cursor-pointer
           text-md font-black rounded-full h-4 w-4  bg-white shadow" onClick={handleNextTestimonial}>&#62;</button>
          <p className="text-lg text-center">⭐⭐⭐⭐⭐</p>
          <p className="italic text-lg text-center">"{testimonials[currentTestimonial].testimonial}"</p>
          <p className="font-bold">{testimonials[currentTestimonial].name}</p>
          <p className="text-sm text-gray-400">{testimonials[currentTestimonial].company}</p>
        </div>
      </section>
      
      <section id="pricing" className="py-20 bg-white border-y-gray-300 border-y-1 w-full">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-black font-black text-5xl mb-4">Simple, Transparent Pricing</h1>
            <p className="text-gray-500 font-semibold text-lg">Choose the plan that fits your team</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-semibold ${pricingPeriod === 'monthly' ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setPricingPeriod(pricingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${pricingPeriod === 'annual' ? 'bg-colmena-orange' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${pricingPeriod === 'annual' ? 'translate-x-7' : ''}`} />
            </button>
            <span className={`font-semibold ${pricingPeriod === 'annual' ? 'text-black' : 'text-gray-400'}`}>Annual</span>
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Save 17%</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-black text-black mb-2">Starter</h3>
              <p className="text-gray-500 text-sm mb-6">For individuals and small teams</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">$0</span>
                <span className="text-gray-500 ml-2">/{pricingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <GenericButton
                extraClassName="w-full mb-6 shadow"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </GenericButton>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Up to 3 projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">5 team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Basic task management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Markdown editor</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-4 border-colmena-orange rounded-lg p-8 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-colmena-orange text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-black text-black mb-2">Professional</h3>
              <p className="text-gray-500 text-sm mb-6">For growing teams</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">${pricingPeriod === 'monthly' ? '29' : '290'}</span>
                <span className="text-gray-500 ml-2">/{pricingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <GenericButton
                extraClassName="w-full mb-6 shadow"
                onClick={() => navigate("/signup")}
              >
                Start 14-Day Trial
              </GenericButton>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">15 team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Advanced task management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Priority email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Custom labels & tags</span>
                </li>
                
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Email support</span>
                </li> 
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-black text-black mb-2">Enterprise</h3>
              <p className="text-gray-500 text-sm mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">${pricingPeriod === 'monthly' ? '99' : '990'}</span>
                <span className="text-gray-500 ml-2">/{pricingPeriod === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <GenericButton
                extraClassName="w-full mb-6 shadow"
                onClick={() => navigate("/signup")}
              >
                Contact Sales
              </GenericButton>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Unlimited everything</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Unlimited team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Advanced RBAC controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">24/7 priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-600 text-sm">API access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="social-media"
        className="bg-white text-center flex items-center p-12 flex-col border-y-1 border-y-gray-400 w-full"
          >
          <h1 className="text-black font-black text-5xl">Join Our Community</h1>
          <h2 className="text-gray-500 font-semibold text-lg">
            We are very active on all major platforms:
          </h2>

          <div className="rounded-lg n w-220 m-12 flex flex-col justify-center items-center relative shadow-2xl bg-gray-200 min-h-100">
            <button
              className="absolute flex p-4 justify-center items-center -left-3 hover:cursor-pointer
              text-md font-black rounded-full h-4 w-4 bg-white shadow z-20"
              onClick={handlePreviousPost}
            >
              &lt;
            </button>
            <button
              className="absolute flex p-4 justify-center items-center -right-3 hover:cursor-pointer
              text-md font-black rounded-full h-4 w-4 bg-white shadow z-20"
              onClick={handleNextPost}
            >
              &#62;
            </button>

            <div className="relative w-full rounded-lg h-96 overflow-hidden flex items-center justify-center">
              <div className="flex items-center justify-center gap-1 w-full">
                {socialMediaPosts.map((post, index) => {
                  const offset = index - currentPost;
                  const isActive = offset === 0;
                  const isAdjacent = Math.abs(offset) === 1;
                  
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 flex flex-col items-center justify-center border-8 border-white bg-white rounded-lg transition-all duration-500 ease-in-out ${
                        isActive
                          ? "scale-100 z-10 opacity-100 shadow-xl"
                          : isAdjacent
                          ? "scale-90 opacity-70 z-0"
                          : "scale-75 opacity-40 z-0"
                      }`}
                      style={{
                        width: '280px'
                      }}
                    >
                      <img
                        className="w-60 h-60 border border-gray-300 rounded object-cover"
                        src={post.image}
                        alt={`Social media post ${index + 1}`}
                      />
                      <div className="text-left p-4 w-full">
                        <p className="italic text-sm text-gray-600">{post.at}</p>
                        <p className="font-bold text-lg">❤️ {post.likeCount}</p>
                        <p className="text-xs text-gray-400">{post.source}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="contact-form" className="flex flex-col justify-center py-20 text-center w-full min-h-200">
            <h1 className="text-black font-black text-5xl">Get in Touch</h1>
            <h2 className="text-gray-500 font-semibold text-lg mt-2">
              Have questions? We'd love to hear from you.
            </h2>

            <div className="flex flex-col justify-center items-center mt-8">
              {formSent ? (
                <div className="bg-colmena-orange text-white font-bold p-6 rounded-lg">
                  ✅ Message sent. We'll be in touch soon!
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSent(true);
                  }}
                  className="flex flex-col items-center text-left gap-4"
                >
                  <GenericTextInput extraClassName="text-gray-800" legend="Name" placeholder="Your name" required />
                  <GenericTextInput
                    legend="Email"
                    type="email"
                    extraClassName="text-gray-800"
                    placeholder="your@email.com"
                    required
                  />
                  <GenericTextInput
                    legend="Company Name"
                    extraClassName="text-gray-800"
                    placeholder="Your company"
                    required
                  />
                  <fieldset className="flex flex-1 w-80 mb-2 text-black">
                    <legend className="text-xxs font-medium mb-2 text-inherit">
                      Message
                    </legend>
                    <textarea
                      className="w-full h-32 rounded-lg border border-stone-950 px-4 py-3 text-sm text-gray-800 bg-transparent outline-none focus:border-2 placeholder-gray-300"
                      placeholder="Your message"
                      required
                    />
                  </fieldset>
                  <GenericButton type="submit" extraClassName="w-80 shadow">
                    Send Message
                  </GenericButton>
                </form>
              )}
            </div>
          </section> 
      </div>
    </div>
  );
}