"use client";

import {
  Menu,
  ArrowDown,
  Languages,
  Globe,
  LogOut,
  User,
  PiggyBank,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useCountry } from "../contexts/CountryContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getCountryName,
  getCountryImage,
  getCountryId,
} from "../utils/countryHelpers";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInModal } from "./SignInModal";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import * as m from "@/src/paraglide/messages";
import { setLocale } from "@/src/paraglide/runtime";
import changeURLLocale from "@/utils/changeURLLocale";

export function Header() {
  const currentPath = usePathname();

  // Extract language from pathname (e.g., /en-EG/deals -> en)
  const localeCountry = currentPath?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";

  // this is a global setter for all files with "use client" to have the proper locale in the SSR mode
  setLocale(locale as "ar" | "en");

  const { country, countries, setCountry } = useCountry();
  // const { user, isAuthenticated, signOut } = useAuth();
  const isAuthenticated = false;
  const [showSignIn, setShowSignIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: "deals", label: m.DEALS(), href: `/${localeCountry}/deals` },
    { key: "stores", label: m.STORES(), href: `/${localeCountry}/stores` },
    { key: "shop", label: m.SHOP(), href: `/${localeCountry}/products` },
    {
      key: "subscriptions",
      label: locale === "en" ? "Subscriptions" : "الاشتراكات",
      href: `/${localeCountry}/subscriptions`,
    },
    {
      key: "guides",
      label: m.SHOPPING_GUIDES(),
      href: `/${localeCountry}/guides`,
    },
  ];

  const handleStartSaving = () => {
    setShowSignIn(true);
  };

  const handleSignOut = async () => {
    // signOut(); // Commented out since auth is disabled
  };

  return (
    <header className="w-full border-b-2 border-[#111827] bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className={`flex items-center gap-8`}>
            <a href="/" className="flex items-center">
              {locale === "ar" ? (
                <img
                  src="/assets/images/tuut-logo-ar-min.png"
                  alt={m.TUUT_LOGO()}
                  className="h-12 w-auto"
                />
              ) : (
                <img
                  src="/assets/images/asetuut-logo.webp"
                  alt={m.TUUT_LOGO()}
                  className="h-12 w-auto"
                />
              )}
            </a>

            {/* Desktop Navigation */}
            <nav
              className={`hidden md:flex items-center gap-8 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-[#111827] transition-colors hover:opacity-60"
                  style={{ fontWeight: 500 }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA Button & Language Switcher & Country Selector */}
          <div className={`flex items-center gap-3`}>
            {/* Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex h-11 px-4 rounded-xl border-2 border-[#111827] hover:bg-[#E8F3E8]"
                >
                  {country ? (
                    <>
                      <ImageWithFallback
                        src={getCountryImage(country)}
                        alt={getCountryNameFromCode(country.slug)}
                        className={`w-6 h-6 rounded-full object-cover ${
                          isRTL ? "ml-2" : "mr-2"
                        }`}
                      />
                      <span>{getCountryNameFromCode(country.slug)}</span>
                    </>
                  ) : (
                    <>
                      <Globe className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {m.SELECT_COUNTRY()}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="w-56"
              >
                {countries.map((c) => (
                  <DropdownMenuItem
                    key={getCountryId(c)}
                    onClick={() => {
                      window.location.pathname = `${locale}-${c.slug}`;
                    }}
                    className={`cursor-pointer ${
                      getCountryId(country) === getCountryId(c)
                        ? "bg-[#E8F3E8]"
                        : ""
                    }`}
                  >
                    <ImageWithFallback
                      src={getCountryImage(c)}
                      alt={getCountryNameFromCode(c.slug)}
                      className={`w-6 h-6 rounded-full object-cover ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                    />
                    <span>{getCountryNameFromCode(c.slug)}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <a
              href={changeURLLocale(
                typeof window !== "undefined"
                  ? window.location.href
                  : `http://localhost:3000${currentPath}`,
                locale === "en" ? "ar" : "en"
              )}
            >
              <Button
                variant="ghost"
                // TODO: Implement language switching functionality
                className="hidden md:flex h-11 px-4 rounded-xl border-2 border-[#111827] hover:bg-[#E8F3E8] cursor-pointer"
              >
                <Languages className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {locale === "en" ? "عربي" : "English"}
              </Button>
            </a>

            {/* User Menu or RADAR Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6"
                    style={{ fontWeight: 600 }}
                  >
                    {m.RADAR()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? "start" : "end"}
                  className="w-48"
                >
                  <Link
                    href="/wishlist"
                    className="block w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                  >
                    {m.MY_WISHLIST()}
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {m.SIGN_OUT()}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleStartSaving}
                className="hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6"
                style={{ fontWeight: 600 }}
              >
                <PiggyBank className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {m.START_SAVING()}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden border-2 border-[#111827] rounded-lg hover:bg-[#E8F3E8]"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-[300px] sm:w-[400px]"
              >
                <SheetHeader>
                  <SheetTitle>{m.MENU()}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8 px-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[#111827] py-2 transition-colors hover:opacity-60"
                      style={{ fontWeight: 500 }}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile Country Selector - Select Input Style */}
                  <div className="mt-2">
                    <label
                      className="text-[#111827] mb-2 block text-sm"
                      style={{ fontWeight: 500 }}
                    >
                      {m.COUNTRY()}
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          const dropdown = document.getElementById(
                            "mobile-country-dropdown"
                          );
                          if (dropdown) {
                            dropdown.classList.toggle("hidden");
                          }
                        }}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-[#111827] rounded-lg text-left transition-colors hover:bg-[#F9FAFB]"
                        style={{ fontWeight: 500 }}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          {country ? (
                            <>
                              <ImageWithFallback
                                src={getCountryImage(country)}
                                alt={getCountryNameFromCode(country.slug)}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-[#111827]">
                                {getCountryNameFromCode(country.slug)}
                              </span>
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4" />
                              <span className="text-[#111827]">
                                {m.SELECT_COUNTRY()}
                              </span>
                            </>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-[#6B7280]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Options */}
                      <div
                        id="mobile-country-dropdown"
                        className="hidden absolute z-10 w-full mt-2 bg-white border-2 border-[#111827] rounded-lg shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] max-h-[240px] overflow-y-auto"
                      >
                        {countries.map((c) => (
                          <button
                            key={getCountryId(c)}
                            onClick={() => {
                              setCountry(c);
                              const dropdown = document.getElementById(
                                "mobile-country-dropdown"
                              );
                              if (dropdown) {
                                dropdown.classList.add("hidden");
                              }
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 transition-colors hover:bg-[#E8F3E8] text-left border-b border-[#E5E7EB] last:border-b-0 ${
                              country &&
                              getCountryId(country) === getCountryId(c)
                                ? "bg-[#E8F3E8]"
                                : ""
                            } ${
                              isRTL
                                ? "flex-row-reverse text-right"
                                : "text-left"
                            }`}
                          >
                            <ImageWithFallback
                              src={getCountryImage(c)}
                              alt={getCountryNameFromCode(c.slug)}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span
                              className="text-[#111827]"
                              style={{ fontWeight: 500 }}
                            >
                              {getCountryNameFromCode(c.slug)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Language Switcher */}
                  <a
                    href={changeURLLocale(
                      typeof window !== "undefined"
                        ? window.location.href
                        : `http://localhost:3000${currentPath}`,
                      locale === "en" ? "ar" : "en"
                    )}
                  >
                    <Button
                      variant="outline"
                      className="mt-2 border-2 border-[#111827] rounded-xl"
                    >
                      <Languages
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {locale === "en" ? "العربية" : "English"}
                    </Button>
                  </a>

                  {/* Mobile Start Saving / Account Button */}
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/tracked-products"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-4 block w-full text-center border-2 border-[#111827] rounded-xl px-4 py-2 hover:bg-accent"
                      >
                        {m.TRACKED_PRODUCTS()}
                      </Link>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="mt-2 border-2 border-red-500 text-red-600 rounded-xl"
                      >
                        <LogOut
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {m.SIGN_OUT()}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleStartSaving}
                      className="mt-4 bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
                      style={{ fontWeight: 600 }}
                    >
                      <PiggyBank
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {m.START_SAVING()}
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </header>
  );
}
