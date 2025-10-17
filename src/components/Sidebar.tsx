'use client';

import { useEffect, useState } from "react";
import { getSessionUser } from "@/utils/session";
import {
  HouseIcon,
  PackageIcon,
  KanbanIcon,
  CaretLeftIcon,
  PlugsIcon,
  WhatsappLogo
  CircuitryIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/utils/session";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [hideOrganization, setHideOrganization] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  useEffect(() => {
    async function checkMembership() {
      const user = await getSessionUser();
      if (user?.membershipToCompanyId) {
        setHideOrganization(true);
      }
    }
    checkMembership();
  }, []);

  const handleLogout = async () => {
    await clearSession();
    router.push("/signin");
  };

  const menuItems = [
    { name: "Dashboard", href: "/home", icon: HouseIcon },
    // Organization só aparece se hideOrganization for false
    ...(!hideOrganization
      ? [{ name: "Organization", href: "/organization", icon: PackageIcon }]
      : []),
    { name: "Projects", href: "/projects", icon: KanbanIcon },
    { name: "Process", href: "/process", icon: CircuitryIcon }
  ];

  return (
    <aside className={`${isMenuOpen ? 'w-64' : 'w-20'} bg-white shadow-lg flex flex-col justify-between py-8 px-6 transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={toggleMenu}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          <CaretLeftIcon
            className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isMenuOpen ? '' : 'rotate-180'}`}
            weight="bold"
          />
        </button>

        <div>
          {/* Logo */}
          <div className="mb-10">
            {isMenuOpen ? (
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight text-center">Valle Hub</h1>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-1 flex flex-col gap-6">
              {menuItems.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${(pathname === item.href) || (item.name === "Clients" && pathname === "/dashboard")
                        ? "bg-blue-600 text-white shadow-md justify-center px-6"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 justify-center px-6"
                      }`}
                  >
                    <item.icon
                      size={20}
                      className="flex-shrink-0"
                      weight="regular"
                    />
                    {isMenuOpen && (
                      <span className="text-sm whitespace-nowrap">{item.name}</span>
                    )}
                  </button>
                </li>
              ))}

              {/* Integrations dropdown */}
              <li key="Integrations">
                <button
                  onClick={() => setIntegrationsOpen(prev => !prev)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${
                    integrationsOpen ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  } justify-center px-6`}
                >
                  <PlugsIcon size={20} className="flex-shrink-0" weight="regular" />
                  {isMenuOpen && (
                    <span className="text-sm whitespace-nowrap">Integrations</span>
                  )}
                </button>

                {integrationsOpen && (
                  <ul className="mt-2 ml-6 space-y-1">
                    <li>
                      <button
                        onClick={() => handleMenuClick("/whatsapp")}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-left ${
                          pathname === "/whatsapp"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                      >
                        <WhatsappLogo size={20} className="flex-shrink-0" weight="regular" />
                        {isMenuOpen && (
                          <span className="text-sm whitespace-nowrap">WhatsApp</span>
                        )}
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom upgrade section */}
        {isMenuOpen ? (
          <div className="mt-10 p-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">👋</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Upgrade</h3>
              <p className="text-xs opacity-90 mb-3">your plan →</p>
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        ) : (
          <div className="mt-10 w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white text-xl">👋</span>
          </div>
        )}
      </aside>
  );
}