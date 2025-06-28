"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HeartIcon, 
  SparklesIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronRightIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<'spark' | 'connect' | 'forever'>('connect');

  const tiers = [
    {
      id: 'spark',
      name: 'Spark',
      tagline: 'Casual Dating & Fun',
      description: 'Perfect for those who want to meet new people, have fun experiences, and see where things go naturally.',
      price: '$9.99',
      color: 'from-orange-500 to-red-500',
      features: [
        'Unlimited swipes',
        'Tonight mode for spontaneous dates',
        'Local events and meetups',
        'Stories that disappear',
        'Super likes (5 per day)',
        'See who liked you'
      ],
      icon: SparklesIcon,
    },
    {
      id: 'connect',
      name: 'Connect',
      tagline: 'Serious Relationships',
      description: 'For individuals ready to build meaningful connections and find their life partner.',
      price: '$19.99',
      color: 'from-blue-500 to-purple-500',
      features: [
        'Advanced compatibility matching',
        'Daily curated matches',
        'Video dating features',
        'Personality insights',
        'Relationship coaching',
        'Priority support'
      ],
      icon: HeartIcon,
      popular: true,
    },
    {
      id: 'forever',
      name: 'Forever',
      tagline: 'Marriage-Minded',
      description: 'Exclusive tier for those serious about marriage and building a family together.',
      price: '$39.99',
      color: 'from-purple-600 to-pink-600',
      features: [
        'Comprehensive compatibility analysis',
        'Video profile interviews',
        'Background verification',
        'Life goal alignment tools',
        'Family planning discussions',
        'Dedicated matchmaker support'
      ],
      icon: UserGroupIcon,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Your Perfect Match
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Three unique dating experiences. One perfect match waiting for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Your Journey
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Tier Preview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                    selectedTier === tier.id ? 'ring-4 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedTier(tier.id as any)}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} p-4 mx-auto mb-4`}>
                    <tier.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-600">{tier.tagline}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated Hearts Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => {
            // Use deterministic positions and durations based on index
            const positions = [
              { x: '10%', animateX: '20%', duration: 18 },
              { x: '30%', animateX: '15%', duration: 22 },
              { x: '50%', animateX: '65%', duration: 20 },
              { x: '70%', animateX: '45%', duration: 25 },
              { x: '25%', animateX: '40%', duration: 19 },
              { x: '85%', animateX: '90%', duration: 23 }
            ];
            
            const pos = positions[i % positions.length];
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: pos.x,
                  bottom: '-50px'
                }}
                animate={{ 
                  y: [0, -1500],
                  x: [0, 100, -100, 0]
                }}
                transition={{
                  duration: pos.duration,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear"
                }}
              >
                <HeartIconSolid className="w-8 h-8 text-pink-200 opacity-50" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Tier</h3>
              <p className="text-gray-600">Select between Spark, Connect, or Forever based on your dating goals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Build a detailed profile that showcases your personality and interests</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Matching</h3>
              <p className="text-gray-600">Connect with compatible people who share your relationship goals</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Features by Tier
          </h2>

          {/* Tier Selector */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-white p-1 shadow-lg">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id as any)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedTier === tier.id
                      ? `bg-gradient-to-r ${tier.color} text-white`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tier.name}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Display */}
          <div className="max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedTier === tier.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`${selectedTier === tier.id ? 'block' : 'hidden'}`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="flex items-center mb-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} p-4 mr-4`}>
                      <tier.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{tier.name}</h3>
                      <p className="text-gray-600">{tier.tagline}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-8">{tier.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <Link
                      href={`/auth/register?tier=${tier.id}`}
                      className={`px-8 py-3 rounded-full font-semibold bg-gradient-to-r ${tier.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah & Mike",
                tier: "Forever",
                story: "We found each other on Forever tier and got married last spring. The compatibility matching was spot on!",
                image: "/images/couple1.jpg"
              },
              {
                name: "Emily & David",
                tier: "Connect",
                story: "Started as a Connect match, now we're planning our future together. Best decision we ever made!",
                image: "/images/couple2.jpg"
              },
              {
                name: "Jessica & Tom",
                tier: "Spark",
                story: "Met at a Spark event, and the chemistry was instant. Now we're exclusive and loving every moment!",
                image: "/images/couple3.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.story}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.tier} Members</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who have found love through our platform
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Free Today
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LoveConnect</h3>
              <p className="text-gray-400">Three ways to find love, one perfect match.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LoveConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}