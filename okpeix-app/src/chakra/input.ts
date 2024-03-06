import { ComponentStyleConfig } from '@chakra-ui/theme';

export const Input: ComponentStyleConfig = {
  baseStyle: {
    backgroundColor: "gray.200",
    width: "150px",
    borderRadius: "15px",
    padding: "5px 10px",
    fontSize: "14pt",
    fontWeight: 600,
    _focus: {
      boxShadow: "none"
    }
  },
  sizes: {
    sm: {
      fontSize:"8px"
    },
    md: {
      fontSize:"10px"
    }
  },
  variants: {
    standard: {
      backgroundColor: "gray"
    },
  },
}