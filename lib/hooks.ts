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
    localStorage.removeItem(showDebugInformationKey);
    _setIsDebugMode(isEnabled);
  };
  return { isDebugMode, setIsDebugMode };
};
