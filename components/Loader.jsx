import React from "react";
// import Image from "next/image";
import Lottie from "lottie-react";
import loadingAnimation from "../public/loading-animation.json";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full">
      {/* <Image
        src="/loading.gif"
        width={100}
        height={100}
        alt="Loading..."
        priority={true}
      /> */}
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        className="w-[200px] h-[200px]"
      />
    </div>
  );
};

export default Loader;
