import { useState, useEffect } from "react";
import { isMobile } from "../../utils/IsMobile";

export default function MobilePlay() {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isMobile()) {
      return;
    }
    const gotTouched = () => {
      if (touched == true) {
        return;
      } else {
        setTouched(true);
      }
    };

    onclick = () => {
      gotTouched();
    };
  });

  return touched;
}
