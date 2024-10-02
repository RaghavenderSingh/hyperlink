import { ArrowRight } from "lucide-react";
import React from "react";

interface GroupButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSources?: string[];
  onClick?: () => void;
}
export default function GroupButton({
  icon,
  title,
  description,
  imageSources,
  onClick,
}: GroupButtonProps) {
  return (
    <div>
      <div className="group w-full overflow-hidden" onClick={onClick}>
        <div className="flex w-full cursor-pointer items-center justify-start whitespace-normal break-words p-4 hover:bg-gray-50">
          <div className="flex w-full justify-start gap-3 items-start">
            <div className="flex w-5 items-center justify-center text-grey-800 pt-1">
              {icon}
            </div>
            <div className="flex flex-col items-start w-full">
              <h3 className="text-left text-sm font-semibold text-grey-800 xs:text-base">
                <div className="flex flex-row flex-wrap items-center gap-1 pb-1">
                  {title}
                  {imageSources && (
                    <div className="inline-flex items-center justify-start">
                      {imageSources.map((src, index) => (
                        <img
                          key={index}
                          className={`box-content h-5 w-5 flex-shrink-0 rounded-[3px] ${
                            index > 0 ? "ml-[-3.33px]" : ""
                          } border-solid bg-white group-hover:bg-blue-25`}
                          src={src}
                          alt=""
                        />
                      ))}
                    </div>
                  )}
                </div>
              </h3>
              <div className="text-left text-xs font-normal text-grey-500">
                {description}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <ArrowRight className="h-5 w-5 text-grey-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
