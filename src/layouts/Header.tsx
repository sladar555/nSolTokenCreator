import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";

const Header = () => {
    const wallet = useWallet();

    return (
        <header className="relative h-[80px] mx-[0px] p-[0px] bg-black flex items-center justify-center header-fixed w-full">
            <div className="fixed max-w-[100vw] flex items-center z-20 w-full h-[120px] py-[20px] sm:py-0 sm:h-[90px] bg-black border-x-0 border-t-0 border-b-[#303030] border-[1px] border-solid">
                <div className="container h-[90px]">
                    <div className="h-[90px] flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center justify-start gap-[20px] lg:gap-[40px]">
                            <Link to="/">
                                <img width={40} src="assets/images/logo-sm.png" alt="SolTokenCreator"/>
                            </Link>
                            <div className="hidden md:block md:flex leading-[51px] text-[15px] text-white font-bold flex flex-row gap-[10px] lg:gap-[20px] items-center">
                                <Link to="/create">
                                    CREATE TOKEN
                                </Link>
                                <Link to="/market">
                                    OPENBOOK MANAGER
                                </Link>
                                <Link to="/lp-manager">
                                    LP MANAGER
                                </Link>
                                <Link to="/airdrop">
                                    AIRDROP
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[10px] lg:gap-[40px] items-center justify-center">
                            <div className="hidden sm:block sm:flex flex-row gap-[5px] lg:gap-[10px] items-center">
                                <a href="#">
                                    <svg className="cursor-pointer border-[1px] rounded-full w-[30px] h-[30px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M11.994 2a10 10 0 1 0 10 10a10 10 0 0 0-10-10m3.18 15.152a.705.705 0 0 1-1.002.352l-2.715-2.11l-1.742 1.608a.3.3 0 0 1-.285.039l.334-2.989l.01.009l.007-.059s4.885-4.448 5.084-4.637c.202-.189.135-.23.135-.23c.012-.23-.361 0-.361 0l-6.473 4.164l-2.695-.918s-.414-.148-.453-.475c-.041-.324.466-.5.466-.5l10.717-4.258s.881-.392.881.258Z"/></svg>
                                </a>
                                <a href="#">
                                    <svg className="cursor-pointer border-[1px] rounded-full w-[26px] h-[26px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
                                </a>
                            </div>
                            <WalletMultiButton style={{ backgroundColor: "#252525", paddingRight: "16px", paddingLeft: "16px", height: "40px", fontSize: "16px", fontFamily: "Gilroy-Bold"  }}></WalletMultiButton>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;