"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ToastContainer } from "react-toastify";

const MasterLayout = ({ children }) => {
  let pathname = usePathname();
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = usePathname(); // Hook to get the current route

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (      

    <section className={mobileMenu ? "overlay active" : "overlay "}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link href='/' className='sidebar-logo'>
            <img
              src='/assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='/assets/images/logo-light.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='/assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            <li className=''>
              <Link href='/'>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Dashboard</span>
              </Link>
            </li>

            <li className='sidebar-menu-group-title'>Application</li>
            
            <li className='dropdown'>
              <Link href='#'>
                <Icon icon='mdi:package-variant-closed' className='menu-icon' />
                <span>Item</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/product'
                    className={
                      (pathname === "/product" || pathname === "/product/create")? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:package-variant-closed' className='menu-icon' />
                    List
                  </Link>
                </li>
                <li>
                  <Link
                    href='/category'
                    className={
                      pathname === "/category" ? "active-page" : ""
                    }
                  >
                    <Icon icon='mdi:tag-multiple' className='menu-icon' />
                    Kategori
                  </Link>
                </li>
                <li>
                  <Link
                    href='/inventory'
                    className={pathname === "/inventory" ? "active-page" : ""}
                  >
                    <Icon icon='mdi:warehouse' className='menu-icon' />
                    Inventori
                  </Link>
                </li>
                <li>
                  <Link
                    href='/package'
                    className={
                      pathname === "/package" ? "active-page" : ""
                    }
                  >
                    <Icon icon='mdi:beaker' className='menu-icon' />
                    Paket / bundling
                  </Link>
                </li>
                <li>
                  <Link
                    href='/receipt'
                    className={
                      pathname === "/receipt" ? "active-page" : ""
                    }
                  >
                    <Icon icon='mdi:beaker' className='menu-icon' />
                    Resep
                  </Link>
                </li>
              </ul>
            </li>
            
            <li>
              <Link
                href='/pasien'
                className={pathname === "/pasien" ? "active-page" : ""}
              >
                <Icon icon='mdi:account-heart' className='menu-icon' />
                <span>Pasien</span>
              </Link>
            </li>
            <li className='dropdown'>
              <Link href='#'>
                <Icon icon='mdi:percent' className='menu-icon' />
                <span>Promo & Voucher</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/promo'
                    className={
                      pathname === "/percent" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:percent' className='menu-icon' />
                    Promo
                  </Link>
                </li>
                <li>
                  <Link
                    href='/voucher'
                    className={
                      pathname === "/voucher" ? "active-page" : ""
                    }
                  >
                    <Icon icon='ri:coupon-2-fill' className='menu-icon' />
                    Voucher
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href='/transaction'
                className={pathname === "/transaction" ? "active-page" : ""}
              >
                <Icon icon='mdi:money' className='menu-icon' />
                <span>Transaksi</span>
              </Link>
            </li>
            <li>
              <Link
                href='/appointment'
                className={pathname === "/appointment" ? "active-page" : ""}
              >
                <Icon icon='mdi:calendar-clock' className='menu-icon' />
                <span>Appointment</span>
              </Link>
            </li>
            <li>
              <Link
                href='/room'
                className={pathname === "/room" ? "active-page" : ""}
              >
                <Icon icon='mdi:room' className='menu-icon' />
                <span>Room Manajemen</span>
              </Link>
            </li>
            
            <li className='dropdown'>
              <Link href='#'>
                <Icon icon='mdi:user' className='menu-icon' />
                <span>Pengguna</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/user'
                    className={
                      pathname === "/user" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:user' className='menu-icon' />
                    Data Pengguna
                  </Link>
                </li>
                <li>
                  <Link
                    href='/shift'
                    className={
                      pathname === "/shift" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:clock' className='menu-icon' />
                    Master Shift
                  </Link>
                </li>
                <li>
                  <Link
                    href='/schedule'
                    className={
                      pathname === "/schedule" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:clock' className='menu-icon' />
                    Jadwal Kerja
                  </Link>
                </li>
              </ul>
            </li>         
            <li>
              <Link
                href='/commission'
                className={pathname === "/commission" ? "active-page" : ""}
              >
                <Icon icon='mdi:account-cash' className='menu-icon' />
                <span>Komisi</span>
              </Link>
            </li>
            <li className='dropdown'>
              <Link href='#'>
                <Icon icon='mdi:cog' className='menu-icon' />
                <span>Pengaturan</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <Link
                    href='/setting'
                    className={
                      pathname === "/setting" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:company' className='menu-icon' />
                   General
                  </Link>
                </li>
                <li>
                  <Link
                    href='/setting/company'
                    className={
                      pathname === "/setting/company" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:company' className='menu-icon' />
                    Informasi Perusaaan
                  </Link>
                </li>
                <li>
                  <Link
                    href='/additional-cost'
                    className={
                      pathname === "/additional-cost" ? "active-page" : ""
                    }
                  >
                  <Icon icon='mdi:arrow-up' className='menu-icon' />
                    Biaya Tambahan
                  </Link>
                </li>
              </ul>
            </li>
            
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* ThemeToggleButton */}
                <ThemeToggleButton />
                
                {/* Language dropdown end */}
                {/* Message dropdown end */}
                <div className='dropdown'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='iconoir:bell'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Notifications
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <Link
                        href='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Congratulations
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <Link
                        href='#'
                        className='text-primary-600 fw-semibold text-md'
                      >
                        See All Notification
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='/assets/images/user.png'
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          Shaidul Islam
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          Admin
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/view-profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/email'
                        >
                          <Icon
                            icon='tabler:message-check'
                            className='icon text-xl'
                          />{" "}
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          href='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          Setting
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                          href='#'
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body'>{children}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            {/* <div className='col-auto'>
              <p className='mb-0'>© 2025 WowDash. All Rights Reserved.</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                Made by <span className='text-primary-600'>wowtheme7</span>
              </p>
            </div> */}
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
