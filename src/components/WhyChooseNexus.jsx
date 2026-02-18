import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Truck, Award, ArrowRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const WhyChooseNexus = () => {
    const features = [
        {
            icon: <Zap size={28} />,
            title: 'Hyper-Fast Delivery',
            description: 'From our warehouse to your setup in 24-48 hours. Guaranteed speed.',
            gradient: 'from-yellow-400 to-orange-500'
        },
        {
            icon: <Shield size={28} />,
            title: 'Verified Authentic',
            description: 'Direct partnerships with manufacturers. 100% genuine with certificates.',
            gradient: 'from-blue-400 to-cyan-400'
        },
        {
            icon: <Truck size={28} />,
            title: '30-Day Returns',
            description: 'Test drive your gear. If it doesn’t click, send it back hassle-free.',
            gradient: 'from-purple-400 to-pink-500'
        },
        {
            icon: <Award size={28} />,
            title: 'Elite Support',
            description: '24/7 access to our dedicated team of hardware experts and gamers.',
            gradient: 'from-green-400 to-emerald-500'
        },
    ];

    return (
        <section className="relative w-full py-32 overflow-hidden bg-zinc-950">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nexus-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 space-y-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse" />
                        <span className="text-xs font-bold tracking-widest text-white/80 uppercase">The Nexus Standard</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                        <span className="text-white">Why Pros Choose NEXUS</span>
                        <span className="bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
                           
                        </span>
                    </h2>


                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        We don't just sell hardware. We curate an ecosystem of premium gear
                        backed by elite service and industry-leading warranties.
                    </p>
                </motion.div>

                {/* Grid Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            className="group relative h-full"
                        >
                            {/* Card Container */}
                            <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl hover:shadow-nexus-accent/10">

                                {/* Gradient Blob Effect on Hover */}
                                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-500`} />

                                {/* Icon Container */}
                                <div className="relative mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300 ease-out`}>
                                        <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`} />
                                            <div className="relative text-white z-10">
                                                {feature.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nexus-accent transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>

                                {/* Subtle visual indicator at bottom */}
                                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                    <span className={`text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                                        Learn more
                                    </span>
                                    <ArrowRight size={14} className="text-zinc-500" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseNexus;