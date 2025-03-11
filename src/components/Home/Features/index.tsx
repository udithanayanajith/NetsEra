"use client";

const Features = () => {
  return (
    <section>
      <div
        className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md"
        id="about-section"
      >
        <div className="text-center mb-14">
          <p className="text-primary text-lr font-normal mb-3 tracking-widest uppercase">
            What are we and Features
          </p>
          <h2 className="text-3xl lg:text-5xl font-semibold text-white lg:max-w-60% mx-auto">
            Get a many of interesting features.
          </h2>
        </div>
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
          <div className="max-w-5xl p-6 rounded-3xl bg-gradient-to-b from-gray-900 to-black shadow-lg">
            <h1 className="text-4xl font-bold text-center mb-6">
              About the E-Learning Network Simulator
            </h1>
            <p className="text-lg text-gray-400 text-center leading-relaxed">
              The{" "}
              <span className="font-semibold text-white">
                E-Learning Network Simulator
              </span>{" "}
              helps students understand network configuration errors and
              troubleshoot issues. This platform offers interactive learning and
              simulation exercises to build confidence in configuring PCs,
              routers, and switches.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 mt-12">
              {[
                {
                  heading: "Interactive Learning",
                  subheading: "Step-by-step guides for network configuration.",
                },
                {
                  heading: "Simulated CLI",
                  subheading:
                    "Practice real commands in a simulated Linux terminal.",
                },
                {
                  heading: "Quiz & Challenges",
                  subheading: "Test your knowledge with real-world scenarios.",
                },
                {
                  heading: "Random Network Generation",
                  subheading:
                    "Dynamically created network setups to configure.",
                },
                {
                  heading: "Instant Feedback",
                  subheading:
                    "Real-time error detection and troubleshooting suggestions.",
                },
                {
                  heading: "Certification Ready",
                  subheading:
                    "Ideal for preparing for networking certification exams.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 relative rounded-3xl bg-gradient-to-b from-gray-800 to-black shadow-md"
                >
                  <h3 className="text-2xl font-semibold text-center">
                    {item.heading}
                  </h3>
                  <p className="text-lg text-gray-400 text-center mt-2">
                    {item.subheading}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 text-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
