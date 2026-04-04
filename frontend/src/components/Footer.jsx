import { useLocation } from 'react-router-dom';
import { PhoneCall, Mail } from 'lucide-react';

const InstagramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="6" ry="6"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM9.996 15.005V8.995L15.26 12l-5.264 3.005z" />
  </svg>
);

const FacebookIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.39H7.898V12h2.54v-2.569c0-2.515 1.498-3.9 3.791-3.9 1.102 0 2.253.197 2.253.197v2.476h-1.27c-1.25 0-1.639.776-1.639 1.57V12h2.812l-.449 3.39h-2.363v6.488C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 2H1.771C.792 2 2 2.774 2 3.729v16.542C2 21.227 2.792 22 3.771 22h16.451C21.2 22 22 21.227 22 20.271V3.729C22 2.774 21.2 2 20.222 2h.003zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452z" fill="white" />
  </svg>
);

const Footer = () => {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup'];

  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-[#1A1D23] pt-16 pb-8 border-t border-gray-100 dark:border-white/5 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1 */}
          <div>
            <h3 className="font-serif text-2xl mb-6 text-gray-900 dark:text-white">More Information</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-[#C5A059] transition-colors text-gray-600 dark:text-gray-300">About Us</a></li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#C5A059] transition-colors">
                <PhoneCall size={18} />
                <a href="tel:+251911091185">+251911091185</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#C5A059] transition-colors">
                <Mail size={18} />
                <a href="mailto:booking@kurifturesorts.com">booking@kurifturesorts.com</a>
              </li>
              <li className="pt-2">
                <button className="border border-black dark:border-gray-300 text-black dark:text-gray-300 px-6 py-2 ">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-serif text-2xl mb-6 text-gray-900 dark:text-white">Resorts</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li><a href="https://www.kurifturesorts.com/resorts/africanVillage" className="hover:text-[#C5A059] transition-colors">Kuriftu Resort & Spa African Village</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/bishoftu" className="hover:text-[#C5A059] transition-colors">Kuriftu Resort & Spa Bishoftu</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/entoto" className="hover:text-[#C5A059] transition-colors">Kuriftu Entoto Adventure Park</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/laketana" className="hover:text-[#C5A059] transition-colors">Kuriftu Resort & Spa Lake Tana</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/awash" className="hover:text-[#C5A059] transition-colors">Kuriftu Resort & Spa Awash</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-serif text-2xl mb-6 text-gray-900 dark:text-white">Adventure & Wellness</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li><a href="https://www.kurifturesorts.com/resorts/waterpark/adv/" className="hover:text-[#C5A059] transition-colors">Kuriftu Water Park</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/entoto/adv/" className="hover:text-[#C5A059] transition-colors">Kuriftu Entoto Adventure Park</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/boston" className="hover:text-[#C5A059] transition-colors">Boston Day Spa</a></li>
              <li><a href="https://www.kurifturesorts.com/resorts/entoto/adv/" className="hover:text-[#C5A059] transition-colors">Kuriftu Entoto Adventure Park</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-serif text-2xl mb-6 text-gray-900 dark:text-white">Socials</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/kr_bishoftu/#" className="text-[#1A1D23] hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                <InstagramIcon size={28} />
              </a>
              <a href="https://www.youtube.com/channel/UCI3Y6eDzcmAchDoGGVJZKgA/videos" className="text-[#1A1D23] hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                <YoutubeIcon size={28} />
              </a>
              <a href="https://web.facebook.com/kurifturesorts/?_rdc=1&_rdr#" className="text-[#1A1D23] hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                <FacebookIcon size={30} />
              </a>
              <a href="https://www.linkedin.com/company/kuriftu-resorts/posts/?feedView=all" className="text-[#3a5a40] hover:opacity-80 transition-opacity">
                <LinkedinIcon size={28} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center pt-8 border-t border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 space-y-2 font-serif text-sm">
          <img src="/logo-transparent.png" alt="Kuriftu Logo" className="w-12 h-12 object-contain mb-2" />
          <p>All Copyright © 2026 Kuriftu Resort &amp; Spa.</p>
          <p>Powered by PIER 5 STUDIOS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
