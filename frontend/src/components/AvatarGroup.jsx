import React from "react";
import { Image } from "react-bootstrap";

const AvatarGroup = ({ avatars = [], maxVisible = 2, size = 50 }) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visibleAvatars.map((avatar, index) => (
        <Image
          key={index}
          src={avatar.image}
          alt={avatar.name}
          roundedCircle
          width={size}
          height={size}
          style={{
            border: "1.5px solid #7B8A8B",
            marginLeft: index === 0 ? 0 : -size / 3,
            zIndex: visibleAvatars.length - index,
            objectFit: "cover",
          }}
          title={avatar.name}
        />
      ))}
      {extraCount > 0 && (
        <div
          style={{
            width: size,
            height: size,
            marginLeft: -size / 3,
            zIndex: 0,
            backgroundColor: "#6c757d",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: size * 0.4,
            border: "2px solid white",
          }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
