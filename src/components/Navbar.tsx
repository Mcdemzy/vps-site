const Navbar = () => {
  return (
    <nav className="p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          VulnScan
        </h1>
        <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">
          GitHub
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
