"use client";

import { Menu, ArrowDown, Languages, Globe, LogOut, User, PiggyBank } from "lucide-react";
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
import { deals, stores, SHOP, BLOG } from "../src/paraglide/messages.js";
import { useCountry } from "../contexts/CountryContext";
import { useAuth } from "../contexts/AuthContext";
import { getCountryName, getCountryImage, getCountryId } from "../utils/countryHelpers";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInModal } from "./SignInModal";

export function Header() {
  const currentPath = usePathname();

  // Extract language from pathname (e.g., /en-EG/deals -> en)
  const language = currentPath?.match(/^\/([a-z]{2})-/)?.[1] || 'en';
  const isRTL = language === 'ar';

  const { country, countries, setCountry } = useCountry();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  
  const navItems = [
    { key: 'deals', label: deals(), href: '/deals' },
    { key: 'stores', label: stores(), href: '/stores' },
    { key: 'shop', label: SHOP(), href: '/products' },
    { key: 'guides', label: BLOG(), href: '/guides' }
  ];

  const handleStartSaving = () => {
    setShowSignIn(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full border-b-2 border-[#111827] bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href="/" className="flex items-center">
              <img 
                src="https://i.ibb.co/XZV7bXh3/Tuut.png" 
                alt="Tuut" 
                className="h-12 w-auto"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                        alt={getCountryName(country, language)}
                        className={`w-6 h-6 rounded-full object-cover ${isRTL ? 'ml-2' : 'mr-2'}`}
                      />
                      <span>
                        {getCountryName(country, language)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'en' ? 'Select Country' : 'اختر الدولة'}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
                {countries.map((c) => (
                  <DropdownMenuItem
                    key={getCountryId(c)}
                    onClick={() => setCountry(c)}
                    className={`cursor-pointer ${getCountryId(country) === getCountryId(c) ? 'bg-[#E8F3E8]' : ''}`}
                  >
                    <ImageWithFallback
                      src={getCountryImage(c)}
                      alt={getCountryName(c, language)}
                      className={`w-6 h-6 rounded-full object-cover ${isRTL ? 'ml-2' : 'mr-2'}`}
                    />
                    <span>
                      {getCountryName(c, language)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <Button
              variant="ghost"
              // TODO: Implement language switching functionality
              className="hidden md:flex h-11 px-4 rounded-xl border-2 border-[#111827] hover:bg-[#E8F3E8]"
            >
              <Languages className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'en' ? 'عربي' : 'English'}
            </Button>

            {/* User Menu or RADAR Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6"
                    style={{ fontWeight: 600 }}
                  >
                    {language === 'en' ? 'RADAR' : 'الرادار'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
                  <Link href="/wishlist" className="block w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent">
                    {language === 'en' ? 'My Wishlist' : 'قائمتي'}
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleStartSaving}
                className="hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6"
                style={{ fontWeight: 600 }}
              >
                <PiggyBank className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'en' ? 'Start Saving' : 'ابدأ التوفير'}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{language === 'en' ? 'Menu' : 'القائمة'}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="text-[#111827] py-2 transition-colors hover:opacity-60"
                      style={{ fontWeight: 500 }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Country Selector */}
                  <div className="mt-2">
                    <div className="text-[#111827] mb-2" style={{ fontWeight: 500 }}>
                      {language === 'en' ? 'Country' : 'الدولة'}
                    </div>
                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border-2 border-[#111827] rounded-xl p-2">
                      {countries.map((c) => (
                        <button
                          key={getCountryId(c)}
                          onClick={() => setCountry(c)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-[#E8F3E8] text-right ${
                            getCountryId(country) === getCountryId(c) ? 'bg-[#E8F3E8]' : ''
                          } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                        >
                          <ImageWithFallback
                            src={getCountryImage(c)}
                            alt={getCountryName(c, language)}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>
                            {getCountryName(c, language)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Language Switcher */}
                  <Button
                    variant="outline"
                    // TODO: Implement language switching functionality
                    className="mt-2 border-2 border-[#111827] rounded-xl"
                  >
                    <Languages className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'en' ? 'العربية' : 'English'}
                  </Button>

                  {/* Mobile Start Saving / Account Button */}
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/tracked-products"
                        className="mt-4 block w-full text-center border-2 border-[#111827] rounded-xl px-4 py-2 hover:bg-accent"
                      >
                        {language === 'en' ? 'Tracked Products' : 'المنتجات المتتبعة'}
                      </Link>
                      <Button 
                        onClick={handleSignOut}
                        variant="outline"
                        className="mt-2 border-2 border-red-500 text-red-600 rounded-xl"
                      >
                        <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleStartSaving}
                      className="mt-4 bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
                      style={{ fontWeight: 600 }}
                    >
                      <PiggyBank className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'en' ? 'Start Saving' : 'ابدأ التوفير'}
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
