
import { useState, useEffect } from 'react';

interface PlatformInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  premiumLink: string;
}

const ANDROID_LINK = "https://play.google.com/store/apps/details?id=br.com.app.gpu2994564.gpub492f9e6db037057aaa93d7adfa9e3e0";
const IOS_LINK = "https://apps.apple.com/us/app/direito-premium/id6451451647";

export const usePlatformDetection = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isAndroid: false,
    isIOS: false,
    isMobile: false,
    premiumLink: ANDROID_LINK // Default
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isMobile = isAndroid || isIOS;
    
    const premiumLink = isIOS ? IOS_LINK : ANDROID_LINK;

    setPlatformInfo({
      isAndroid,
      isIOS,
      isMobile,
      premiumLink
    });
  }, []);

  return platformInfo;
};
