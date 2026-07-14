import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaSuitcase, FaConciergeBell, FaGlobe, FaSearch, FaUser, FaBars, FaQuestionCircle } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, ready, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleSearch = () => {
    navigate(`/homes?destination=${searchData.destination}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  function openAuth(path) {
    navigate(path, { state: { background: location } });
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    function onClick(event) {
      if (!menuOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const [mode, setMode] = useState("full");
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const TOP_RESET = 16;
    const HYST = 80;
    let lastY = window.scrollY;
    let lastSwitchY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY;

        if (y <= TOP_RESET) {
          if (modeRef.current !== "full") setMode("full");
          lastSwitchY = y;
        } else {
          if (
            modeRef.current === "full" &&
            goingDown &&
            y - lastSwitchY > HYST
          ) {
            setMode("compact");
            lastSwitchY = y;
          }
          if (
            modeRef.current === "compact" &&
            !goingDown &&
            lastSwitchY - y > HYST
          ) {
            setMode("full");
            lastSwitchY = y;
          }
        }

        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const compact = mode === "compact";

  return (
    <div
      className={`w-full sticky top-0 z-[1] will-change-transform transition-all duration-300 ${
        compact
          ? "backdrop-blur bg-white/80 shadow-md"
          : "bg-gray-100 shadow-lg"
      }`}
      style={{ minHeight: compact ? 0 : undefined }}
    >
      <div className={`px-6 ${compact ? "py-3" : "p-7"}`}>
        <div className="flex justify-between items-center relative">
          <Link to="/">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="logo"
                className={`mr-1 ml-2 transition-all ${
                  compact ? "h-7" : "h-8"
                }`}
              />
              <h2
                className={`text-red-500 font-semibold transition-all ${
                  compact ? "text-xl" : "text-2xl"
                }`}
              >
                GuestNest
              </h2>
            </div>
          </Link>

          {!compact && (
            <div className="flex space-x-10 items-center">
              <Link to="/homes">
                <div
                  className={`flex flex-col items-center cursor-pointer ${
                    isActive("/homes")
                      ? "border-b-[3px] border-black text-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <FaHome className="h-8 w-8 transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm">Homes</span>
                </div>
              </Link>
              <Link to="/experiences">
                <div
                  className={`flex flex-col items-center cursor-pointer relative ${
                    isActive("/experiences")
                      ? "border-b-[3px] border-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <FaSuitcase className="h-8 w-8 transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm">Experiences</span>
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded absolute -top-2 -right-2 font-bold">
                    NEW
                  </span>
                </div>
              </Link>
              <Link to="/services">
                <div
                  className={`flex flex-col items-center cursor-pointer relative ${
                    isActive("/services")
                      ? "border-b-[3px] border-black font-bold"
                      : ""
                  } hover:text-black`}
                >
                  <FaConciergeBell className="h-8 w-8 transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm">Services</span>
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded absolute -top-2 -right-2 font-bold">
                    NEW
                  </span>
                </div>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 px-2 relative">
            <Link to="/listings/create">
              <span className="text-sm font-medium">List your property</span>
            </Link>

            <button
              type="button"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              aria-label="Language and region"
              title="Language and region"
            >
              <FaGlobe className="h-5 w-5" />
            </button>

            <button
              ref={btnRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 p-1 rounded-full border hover:shadow-md transition bg-white"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="user-menu"
              title="Menu"
            >
              {user ? (
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>

            <div
              ref={menuRef}
              id="user-menu"
              role="menu"
              aria-hidden={!menuOpen}
              className={`absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border translate-y-2 ${
                menuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              } transition duration-150 origin-top-right`}
              style={{ display: menuOpen ? "block" : "none" }}
            >
              <div className="p-4 flex flex-col justify-between min-h-[320px] h-full">
                <div>
                  <Link
                    to="/help-center"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <FaQuestionCircle className="w-5 h-5 rounded-full border border-gray-300 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      Help Centre
                    </span>
                  </Link>

                  <hr className="my-1" />

                  <Link
                    to="/listings/create"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-between items-start gap-3 px-3 py-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900">
                        List your property
                      </p>
                      <p className="text-sm text-gray-500 leading-snug">
                        It's easy to List your property and earn extra income
                      </p>
                    </div>
                    <FaHome className="w-12 h-12 text-gray-400" />
                  </Link>

                  <hr className="my-1" />

                  {ready && user && (
                    <>
                      <hr className="my-3" />
                      <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            Welcome, {user.username}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Account
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Trips
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 px-2 hover:bg-gray-50 rounded-lg"
                      >
                        Wishlists
                      </Link>
                    </>
                  )}
                </div>

                <div>
                  <hr className="my-3" />
                  {!ready ? (
                    <p className="text-center text-gray-500 text-sm">
                      Checking session...
                    </p>
                  ) : user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-2 text-rose-600 font-semibold hover:bg-gray-50 rounded-lg"
                    >
                      Log out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuth("/signup")}
                        className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2 font-semibold"
                      >
                        Sign up
                      </button>
                      <button
                        onClick={() => openAuth("/login")}
                        className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-2"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {compact ? (
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-3 rounded-full shadow-md bg-white px-4 py-2 border">
              <input 
                type="text" 
                placeholder="Anywhere"
                className="text-sm font-medium px-2 outline-none w-24"
                value={searchData.destination}
                onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <span className="h-5 w-px bg-gray-300" />
              <input 
                type="date" 
                className="text-sm font-medium px-2 outline-none w-24"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
              />
              <span className="h-5 w-px bg-gray-300" />
              <input 
                type="date" 
                className="text-sm font-medium px-2 outline-none w-24"
                value={searchData.checkOut}
                onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
              />
              <span className="h-5 w-px bg-gray-300" />
              <select 
                className="text-sm font-medium px-2 text-gray-600 outline-none bg-transparent"
                value={searchData.guests}
                onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button 
                onClick={handleSearch}
                className="ml-2 p-2 rounded-full bg-rose-500 hover:bg-rose-600 transition"
              >
                <FaSearch className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <div className="w-[850px] flex rounded-full shadow-md overflow-hidden bg-white border p-1 px-2">
              <div className="flex-1 px-4 py-2 border-r">
                <p className="text-xs font-medium">Where</p>
                <input 
                  type="text" 
                  placeholder="Search destinations"
                  className="text-sm text-gray-500 w-full outline-none"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex-1 px-4 py-2 border-r cursor-pointer">
                <p className="text-xs font-medium">Check in</p>
                <input 
                  type="date" 
                  className="text-sm text-gray-500 w-full outline-none cursor-pointer"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                />
              </div>
              <div className="flex-1 px-4 py-2 border-r cursor-pointer">
                <p className="text-xs font-medium">Check out</p>
                <input 
                  type="date" 
                  className="text-sm text-gray-500 w-full outline-none cursor-pointer"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                />
              </div>
              <div className="flex-1 px-4 py-2 flex items-center justify-between pr-4">
                <div className="flex-1">
                  <p className="text-xs font-medium">Who</p>
                  <select 
                    className="text-sm text-gray-500 outline-none bg-transparent w-full"
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition"
                >
                  <FaSearch className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}