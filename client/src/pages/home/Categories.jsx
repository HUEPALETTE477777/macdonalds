import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom'

const categoryItems = [
    { id: 1, title: "Breakfast", description: "(6 items)", image: "/images/home/img1.png" },
    { id: 2, title: "Burgers", description: "(9 items)", image: "/images/home/img2.png" },
    { id: 3, title: "Happy Meal®", description: "(4 items)", image: "/images/home/img3.png" },
    { id: 4, title: "Beverages", description: "(20 items)", image: "/images/home/img4.png" },
];

const Categories = () => {
    const [isVisible, setIsVisible] = useState(false);
    const controls = useAnimation();
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(sectionRef.current);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            controls.start('visible');
        }
    }, [isVisible, controls]);

    return (
        <div ref={sectionRef} className="section-container bg-gradient-to-r from-[#FAFAFA] to-[#FCFAFA] pt-12 pb-24 sm:px-6 lg:px-8 ">
            <div className="text-center">
                <h2 className="py-2 bg-[#f7f5f5]  text-3xl lg:text-4xl font-bold leading-tight">Popular Crack Categories</h2>
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10"
                initial="hidden"
                animate={controls}
                variants={{
                    visible: { opacity: 1, transition: { staggerChildren: 0.6 } },
                    hidden: { opacity: 0 },
                }}
            >
                {categoryItems.map((item) => (
                    <Link to = "/menu">
                        <motion.div
                            key={item.id}
                            className="shadow-lg rounded-lg bg-white overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                            variants={{
                                visible: { opacity: 1, y: 0 },
                                hidden: { opacity: 0, y: 50 }
                            }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.1 }}
                        >
                            <div className="flex justify-center items-center bg-slate-600 py-2">
                                <img src={item.image} alt={item.title} className="w-36 h-36 rounded-full object-cover" />
                            </div>
                            <div className="py-5 px-4">
                                <h4 className="text-xl font-semibold text-gray-800">{item.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
};

export default Categories;
