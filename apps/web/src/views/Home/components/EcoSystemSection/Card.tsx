import { Box, ChevronRightIcon, Flex, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

const Card: React.FC<{
  title: string
  description: string
  image: StaticImageData | string
  width: number
  ctaTitle: string
  className?: string
  path?: string
  onClick?: () => void
}> = ({ title, description, image, ctaTitle, width, className, path, onClick }) => {
  const { theme } = useTheme()
  const { push } = useRouter()
  return (
    <ItemWrapper
      className={className}
      $flexBasis={width}
      onClick={onClick ? () => onClick() : () => path && push(path)}
    >
      <ImageBox>
        <Image className="hover" src={image} width={40} height={40} alt={title} unoptimized />
      </ImageBox>
      <Box>
        <Text fontSize="20px" mb="12px" lineHeight="110%" fontWeight={600} color={theme.colors.white}>
          {title}
        </Text>
        <Text
          fontSize="14px"
          lineHeight="120%"
          color={theme.colors.white}
          height={75}
          fontFamily="system-ui"
          style={{ opacity: '0.9' }}
        >
          {description}
        </Text>
      </Box>
      <Flex className="cta" style={{ margin: '0 auto' }}>
        <Text fontSize="14px" fontWeight={400} color={theme.colors.white}>
          {ctaTitle}
        </Text>
        <ChevronRightIcon color={theme.colors.white} />
      </Flex>
    </ItemWrapper>
  )
}

export default Card

export const ItemWrapper = styled(Flex)<{ $flexBasis: number }>`
  /* align-items: left; */
  /* justify-content: space-between; */
  flex-direction: column;
  flex-grow: 1;
  gap: 12px;
  background-color: #2342c2;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  .cta > * {
    transition: color 0.25s ease-in-out;
    path {
      transition: fill 0.25s ease-in-out;
    }
  }
  padding: 20px;
  /* &:hover {
    .cta > * {
      color: ${({ theme }) => theme.colors.primary};
      path {
        fill: ${({ theme }) => theme.colors.primary};
      }
    }
  } */
  flex-basis: calc(50% - 24px);

  @media (max-width: 450px) {
    flex-basis: 100%;
  }

  &.type-a {
    /* height: 246px; */
    &.adjust-height {
      margin-top: 20px;
      /* height: 220px; */
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      &.adjust-height {
        margin-top: 0px;
        /* height: 246px; */
      }
      flex-basis: calc(33.3% - 48px);
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      /* height: 286px; */
      &.adjust-height {
        margin-top: 0px;
        /* height: 286px; */
      }
      &.higher {
        /* height: 292px; */
        &.adjust-height {
          margin-top: 0px;
          /* height: 292px; */
        }
      }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
  }
  &.type-b {
    height: 263px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-basis: ${({ $flexBasis }) => $flexBasis}%;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      height: 286px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      height: 256px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-wrap: nowrap;
  }
`

export const ImageBox = styled.div`
  position: relative;
  transition: filter 0.25s linear;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;

  /* .default {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    .default {
      display: block;
      position: relative;
      z-index: 1;
    }
    .hover {
      transition: opacity 0.25s ease-in-out;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 2;
    }
  } */
`
