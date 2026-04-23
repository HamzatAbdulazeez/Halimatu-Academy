import Banner from './Components/Banner';
import Statsbar from './Components/Statsbar';
import Courses from './Components/Courses';
import Features from './Components/Features';
import TheProgram from './Components/TheProgram';
import Privatetutor from './Components/Privatetutor';
import Enroll from './Components/Enroll';
import TestimonialsFAQs from './Components/TestimonialsFAQs';  
import PrivateTutorRequestCTA from './Components/PrivateTutorRequestCTA';  
import WhatsAppChatButton from "./Components/WhatsAppChatButton";



export default function NewHome() {
    return (
        <>
            <Banner />
            <Statsbar />
            <Courses />
            <TheProgram />
            <Features />
            {/* <Privatetutor /> */}
            {/* <Enroll /> */}
            <PrivateTutorRequestCTA />
            <TestimonialsFAQs />
            <WhatsAppChatButton />
        </>
    );
}