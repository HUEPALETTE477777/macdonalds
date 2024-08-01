import React from 'react';

const serviceItems = [
    { id: 1, title: "Provisioning", description: "We supply our employees with crack", image: "/images/home/img1.png" },
    { id: 2, title: "CIA", description: "Nation's first line of defense. 1954 Guatemala Coup!", image: "/images/home/img2.png" },
    { id: 3, title: "PLACEHOLDER", description: "PLACEHOLDER", image: "/images/home/img3.png" },
    { id: 4, title: "PLACEHOLDER", description: "PLACEHOLDER", image: "/images/home/img4.png" },
];

const Services = () => {
    return (
        <div className="section-container bg-gradient-to-l from-[#FAFAFA] from-0% to-[#FCFAFA] to-100%">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <div className="text-left md:w-5/6">
                        <p className="subtitle text-red">Our Special & Secret Services</p>
                        <h2 className="title">What Our Drug Cartel Offers!</h2>
                        <p className="leading-[32px] my-7 text-pText">
                            YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP YAP
                            YAP YAP YAP YAP YAP YAP
                        </p>
                        <button className="btn-style">Explore Here</button>
                    </div>
                </div>
                <div className="md:w-1/2">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-center mt-16 mb-16">
                    {
                        serviceItems.map((service) => (
                            <div key={service.id} className="shadow-xl px-2 py-8 w-72 rounded-lg bg-[#FEFEFE] mx-white text-center cursor-pointer hover:-translate-y-2 transition ease-in-out delay-400">
                                <img src={service.image} className="mx-auto bg-red rounded-full p-2 w-24 h-24" />
                                <h4 className="pt-4 font-semibold text-red">{service.title}</h4>
                                <p className="text-red">{service.description}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            </div>
        </div>
    );
}

export default Services;
