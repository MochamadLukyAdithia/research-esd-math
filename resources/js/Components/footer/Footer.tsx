import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-primary text-secondary py-10 px-5 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">

            <div className="md:w-2/5">
              <h4 className="text-xl font-bold mb-5">ESD.MathPath</h4>
              <p className="leading-relaxed">
                Platform inovatif yang dirancang untuk membantu siswa, guru, dan
                siapa saja yang ingin belajar matematika dengan cara yang lebih
                interaktif.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:underline">Portal</a></li>
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Tutorial</a></li>
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                  <span>
                    Malang Creative Center
                    <br />
                    Jl. Ahmad Yani, Malang
                    <br />
                    Indonesia 65122
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-phone mt-1 mr-3"></i>
                  <span>081238038207</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-5 text-left border-t border-secondary/10">
            <p>2025 ESD.MathPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
