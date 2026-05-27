"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export default function Logo({ compact = false, className = "" }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = compact ? "w-9 h-9" : "w-10 h-10";

  const svgSrc = "/assets/logo/logo.svg";
  const png1x = "/assets/logo/logo.png";
  const png2x = "/assets/logo/logo@2x.png";
  const pdfFallback = "/assets/logo/inoc-logo-1.pdf";

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        {!imgError ? (
          <Image
            src={svgSrc}
            alt="PE Platform logo"
            width={compact ? 36 : 40}
            height={compact ? 36 : 40}
            className={`${sizeClass} object-contain rounded-2xl`}
            onError={() => setImgError(true)}
          />
        ) : (
          <object
            data={pdfFallback}
            type="application/pdf"
            aria-label="PE Platform logo"
            className={`${sizeClass} block`}
          >
            <div
              className={`${sizeClass} rounded-2xl bg-brand-600 flex items-center justify-center font-display font-bold text-white text-sm`}
            >
              PE
            </div>
          </object>
        )}
      </div>

      <div className={compact ? "hidden sm:block" : ""} aria-hidden={false}>
        <p className="font-display font-bold text-sm leading-none text-current">PE Platform</p>
        <p className="text-xs mt-0.5 text-current/60">Olympic Values</p>
      </div>
    </Link>
  );
}
