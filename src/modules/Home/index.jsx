import Banner from './Components/Banner';
import NextBanner from './Components/NextBanner';
import TheProgram from './Components/TheProgram';
import IslamicQuote from './Components/IslamicQuote';
import LearningPathSection from './Components/LearningPathSection';
import TestimonialsFAQs from './Components/TestimonialsFAQs';  



export default function NewHome() {
    return (
        <>
            <Banner />
            <NextBanner />
            <TheProgram />
            <IslamicQuote />
            <LearningPathSection />
            <TestimonialsFAQs />
        </>
    );
}