import { useEffect, useState } from "react";

export const useDebugMode = () => {
  const showDebugInformationKey = "showDebugInformation";
  const [isDebugMode, _setIsDebugMode] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem(showDebugInformationKey);
    if (preference) {
      _setIsDebugMode(true);
    }
  }, []);

  const setIsDebugMode = (isEnabled: boolean) => {
    if (!isEnabled) {
      localStorage.removeItem(showDebugInformationKey);
    } else {
      localStorage.setItem(showDebugInformationKey, "true");
    }
    _setIsDebugMode(isEnabled);
  };

  return { isDebugMode, setIsDebugMode };
};
