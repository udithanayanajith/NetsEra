"use client";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="home-section"
      className="bg-gradient-to-br from-darkmode via-slateGray to-deepSlate"
    >
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="col-span-6">
            <h1 className="text-4xl lg:text-7xl font-semibold mb-5 text-white md:4px lg:text-start text-center">
              Learn anything with the Nets Era
            </h1>
            <p className="text-tealGreen lg:text-lg font-normal mb-10 lg:text-start text-center">
              NetsEra - Network Configuration E-Learning Platform !
            </p>
            <div className="md:flex align-middle justify-center lg:justify-start">
              <Link
                href="/practice"
                className="text-xl w-full md:w-auto font-medium rounded-full text-white py-5 px-6 bg-orange-500 hover:bg-orange-600 transition-all duration-300 lg:px-14 mr-6"
              >
                Lets practice
              </Link>
              <Link
                href="#about-section"
                className="flex border w-full md:w-auto mt-5 md:mt-0 border-orange-500 justify-center rounded-full text-xl font-medium items-center py-5 px-10 text-orange-500 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all duration-300"
              >
                Explore now
              </Link>
            </div>
          </div>
          <div className="col-span-6 flex justify-center relative">
            <Image
              src="/images/hero/network.png"
              alt="nothing"
              width={800}
              height={700}
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
