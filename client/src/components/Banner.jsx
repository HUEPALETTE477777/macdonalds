import React from 'react';

const Banner = () => {
    return (
        <div className="section-container bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
            <div className="py-28 flex flex-col md:flex-row justify-between items-center gap-24">
                <div className="md:w-1/2 space-y-10 px-2">
                    <h2 className="md:text-5xl md:leading-snug leading-snug text-4xl text-[#212120] font-semibold tracking-wide animate-fade-in-left">
                        We have Drugs in all of our <span className="text-red">Food</span>
                    </h2>
                    <p className="text-xl text-pText animate-fade-in-up">
                        ROBLOX Da-Hood Foods Here, Our Employees Are Secret Druggies From Our Food
                    </p>
                    <button className="btn-style animate-fade-in-up">Order Now</button>
                </div>
                <div className="md:w-1/2 animate-fade-in-up">
                    <img
                        src="/images/home/banner.png"
                        className="max-h-96 w-full rounded-3xl"
                        alt="Banner"
                    />
                </div>
            </div>
        </div>
    );
};

export default Banner;
