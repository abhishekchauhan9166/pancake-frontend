import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useDrawCanvas } from '../hooks/useDrawCanvas'
import { useDrawSequenceImages } from '../hooks/useDrawSequence'
import { checkIsIOS } from '../hooks/useIsIOS'
import { ChainTags } from './MetricsSection/ChainTags'

// const BgWrapper = styled.div`
//   z-index: -1;
//   overflow: hidden;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   bottom: 0px;
//   left: 0px;
// `

// const InnerWrapper = styled.div`
//   position: absolute;
//   width: 100%;
//   bottom: -3px;
// `

// const BunnyWrapper = styled.div`
//   width: 100%;
//   > span {
//     overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
//   }
// `

// const CakeBox = styled.div`
//   width: 300px;
//   height: 300px;
//   > canvas {
//     transform: scale(0.33) translate(-50%, -50%);
//     transform-origin: top left;
//     &.is-ios {
//       transform: scale(0.75) translate(-50%, -50%);
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     width: 500px;
//     height: 500px;
//     > canvas {
//       transform: scale(0.45) translate(-50%, -50%);
//       &.is-ios {
//         transform: scale(1) translate(-50%, -50%);
//       }
//     }
//     transform-origin: center center;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     > canvas {
//       transform: scale(0.6) translate(-50%, -50%);
//       transform-origin: top left;
//       &.is-ios {
//         transform: scale(1) translate(-50%, -50%);
//       }
//     }
//     ${({ theme }) => theme.mediaQueries.lg} {
//       > canvas {
//         &.is-ios {
//           transform: scale(1.45) translate(-50%, -52%);
//         }
//       }
//     }
//     position: relative;
//     width: 605px;
//     height: 736px;
//     overflow: hidden;
//     margin-bottom: -100px;
//     margin-right: -100px;
//   }
// `
// const VideoWrapper = styled.div`
//   opacity: 0;
//   visibility: hidden;
//   position: absolute;
// `

// const CakeVideo = styled.video``

// const CakeCanvas = styled.canvas`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: transparent;
// `

const StyledText = styled(Text)`
  font-size: 32px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 60px;
  }
`

const MainWrapper = styled.div`
  background: #f8f8f8;
  padding: 40px;
  border-radius: 20px;
  margin: 0 20px;
  padding-bottom: 140px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 40px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0 100px;
  }
`

const Wrapper = styled.div`
  padding: 20px;
  text-align: center;

  /* ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 50px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 20px 160px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 20px 200px;
  } */
`

const CardWrapper = styled.div`
  margin: -100px 40px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  /* padding: 0 70px; */

  /* ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 30px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 70px;
    margin: -100px 70px 0;
  } */
`

const Card = styled.div<{ background: string; color: string }>`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  padding: 20px 20px;
  border-radius: 20px;
  position: relative;
  width: 220px;
`

const CardTitle = styled.div`
  font-weight: 600;
  margin-bottom: 14px;
  font-size: 20px;
`

const Bnb = styled.div`
  position: absolute;
  bottom: 140px;
  left: 20px;

  @media (max-width: 400px) {
    left: -20px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    left: 25px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    left: 100px;
  }
`

const Ethereum = styled.div`
  position: absolute;
  right: -20px;
  bottom: 150px;

  @media (max-width: 380px) {
    right: -40px;
    bottom: 120px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    right: 20px;
  }
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 50px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    gap: 0;
  }
`

const width = 1080
const height = 1080

