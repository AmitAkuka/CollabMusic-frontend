import { httpService } from "./http.service";
import { STORAGE_KEY_LOGGED_USER } from "@/constants";
import { User, UserCred } from "@/types";

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getById,
  updateAvatar,
  getForgotPasswordLink,
  verifyLink,
  updatePassword,
};

async function getById(userId: string) {
  const user = await httpService.get(`user/${userId}`);
  return user;
}

async function updateAvatar(user: User, newAvatar: string) {
  try {
    const userId = user._id;
    await httpService.put(`user/${userId}/avatar`, { avatar: newAvatar });
    const updatedUser = { ...user, avatar: newAvatar };
    saveLocalUser(updatedUser);
  } catch (err) {
    throw err;
  }
}

async function login(userCred: UserCred) {
  try {
    const user = await httpService.post("auth/login", userCred);
    if (user) {
      return saveLocalUser(user);
    }
  } catch (err) {
    throw err;
  }
}

async function signup(userCred: UserCred) {
  try {
    const user = await httpService.post("auth/signup", userCred);
    return saveLocalUser(user);
  } catch (err) {
    throw err;
  }
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGED_USER);
}

function saveLocalUser(user: User) {
  sessionStorage.setItem(STORAGE_KEY_LOGGED_USER, JSON.stringify(user));
  return user;
}

function getLoggedinUser() {
  const loggedUser = sessionStorage.getItem(STORAGE_KEY_LOGGED_USER);
  return loggedUser ? JSON.parse(loggedUser) : null;
}

async function getForgotPasswordLink(email: String) {
  try {
    const res = await httpService.post("user/forgot-password", { email });
    return res;
  } catch (err) {
    throw err;
  }
}

async function verifyLink(userId: String, token: String) {
  try {
    const isVerified = await httpService.get("user/forgot-password/verify", {
      userId,
      token,
    });
    return isVerified;
  } catch (err) {
    throw err;
  }
}

async function updatePassword(userId: String, password: String) {
  try {
    const res = await httpService.put(`auth/update/${userId}`, { password });
    return res;
  } catch (err) {
    throw err;
  }
}
