'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dock, DockIcon } from '@/components/ui/dock';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor'
      />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor'
      />
    </svg>
  )
}

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface Navbar03NavItem {
  href?: string;
  label: string;
  active?: boolean;
}

export interface Navbar03Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar03NavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar03NavItem[] = [
  { href: '/', label: 'Beranda', active: true },
  { href: '/contests', label: 'Sayembara' },
  { href: '/clipper', label: 'Clipper' },
];

export const Navbar03 = React.forwardRef<HTMLElement, Navbar03Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      signInText = 'Sign In',
      signInHref = '#signin',
      ctaText = 'Get Started',
      ctaHref = '#get-started',
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const containerRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const url = usePathname();

    const session = authClient.useSession()

    const handleSignInClick = () => {
      console.log("Sign In clicked");
      router.push("/signin");
    };

    const handleCtaClick = () => {
      console.log("Get Started clicked");
      router.push("/signin");
    };

    // Scroll handler
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Show navbar when scrolling up or at the top
        if (currentScrollY < lastScrollY || currentScrollY < 10) {
          setIsVisible(true);
        }
        // Hide navbar when scrolling down (and not at the top)
        else if (currentScrollY > lastScrollY && currentScrollY > 10) {
          setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const handleOnMenuClick = (href: string | undefined) => {
      router.push(href || '/');
    }

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <div
        className={cn(
          "sticky top-4 z-50 w-full px-4 md:px-6 transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-[calc(100%+1rem)]"
        )}
      >
        <Dock
          ref={combinedRef}
          className={cn(
            'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 [&_*]:no-underline rounded-none h-16 w-full max-w-screen-2xl',
            className
          )}
          disableMagnification={true}
          {...props}
        >
          {/* Left side */}
          <div className="flex items-center gap-2 flex-1">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleOnMenuClick(link.href)
                            }}
                            className={cn(
                              'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline',
                              link.href === url && 'bg-accent text-accent-foreground'
                            )}
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">
                  <p className="text-sm uppercase text-[Rubik] tracking-wider font-bold text-[#fb8500]">Clip Aja</p>
                  {/* {logo} */}
                </div>
                {/* <span className="hidden font-bold text-xl sm:inline-block">shadcn.io</span> */}
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOnMenuClick(link.href);
                          }}
                          className={cn(
                            'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer relative',
                            'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100',
                            link.href === url && 'before:scale-x-100 text-primary'
                          )}
                          data-active={link.href === url}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>

          {/* Right side */}
          {session?.data?.user ? (
            <div className="flex items-center gap-3 ml-auto">
              <Button
                size="sm"
                className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/dashboard");
                }}
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSignInClick) onSignInClick();
                  handleSignInClick();
                }}
              >
                {signInText}
              </Button>
              <Button
                size="sm"
                className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (onCtaClick) onCtaClick();
                  handleCtaClick();
                }}
              >
                {ctaText}
              </Button>
            </div>
          )}
        </Dock>
      </div>
    );
  }
);

Navbar03.displayName = 'Navbar03';

export { Logo, HamburgerIcon };