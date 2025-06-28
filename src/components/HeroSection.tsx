const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">
        AI-Powered{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Vulnerability Scanner
        </span>
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Paste a website URL, and our machine learning model will analyze it for
        security risks in seconds.
      </p>
    </section>
  );
};

export default HeroSection;
