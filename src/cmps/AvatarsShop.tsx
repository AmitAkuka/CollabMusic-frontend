import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ShopList } from "./ShopList";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AVATARS_LIST } from "@/constants";
import { SelectBox } from "./SelectBox";
import { updateUserAvatar } from "@/store/user/userSlice";
import { userService } from "@/services/user.service";
import { AppLoader } from "./AppLoader";
import { toastMsg } from "@/utils";

export const AvatarsShop = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.userModule.user);
  const [avatarsCategory, setAvatarsCategory] = useState("base");
  const [loadedAvatarsImg, setLoadedAvatarsImg] = useState<string[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAvatars();
  }, [avatarsCategory]);

  const avatarCategories = useMemo(() => Object.keys(AVATARS_LIST), []);

  const loadAvatars = useCallback(async () => {
    const avatarsByCategory = AVATARS_LIST[avatarsCategory];
    const loadedImages = await Promise.all(
      avatarsByCategory.map(async (avatar: string) => {
        const loadedAvatarImage = await import(`../assets/img/${avatar}.png`);
        return loadedAvatarImage.default;
      })
    );
    setLoadedAvatarsImg(loadedImages);
  }, [avatarsCategory]);

  const onSelectAvatar = async (avatarPath: string) => {
    try {
      setIsLoading(true);
      const matches =
        process.env.NODE_ENV === "production"
          ? avatarPath.match(/\/assets\/(.*?)\-/)
          : avatarPath.match(/\/([^/]+)\.[^.]+$/);
      if (!matches || !loggedUser) return;
      const avatarName = matches[1];
      await userService.updateAvatar(loggedUser, avatarName);
      dispatch(updateUserAvatar(avatarName));
      setIsLoading(false);
      toastMsg("Avatar updated successfully!");
    } catch (err) {
      isLoading && setIsLoading(false);
      console.error(err);
      toastMsg("Failed to update avatar", true);
    }
  };

  return (
    <div className="avatars-shop-main-container">
      {isLoading && <AppLoader />}
      <header className="avatars-shop-header-container">
        <h1>Purchase your avatars</h1>
      </header>
      <SelectBox
        list={avatarCategories}
        selected={avatarsCategory}
        handleChange={setAvatarsCategory}
      />
      <ShopList
        loadedAvatarsImg={loadedAvatarsImg}
        loggedUserAvatar={loggedUser?.avatar}
        onSelectAvatar={onSelectAvatar}
      />
    </div>
  );
};
