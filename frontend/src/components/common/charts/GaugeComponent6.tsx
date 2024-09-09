import React from "react";
import { IDynamicGaugeSVGProps } from "@/types";
import "./style.css";

const GaugeComponent6 = (props: IDynamicGaugeSVGProps) => {
  const { colorCode, value, height, className } = props;
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.0273 128.584C8.08787 129.864 3.82735 127.713 2.84611 123.688C-0.948702 108.125 -0.948702 91.8747 2.8461 76.3117C3.82735 72.2875 8.08787 70.1359 12.0273 71.4159C15.9667 72.6959 18.0878 76.9229 17.1599 80.9597C14.28 93.4889 14.28 106.511 17.1599 119.04C18.0878 123.077 15.9667 127.304 12.0273 128.584Z"
        fill={`${value >= 1 ? colorCode : "black"}`}
        fillOpacity={`${value >= 1 ? "0.9" : "0.1"}`}
      />
      <path
        d="M12.0427 71.3686C8.10396 70.0865 5.92405 65.8404 7.49765 62.0088C13.5833 47.1908 23.1422 34.049 35.3656 23.6953C38.5262 21.0181 43.2373 21.7843 45.6702 25.1367C48.1031 28.489 47.332 33.155 44.2071 35.8739C34.5082 44.3122 26.8483 54.8433 21.8073 66.6696C20.1831 70.48 15.9814 72.6507 12.0427 71.3686Z"
        fill={`${value >= 2 ? colorCode : "black"}`}
        fillOpacity={`${value >= 2 ? "0.9" : "0.1"}`}
      />
      <path
        d="M45.6299 25.1659C43.1952 21.8149 43.9248 17.098 47.4489 14.9212C61.0775 6.50294 76.5327 1.48125 92.5066 0.281072C96.6371 -0.0292668 99.9999 3.35786 99.9999 7.5C99.9999 11.6421 96.6353 14.9656 92.5093 15.3306C79.7034 16.4634 67.3186 20.4875 56.2926 27.0981C52.7401 29.2281 48.0646 28.517 45.6299 25.1659Z"
        fill={`${value >= 3 ? colorCode : "black"}`}
        fillOpacity={`${value >= 3 ? "0.9" : "0.1"}`}
      />
      <path
        d="M100 7.5C100 3.35786 103.363 -0.0292698 107.493 0.281065C123.467 1.48123 138.922 6.50293 152.551 14.9213C156.075 17.098 156.805 21.8149 154.37 25.1659C151.935 28.517 147.26 29.2281 143.707 27.0982C132.681 20.4875 120.297 16.4634 107.491 15.3306C103.365 14.9656 100 11.6421 100 7.5Z"
        fill={`${value >= 4 ? colorCode : "black"}`}
        fillOpacity={`${value >= 4 ? "0.9" : "0.1"}`}
      />
      <path
        d="M154.384 25.1758C156.819 21.8252 161.531 21.0624 164.689 23.7419C176.905 34.1044 186.455 47.2531 192.53 62.0755C194.101 65.9082 191.918 70.1527 187.978 71.432C184.038 72.7112 179.838 70.5376 178.217 66.726C173.184 54.896 165.532 44.3594 155.839 35.9141C152.716 33.193 151.948 28.5265 154.384 25.1758Z"
        fill={`${value >= 5 ? colorCode : "black"}`}
        fillOpacity={`${value >= 5 ? "0.9" : "0.1"}`}
      />
      <path
        d="M187.962 71.3823C191.901 70.1008 196.162 72.2507 197.145 76.2745C200.946 91.8361 200.952 108.087 197.163 123.651C196.183 127.676 191.924 129.829 187.984 128.55C184.044 127.272 181.921 123.046 182.847 119.009C185.722 106.478 185.717 93.4561 182.833 80.9281C181.903 76.8915 184.023 72.6638 187.962 71.3823Z"
        fill={`${value === 6 ? colorCode : "black"}`}
        fillOpacity={`${value === 6 ? "0.9" : "0.1"}`}
      />
    </svg>
  );
};

export default GaugeComponent6;
