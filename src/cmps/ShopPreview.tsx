type Props = {
  loggedUserAvatar: string;
  avatarImg: string;
  onSelectAvatar: (avatarPath: string) => void;
};

export const ShopPreview = ({
  avatarImg,
  loggedUserAvatar,
  onSelectAvatar,
}: Props) => {
  const isUsedAvatar = avatarImg.indexOf(loggedUserAvatar) >= 0;
  return (
    <div className="shop-preview-main-container">
      <img src={avatarImg} alt="avatar-image" />
      {isUsedAvatar && (
        <button className="used-btn" disabled>
          Avatar In Use
        </button>
      )}
      {!isUsedAvatar && (
        <button
          className="select-btn"
          onClick={() => onSelectAvatar(avatarImg)}
        >
          Select Avatar
        </button>
      )}
    </div>
  );
};
