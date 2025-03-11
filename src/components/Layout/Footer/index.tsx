import React, { FC } from "react";
import Link from "next/link";
import { headerData } from "../Header/Navigation/menuData";
import { Icon } from "@iconify/react";
import Logo from "../Header/Logo";
import Image from "next/image";

const Footer: FC = () => {
  return (
    <footer className="pt-16 bg-darkmode">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 lg:gap-20 md:gap-6 sm:gap-12 gap-6 pb-16">
          <div className="col-span-1 sm:col-span-5">
            <Logo />
            <p className="text-xs font-medium text-white mt-5 mb-16 max-w-70%">
              Open an account in minutes, get full financial control for much
              longer.
            </p>
            <div className="flex gap-6 items-center">
              <Link
                href="#"
                className="group bg-white hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:facebook-f"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black"
                />
              </Link>
              <Link
                href="#"
                className="group bg-white hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:instagram"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black"
                />
              </Link>
              <Link
                href="#"
                className="group bg-white hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:x-twitter"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black"
                />
              </Link>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-3">
            <h4 className="text-white mb-9 font-semibold text-xl">More</h4>
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="pb-4">
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-primary text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 sm:col-span-4">
            <Image
              src="/images/hero/about.jpg"
              alt="nothing"
              width={600}
              height={400}
              quality={100}
              className="w-full"
            />
          </div>
        </div>
        <div className="border-t border-white/15 py-10 flex justify-between items-center">
          <p className="text-sm text-white/70">
            @2025 - Nets Era. Developed by Shaalini
          </p>

          <div className="">
            <Link
              href=""
              className="text-sm text-white/70 px-5 border-r border-white/15 hover:text-primary"
            >
              Privacy policy
            </Link>
            <Link
              href=""
              className="text-sm text-white/70 px-5 hover:text-primary"
            >
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
