import { AppLoader } from "./AppLoader";
import { ShopPreview } from "./ShopPreview";

type Props = {
  loadedAvatarsImg: string[] | null;
  loggedUserAvatar: string | undefined;
  onSelectAvatar: (avatarPath: string) => void;
};

export const ShopList = ({
  loadedAvatarsImg,
  loggedUserAvatar,
  onSelectAvatar,
}: Props) => {
  if (!loadedAvatarsImg || !loggedUserAvatar) return <AppLoader />;
  return (
    <div className="shop-list-main-container">
      {loadedAvatarsImg.map((avatarImg: string, idx: number) => (
        <ShopPreview
          key={idx + 32423598}
          avatarImg={avatarImg}
          loggedUserAvatar={loggedUserAvatar}
          onSelectAvatar={onSelectAvatar}
        />
      ))}
    </div>
  );
};
