import { useEffect, useState } from "react";

export const _useLocalstoreBoolean = (key: string) => {
  const [value, _setValue] = useState<boolean>(false);

  useEffect(() => {
    const preference = localStorage.getItem(key);
    if (preference) {
      _setValue(true);
    }
  }, []);

  const setValue = (isEnabled: boolean) => {
    if (!(isEnabled === true)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, "true");
    }
    _setValue(isEnabled === true);
  };

  return [value, setValue];
};

export const useDebugModeSetting = () => {
  return _useLocalstoreBoolean("showDebugInformation");
};
