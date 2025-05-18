import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Essential guides for basic car maintenance',
    features: [
      { text: 'Access to basic maintenance guides', included: true },
      { text: 'Standard resolution videos', included: true },
      { text: 'Basic diagnostic tools', included: true },
      { text: 'Limited 3D models', included: true },
      { text: 'Forum community access', included: true },
      { text: 'Email support', included: false },
      { text: 'Advanced repair guides', included: false },
      { text: 'Interactive 3D animations', included: false },
      { text: 'Cost estimator tool', included: false },
      { text: 'Full vehicle database', included: false }
    ],
    buttonText: 'Get Started',
    buttonType: 'secondary',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$14.99',
    period: '/month',
    description: 'Complete access to all guides and features',
    features: [
      { text: 'Access to basic maintenance guides', included: true },
      { text: 'High-definition videos', included: true },
      { text: 'Advanced diagnostic tools', included: true },
      { text: 'Full 3D model library', included: true },
      { text: 'Forum community access', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced repair guides', included: true },
      { text: 'Interactive 3D animations', included: true },
      { text: 'Cost estimator tool', included: true },
      { text: 'Full vehicle database', included: true }
    ],
    buttonText: 'Start Pro Trial',
    buttonType: 'primary',
    discount: '50% OFF first month',
    popular: true
  },
  {
    id: 'team',
    name: 'Shop',
    price: '$99.99',
    period: '/month',
    description: 'For professional mechanics and repair shops',
    features: [
      { text: 'All Pro plan features', included: true },
      { text: 'Unlimited access for 5 team members', included: true },
      { text: 'Customer management tools', included: true },
      { text: 'Repair history tracking', included: true },
      { text: 'Parts inventory management', included: true },
      { text: 'Phone & email support', included: true },
      { text: 'White-labeled client reports', included: true },
      { text: 'Labor time integration', included: true },
      { text: 'Shop management integration', included: true },
      { text: 'Custom 3D model import', included: true }
    ],
    buttonText: 'Contact Sales',
    buttonType: 'outline',
    popular: false
  }
];

const PlanCard = ({ plan, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl shadow-lg overflow-hidden ${
        plan.popular ? 'border-2 border-blue-600 transform md:scale-105' : 'border border-gray-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold">
          MOST POPULAR
        </div>
      )}
      
      <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          {plan.discount && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {plan.discount}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline text-gray-900">
          <span className="text-4xl font-extrabold">{plan.price}</span>
          <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>
        </div>
        <p className="mt-5 text-lg text-gray-500">{plan.description}</p>
      </div>
      
      <div className="flex-1 flex flex-col px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
        <ul className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <div className="flex-shrink-0">
                {feature.included ? (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <p className={`ml-3 text-base ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}>
                {feature.text}
              </p>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto pt-6">
          <a
            href="#"
            className={`btn w-full text-center ${
              plan.buttonType === 'primary'
                ? 'btn-primary'
                : plan.buttonType === 'secondary'
                ? 'btn-secondary'
                : 'btn-outline'
            }`}
          >
            {plan.buttonText}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const FrequentlyAskedQuestion = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-6 text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-6"
        >
          <p className="text-gray-600">{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

const Pricing = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  
  const faqs = [
    {
      question: 'Do I need technical knowledge to use the guides?',
      answer: 'Not at all! Our guides are designed for all skill levels, from complete beginners to experienced DIY mechanics. We break down complex repairs into simple, easy-to-follow steps with clear visuals and explanations.'
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you\'ll still have access until the end of your current billing period.'
    },
    {
      question: 'Are the guides available for all car makes and models?',
      answer: 'We cover over 5,000 vehicles from all major manufacturers, with new models being added regularly. Our database includes domestic and foreign vehicles from 1960 to present day models.'
    },
    {
      question: 'Do you offer refunds if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all new subscribers. If you\'re not completely satisfied with our service, contact our support team within 30 days of your purchase for a full refund.'
    },
    {
      question: 'Can I download guides to use offline?',
      answer: 'Pro and Shop plan subscribers can download repair guides for offline use. Basic members need an internet connection to access the guides.'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Choose The Right Plan For You</h2>
          <p className="section-subheading">
            Whether you're a DIY enthusiast or a professional mechanic, we have a plan that fits your needs.
            All plans include a 30-day money-back guarantee.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
        
        {/* Guarantee badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="rounded-full bg-blue-100 p-3 mb-4">
            <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">100% Satisfaction Guarantee</h3>
          <p className="text-gray-600 text-center max-w-2xl">
            If you're not completely satisfied with our service within 30 days, we'll refund your subscription. 
            No questions asked.
          </p>
        </motion.div>
        
        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h3>
          
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FrequentlyAskedQuestion
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={index === openFaqIndex}
                onClick={() => setOpenFaqIndex(index === openFaqIndex ? -1 : index)}
              />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a href="#" className="text-primary font-medium hover:text-primary-dark">
              Contact our support team <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;