const Hero = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile, isXs } = useMatchBreakpoints()
  const videoRef = useRef<HTMLVideoElement>(null)
  const starVideoRef = useRef<HTMLVideoElement>(null)
  const cakeVideoRef = useRef<HTMLVideoElement>(null)
  const rock01VideoRef = useRef<HTMLVideoElement>(null)
  const rock02VideoRef = useRef<HTMLVideoElement>(null)
  const rock03VideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const internalRef = useRef(0)
  const seqInternalRef = useRef(0)
  const { drawImage, isVideoPlaying } = useDrawCanvas(
    videoRef,
    canvasRef,
    internalRef,
    width,
    height,
    () => {
      if (isVideoPlaying.current === false) {
        isVideoPlaying.current = true
        internalRef.current = window.requestAnimationFrame(() => {
          drawImage?.()
        })
      }
    },
    () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 3
        videoRef.current.play()
      }
    },
    [starVideoRef, cakeVideoRef, rock01VideoRef, rock02VideoRef, rock03VideoRef],
  )

  useLayoutEffect(() => {
    starVideoRef.current?.play()
    cakeVideoRef.current?.play()
    rock01VideoRef.current?.play()
    rock02VideoRef.current?.play()
    setTimeout(() => {
      rock03VideoRef.current?.play()
    }, 3000)
    return () => {
      clearInterval(seqInternalRef.current)
      cancelAnimationFrame(internalRef.current)
    }
  }, [])

  const { drawSequenceImage, playing } = useDrawSequenceImages(
    `${ASSET_CDN}/web/landing/hero-sequence`,
    checkIsIOS() || isMobile ? 70 : 0,
    canvasRef,
    seqInternalRef,
    () => clearInterval(seqInternalRef.current),
    () => {
      if (playing.current === false) {
        playing.current = true
        seqInternalRef.current = window.setInterval(() => {
          drawSequenceImage(500, 500)
        }, 1000 / 15)
      }
    },
    true,
  )

  return (
    <>
      <style jsx global>
        {`
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      {/* <BgWrapper>
        <InnerWrapper>
          <SlideSvgDark className="slide-svg-dark" width="100%" />
          <SlideSvgLight className="slide-svg-light" width="100%" />
        </InnerWrapper>
      </BgWrapper> */}

      <MainWrapper>
        <Wrapper>
          <StyledText display="inline-block" lineHeight="110%" fontWeight={600} color="#000" mr="8px">
            {t("Everyone's")} <br /> {t('Favorite DEX')}
          </StyledText>
          <Text
            mt="24px"
            color="#696666"
            fontSize={20}
            lineHeight="110%"
            maxWidth={410}
            style={{ margin: '20px auto' }}
          >
            {t('Trade, earn, and own crypto on the all-in-one multichain DEX')}
          </Text>
          <Buttons>
            {/* <Flex justifyContent="center" marginTop={50}> */}
            {!account && (
              <ConnectWalletButton
                style={{
                  borderRadius: isXs ? 12 : undefined,
                  background: '#E6E51E',
                  color: '#000',
                  boxShadow: 'none',
                  width: '150px',
                }}
                scale="sm"
                mr="8px"
              />
            )}
            <NextLinkFromReactRouter to="/swap">
              <Button
                scale="sm"
                style={{
                  borderRadius: isXs ? 12 : undefined,
                  background: '#E6E51E',
                  borderColor: '#E6E51E',
                  color: '#000',
                  width: '120px',
                }}
                variant={!account ? 'secondary' : 'primary'}
              >
                {t('Trade Now')}
              </Button>
            </NextLinkFromReactRouter>
            {/* </Flex> */}
          </Buttons>

          <div style={{ position: 'absolute', top: '-36px', left: '150px' }}>
            <Image src="/images/mercadex/coins/arbitrum.png" width={70} height={70} alt="arbitrum" />
          </div>
          <div style={{ position: 'absolute', top: '80px', left: '-35px' }}>
            <Image src="/images/mercadex/coins/aptos.png" width={100} height={100} alt="aptos" />
          </div>
          <Bnb>
            <Image src="/images/mercadex/coins/bnb.png" width={70} height={70} alt="bnb" />
          </Bnb>
          <Ethereum>
            <Image src="/images/mercadex/coins/ethereum.png" width={100} height={100} alt="ethereum" />
          </Ethereum>
          <div style={{ position: 'absolute', right: '-40px', top: '10px' }}>
            <Image src="/images/mercadex/coins/polygon.png" width={70} height={70} alt="polygon" />
          </div>
        </Wrapper>
      </MainWrapper>

      <CardWrapper>
        <Card background="#E6E51E" color="#000">
          <div style={{ width: '', height: '120px', textAlign: 'right' }}>
            <Image src="/images/mercadex/trade.png" width={130} height={130} alt="trade" />
          </div>
          <CardTitle>Trade</CardTitle>
          <div style={{ color: '#696666', lineHeight: '20px' }}>Here goes a small text to recap the trending.</div>
        </Card>
        <Card background="#000" color="#fff">
          <div style={{ width: '', height: '120px', textAlign: 'center' }}>
            <Image src="/images/mercadex/money-bag.png" width={100} height={100} alt="money-bag" />
          </div>
          <CardTitle>Earn</CardTitle>
          <div style={{ color: '#E7E7E7', lineHeight: '20px' }}>Here goes a small text to recap Earn.</div>
        </Card>
        <Card background="#496AF1" color="#fff">
          <div style={{ width: '', height: '120px' }}>
            <Image src="/images/mercadex/NFT.png" width={150} height={150} alt="NFT" />
          </div>
          <CardTitle>Game & NFT</CardTitle>
          <div style={{ color: '#E7E7E7', lineHeight: '20px' }}>Here goes a small text to recap Game & NFT.</div>
        </Card>
      </CardWrapper>

      <div style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
          <Image src="/images/mercadex/hero.png" alt="hero" width={700} height={150} unoptimized />
        </div>
        <ChainTags />
      </div>

      {/* <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['center', null, null, 'center']}
        justifyContent="center"
        mt={['50px', null, 0]}
        pl={['0px', '0px', '0px', '30px']}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column">
          <Text textAlign={isMobile || isMd ? 'center' : 'left'} pr={isMobile ? 0 : '10px'} mb="16px">
            <StyledText display="inline-block" lineHeight="110%" fontWeight={600} color="text" mr="8px">
              {t("Everyone's")}
            </StyledText>
            <StyledText
              display="inline-block"
              fontWeight={600}
              lineHeight="110%"
              color="secondary"
              mr={isMobile ? 0 : '8px'}
            >
              {t('Favorite')}
            </StyledText>
            {isMobile && <br />}
            <StyledText display="inline-block" lineHeight="110%" fontWeight={600} color="text">
              {t('DEX')}
            </StyledText>
          </Text>
          <Text
            mb="24px"
            color={theme.isDark ? '#B8ADD2' : '#7A6EAA'}
            maxWidth={600}
            fontSize={['20px', '20px', null, '24px']}
            textAlign={isMobile ? 'center' : 'left'}
            lineHeight="110%"
            fontWeight={600}
          >
            {t('Trade, earn, and own crypto on the all-in-one multichain DEX')}
          </Text>

          <Flex justifyContent={isMobile || isMd ? 'center' : 'start'}>
            {!account && (
              <ConnectWalletButton
                style={{ borderRadius: isXs ? 12 : undefined, background: '#E6E51E', color: '#000', boxShadow: 'none' }}
                scale="md"
                mr="8px"
              />
            )}
            <NextLinkFromReactRouter to="/swap">
              <Button
                scale="md"
                style={{
                  borderRadius: isXs ? 12 : undefined,
                  background: '#E6E51E',
                  borderColor: '#E6E51E',
                  color: '#000',
                }}
                variant={!account ? 'secondary' : 'primary'}
              >
                {t('Trade Now')}
              </Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
        <Flex
          height={['100%', null, null, '100%']}
          width={['100%', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <BunnyWrapper>
            <CakeBox>
              <CakeCanvas
                className={isIOS || isMobile ? 'is-ios' : undefined}
                width={isIOS || isMobile ? 500 : width}
                height={isIOS || isMobile ? 500 : height}
                ref={canvasRef}
              />
              {!(isIOS || isMobile) && (
                <VideoWrapper>
                  <CakeVideo ref={videoRef} width={width} autoPlay muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/bunnyv2.webm`} type="video/webm" />
                  </CakeVideo>
                  <CakeVideo ref={starVideoRef} width={width} autoPlay loop muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/star.webm`} type="video/webm" />
                  </CakeVideo>
                  <CakeVideo ref={cakeVideoRef} width={width} autoPlay loop muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/hero-cake.webm`} type="video/webm" />
                  </CakeVideo>
                  <CakeVideo ref={rock01VideoRef} width={width} autoPlay loop muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/rock01.webm`} type="video/webm" />
                  </CakeVideo>
                  <CakeVideo ref={rock02VideoRef} width={width} autoPlay loop muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/rock02.webm`} type="video/webm" />
                  </CakeVideo>
                  <CakeVideo ref={rock03VideoRef} width={width} autoPlay loop muted playsInline>
                    <source src={`${ASSET_CDN}/web/landing/rock03.webm`} type="video/webm" />
                  </CakeVideo>
                </VideoWrapper>
              )}
            </CakeBox>
          </BunnyWrapper>
        </Flex>
      </Flex> */}
    </>
  )
}

export default Hero
