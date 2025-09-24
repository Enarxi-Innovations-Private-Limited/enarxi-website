import React from "react";
import workDomain from "@assets/images/Working-Domain/workdomain.svg";
// If using Vite, you can import as a React component with `?react`

const WorkingDomains = () => {
    return (
        <div className="w-full flex justify-center">
          <img
            src={workDomain}
            alt="Work Domain"
            className="w-full max-w-[1120px] min-w-[300px] h-auto"
          />
        </div>
      );
};

export default WorkingDomains;
