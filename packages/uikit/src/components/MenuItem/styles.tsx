import { styled } from "styled-components";
import { StyledMenuItemProps } from "./types";

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;

  ${({ $isActive, theme }) =>
    $isActive &&
    // $variant === "subMenu" &&
    `
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        height: 3px;
        width: 100%;
        background-color: ${theme.colors.mainColor};
        border-radius: 2px 2px 0 0;
      }
    `};

  ${({ $variant }) =>
    $variant === "default" &&
    `
    margin-right: 24px;

     &:after{
        bottom: 6px;
      }
   `}
`;

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  display: flex;
  align-items: center;

  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.lightBlue : theme.isDark ? theme.colors.white : theme.colors.black};

  font-size: 16px;
  /* font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")}; */
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "inherit")};
  font-weight: 400;
  cursor: pointer;

  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}
  ${({ $variant }) =>
    $variant === "default"
      ? `
    // padding: 0 8px;
    height: 48px;
  `
      : `
    padding-left: 4px;
    padding-right: 4px;
    height: 42px;
  `} /* &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
    ${({ $variant }) => $variant === "default" && "border-radius: 16px;"};
  } */
`;

export default StyledMenuItem;
