import { Global } from "@emotion/react";

const FlagFont = () => (
  <Global
    styles={`
      @font-face {
        font-family: NotoColorEmojiLimited;
        unicode-range: U+1F1E6-1F1FF;
        src: local(./NotoColorEmoji.ttf);
      }
      `}
  />
);

export default FlagFont;
