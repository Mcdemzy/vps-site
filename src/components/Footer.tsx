const Footer = () => {
  return (
    <footer className="border-t border-gray-800 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} VulnScan. Not affiliated with real
          security tools.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
