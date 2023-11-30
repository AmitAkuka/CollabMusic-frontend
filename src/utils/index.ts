import { PLAYER_DEFAULT_STYLE } from "@/constants";
import { ReactPlayerStyle } from "@/types";
import { toast } from "react-toastify";
import { SPECIAL_CHARS_REGEX } from "@/constants";


export const toastMsg = (text: string, isError: boolean = false) => {
  isError ? toast.error(text) : toast.success(text);
};

export function getErrorMessage(err: any): string {
  if (typeof err === "string") {
    return err;
  }

  if (err?.response?.data?.err) {
    //Custom error
    return err.response.data.err;
  }

  if (err?.response?.data?.error?.message) {
    //Custom youtube error
    return err.response.data.error.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An error occurred";
}

export const checkInputValidation = (formProps: {
  [key: string]: FormDataEntryValue;
}) => {
  const { password, repeatPassword } = formProps;
  let message: string = "";
  if (password.length < 6 || repeatPassword.length < 6) {
    message = "Password must contain at least 6 characters";
  } else if (password.toString() !== repeatPassword.toString()) {
    message = "Passwords are not equal";
  } else if (!SPECIAL_CHARS_REGEX.test(password as string)) {
    message = "Password must contain at least one special character";
  }
  message && toastMsg(message, true);
  return !message;
};

export function getFormattedIso8601ToSeconds(iso8601Duration: string) {
  const minutesMatch = iso8601Duration.match(/(\d+)M/);
  const secondsMatch = iso8601Duration.match(/(\d+)S/);

  let minutes = 0;
  let seconds = 0;

  if (minutesMatch && minutesMatch[1]) {
    minutes = parseInt(minutesMatch[1]);
  }

  if (secondsMatch && secondsMatch[1]) {
    seconds = parseInt(secondsMatch[1]);
  }

  return minutes * 60 + seconds;
}

export const getReactPlayerStyle = () => {
  const scale = _getScreenScale();
  if (scale === 1) return PLAYER_DEFAULT_STYLE;

  const widthDiff = scale < 1 ? scale * 1.5 : scale * 0.687;
  const heightDiff = scale < 1 ? scale * 1.16 : scale * 0.665;
  const leftDiff = scale < 1 ? scale * 75 : scale * 0.5;

  const workspaceWidth = window.screen.width - 235;
  const width = workspaceWidth * (0.335 * widthDiff);
  const height = window.screen.height * (0.32 * heightDiff);

  return {
    width,
    height,
    inline: {
      left: workspaceWidth / 2 - width / 2 + leftDiff,
    },
  };
};

export const getRandomAvatarPosition = () => {
  const defaultWidth = 1920;
  const defaultHeight = 1080;

  //decreaing sidebar width and half of avatar width.
  const widthCenter = (defaultWidth - 235 - 90) / 2.15;
  const heightCenter = defaultHeight / 2.3;

  // Allowing up to 15% position change from the default resolution.
  const topMin = heightCenter - heightCenter * 0.15;
  const topMax = heightCenter + heightCenter * 0.15;
  // Allowing up to 50% position change from the default resolution.
  const leftMin = widthCenter - widthCenter * 0.5;
  const leftMax = widthCenter + widthCenter * 0.5;

  const top = getRandomNumberBetweenRange(topMin, topMax);
  const left = getRandomNumberBetweenRange(leftMin, leftMax);

  return { top, left, zIndex: Math.ceil(top) };
};

export const adjustAvatarPositionForScreenSize = (
  top: number,
  left: number,
  isDj: boolean = false
) => {
  const scale = _getScreenScale();
  // If scale is equal to 1 means user screen is equal to the default screen
  if (scale === 1) return { top, left };
  let topDif = 0;
  let leftDif = 0;

  if (isDj) {
    topDif = scale < 1 ? -50 * scale : 80 * scale;
    leftDif = scale < 1 ? -30 * scale : 60 * scale;
  } else {
    topDif = scale < 1 ? -80 * scale : 65 * scale;
    leftDif = scale < 1 ? -35 * scale : 55 * scale;
  }

  // Adjust the positions based on the scaling factor
  const adjustedTop = top * scale + topDif;
  const adjustedLeft = left * scale + leftDif;
  return { top: adjustedTop, left: adjustedLeft };
};

export const getRandomNumberBetweenRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getSecondsPassedFromTs = (ts: number) => {
  //Decreasing approx loading time of 1 second;
  return Math.abs((new Date().getTime() - new Date(ts).getTime()) / 1000) - 1;
};

function _getScreenScale() {
  return Math.min(window.screen.width / 1920, window.screen.height / 1080);
}
