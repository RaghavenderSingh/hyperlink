import { ArrowRight, PlugZap } from "lucide-react";
import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  className: string;
  isMobile?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className,
  isMobile = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Auto-play failed:", error);
      }
    };

    playVideo();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      playsInline
      preload="auto"
      autoPlay
      muted
      loop
      style={{
        borderRadius: isMobile ? "20px" : "6.429px",
        boxShadow: "rgba(0, 0, 0, 0.06) 0px 1.071px 21.429px 0px",
        border: "2.143px solid rgb(255, 255, 255)",
      }}
    />
  );
};

interface HeroSectionProps {
  onGetStarted?: () => void;
  customClassName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  customClassName = "",
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onGetStarted) {
      e.preventDefault();
      onGetStarted();
    }
  };

  return (
    <div
      className={`mx-auto mt-5 flex w-full max-w-[1200px] flex-col-reverse items-center justify-center gap-10 px-5 pb-[80px] mobile:mt-10 mobile:min-h-[624px] mobile:pb-[120px] mid:px-10 lg:mt-[80px] lg:flex-row lg:items-start xl:px-0 ${customClassName}`}
    >
      {/* Video Section */}
      <div className="relative z-0 w-full lg:w-[50%]">
        <div className="relative w-full translate-x-[-40px]">
          {/* Desktop Video */}
          <VideoPlayer
            src="/marketing/tiplink-wallet-adapter/hero-desktop.mp4"
            poster="/marketing/tiplink-wallet-adapter/desktop-poster.png"
            className="w-full bg-white p-[2px] focus:outline-none"
          />

          {/* Mobile Video */}
          <VideoPlayer
            src="/marketing/tiplink-wallet-adapter/hero-mobile.mp4"
            poster="/marketing/tiplink-wallet-adapter/mobile-poster.png"
            className="absolute bottom-[-22px] right-[-41px] w-[134px] bg-white px-[1px] py-[3px] focus:outline-none mobile:bottom-[50%] mobile:translate-y-[50%]"
            isMobile={true}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex w-full flex-col items-center justify-center space-y-5 mobile:space-y-8 lg:block lg:w-[50%] lg:space-y-10">
        {/* Badge */}
        <div className="flex w-fit items-center justify-center gap-1 rounded-lg bg-blue-500/10 px-3 py-1 text-blue-500">
          <PlugZap className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-semibold uppercase md:text-base">
            Web3 Wallet Adapter
          </p>
        </div>

        {/* Text Content */}
        <div className="max-w-[580px] space-y-4 lg:space-y-5">
          <h2 className="max-w-[353px] text-center text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-primary mobile:max-w-[452px] mobile:text-[48px] md:max-w-[580px] tablet:text-[60px] lg:text-left">
            Making Web3 apps{" "}
            <span className="font-bold text-primaryBlue">user friendly</span>
          </h2>
          <p className="mx-auto max-w-[353px] text-center text-base leading-normal text-neutral-secondary mobile:max-w-[452px] mobile:text-[20px] md:max-w-[580px] tablet:text-[24px] lg:mx-[unset] lg:max-w-[unset] lg:text-left">
            Seamless authentication with social login - no wallet setup
            required.
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="/get-started"
          onClick={handleClick}
          className="group inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 xs:text-base"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
