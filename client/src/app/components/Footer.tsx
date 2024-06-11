import React from "react";

function Footer() {
  return (
    <div>
      <footer className="bg-[#2B2A4C]  dark:bg-gray-900 p-4">
        <div className="w-full max-w-screen-xl mx-auto p-4">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col text-white text-sm">
              <a
                href="/"
                className="flex items-center sm:mb-0 mb-2 space-x-3 rtl:space-x-reverse"
              >
                <div className="w-[100px]">
                  <img
                    src="https://i.ibb.co.com/XWMvj0b/Tickzy-1.png"
                    alt="tickzy logo"
                  />
                </div>
              </a>
              <div className="font-bold">Tickzy</div>
              <div>Jl. Jenderal Sudirman Kav. 21, Jakarta Selatan </div>
              <div>DKI Jakarta 12930</div>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium  text-white no-underline sm:mb-0">
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-white no-underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-white no-underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-white no-underline"
                >
                  Licensing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline  text-white no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-white no-underline sm:text-center dark:text-gray-400 ">
            © 2024{" "}
            <a
              href="/"
              className=" text-white no-underline font-bold hover:underline"
            >
              Tickzy™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
