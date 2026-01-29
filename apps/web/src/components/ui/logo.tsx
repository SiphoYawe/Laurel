import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { logo: 40, text: "text-lg" },
  md: { logo: 120, text: "text-2xl" },
  lg: { logo: 180, text: "text-3xl" },
};

/**
 * Laurel Logo Component
 * Uses the official laurel.svg from the project root
 */
export function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  const { logo } = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        priority
        alt="Laurel Logo"
        height={logo}
        src="/laurel.svg"
        width={Math.round(logo * 3.6)} // Maintain aspect ratio (1260:350)
      />
      {showText && <p className="mt-2 text-sm text-gray-500">Build habits that stick</p>}
    </div>
  );
}
