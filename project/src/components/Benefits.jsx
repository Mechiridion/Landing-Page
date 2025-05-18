import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const benefits = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Save Money on Repairs',
    description: 'Avoid expensive mechanic fees by learning to do repairs yourself. Our members save an average of $1,200 per year on car maintenance.',
    stat: '$1,200',
    statLabel: 'avg. annual savings'
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Professional-Grade Instruction',
    description: 'Learn from certified mechanics with our detailed guides that follow manufacturer service procedures and best practices.',
    stat: '25+',
    statLabel: 'years of experience'
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Time-Saving Diagnostic Tools',
    description: 'Quickly identify issues with our diagnostic troubleshooting tools that help you pinpoint problems without guesswork.',
    stat: '80%',
    statLabel: 'faster diagnostics'
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Compatible with All Major Brands',
    description: 'Our guides cover all major manufacturers and models, ensuring you can find the right repair instructions for your vehicle.',
    stat: '5,000+',
    statLabel: 'vehicle models'
  },
];

const BenefitCard = ({ benefit, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col md:flex-row gap-6 items-start md:items-center"
    >
      <div className="flex-shrink-0 p-4 rounded-2xl bg-orange-100">
        {benefit.icon}
      </div>
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h3 className="text-2xl font-bold">{benefit.title}</h3>
          <div className="hidden md:flex items-center text-secondary font-bold">
            {inView && (
              <>
                <span className="text-xl">
                  {benefit.id === 1 ? (
                    <CountUp start={0} end={1200} prefix="$" duration={2.5} />
                  ) : benefit.id === 2 ? (
                    <CountUp start={0} end={25} suffix="+" duration={2} />
                  ) : benefit.id === 3 ? (
                    <CountUp start={0} end={80} suffix="%" duration={2} />
                  ) : (
                    <CountUp start={0} end={5000} suffix="+" duration={2.5} />
                  )}
                </span>
                <span className="ml-1 text-sm opacity-80">{benefit.statLabel}</span>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600">{benefit.description}</p>
      </div>
    </motion.div>
  );
};

const Benefits = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Why Choose Our Repair Guides</h2>
          <p className="section-subheading">
            Discover the advantages of using our interactive 3D repair guides to maintain 
            and fix your vehicle like a professional mechanic.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gray-100 p-8 rounded-lg max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to start repairing?</h3>
              <p className="text-gray-600">
                Join thousands of DIY mechanics who are saving money with our guides.
              </p>
            </div>
            <a href="#pricing" className="btn btn-secondary whitespace-nowrap">
              Get Started Today
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;