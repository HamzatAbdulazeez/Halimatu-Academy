import React from "react";
import { Link } from "react-router-dom";

const BannerSection = ({
    title,
    subtitle,
    buttonText,
    buttonLink,
    backgroundColor = "bg-bread",
    backgroundImage = null,
    overlayOpacity = "bg-opacity-50"
}) => {
    return (
        <div
            className={`relative w-full h-62.5 md:h-75 flex flex-col items-center justify-center text-center text-white ${!backgroundImage ? backgroundColor : ''}`}
            style={backgroundImage ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            } : {}}
        >
            {/* Overlay for better text readability when using background image */}
            {backgroundImage && (
                <div className={`absolute inset-0 bg-black/70 ${overlayOpacity}`}></div>
            )}
            
            {/* Content */}
            <div className="relative z-10">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">{title}</h1>
                <p className="text-sm md:text-base mb-4 px-4">{subtitle}</p>

                {buttonText && buttonLink && (
                    <Link
                        to={buttonLink}
                        className="inline-block bg-[#FA912D] hover:bg-orange-600 text-white text-sm px-8 py-3 rounded-md transition"
                    >
                        {buttonText}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default BannerSection;