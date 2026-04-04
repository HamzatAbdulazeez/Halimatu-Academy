import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6">
      {/* Logo */}
      <Link to="/"> <div className=" flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/ddj0k8gdw/image/upload/v1775316825/Halimatu-Academy-Images/20260222_122110_1_2_yasq5x.png"
          alt=""
          draggable="false"
          className="w-32 h-auto"
        />
      </div></Link>

      {/* 404 Text */}
      <h1 className="text-9xl font-extrabold text-[#004AAD]">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
      <p className="text-gray-600 mt-2 text-lg">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      {/* Animation */}
      <div className="mt-6">
        <img
          src="https://res.cloudinary.com/greenmouse-tech/image/upload/v1743157631/AoStyle/DALL_E_2025-03-28_11.26.35_-_A_modern_and_clean_404_error_page_illustration_featuring_a_broken_road_sign_with_404_written_on_it_placed_in_a_minimalistic_landscape._A_confused_c_wbubju.webp"
          alt="Not Found Illustration"
          className="w-72"
        />
      </div>

      {/* Button to Go Home */}
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-gradient text-white text-lg rounded-lg  hover:bg-purple-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
