const FeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered Detection",
      desc: "Uses machine learning to find patterns missed by traditional scanners.",
      icon: "🤖",
    },
    {
      title: "Instant Reports",
      desc: "Get detailed vulnerability breakdowns in seconds.",
      icon: "⚡",
    },
    {
      title: "Free & Easy",
      desc: "No signup required—just paste a URL and scan.",
      icon: "🎯",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Use <span className="text-blue-400">VulnScan</span>?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
