import { NormalizedAvatarConfig, NormalizedAvatarStyle } from "@/types";

type Props = {
  avatarConfig: NormalizedAvatarConfig;
  getAvatarContainerStyle: (
    avatarConfig: NormalizedAvatarConfig
  ) => NormalizedAvatarStyle;
};

export const AvatarPreview = ({
  avatarConfig,
  getAvatarContainerStyle,
}: Props) => {
  const imgConfig: NormalizedAvatarStyle =
    getAvatarContainerStyle(avatarConfig);
  const {
    containerConfig: { className, style },
    imageConfig,
  } = imgConfig;
  const { username } = avatarConfig;

  return (
    <div className={`avatar-container ${className}`} style={style}>
      <img {...imageConfig} alt="" />
      <p>{username}</p>
    </div>
  );
};
