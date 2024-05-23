import "./Home.scss";
import CreateTokenComponent from "../components/CreateToken";
import { Helmet } from "react-helmet";

const Home = () => {    
    return (
        <div className="relative w-full px-4">
            <section className="tf-section hero-slider">
                <div className="container mt-[85px]">
                    <div className="py-[20px] lg:!py-[50px]">
                        <div className="container flex flex-col gap-[25px] items-center justify-start w-full">
                            <a href="/" className="mb-4">
                                <img width={350} src="assets/images/logo.png" alt="SolTokenCreator"/>
                            </a>
                            <div className="flex flex-col gap-[3px] items-center font-[400px] leading-[29px]">
                                <p>Deploy a token from 0.067 SOL</p>
                                <p>OpenBook Market creation from 0.45 SOL</p>
                            </div>
                            <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-[20px]">
                                <a href="/create" className="w-full sm:w-[250px] create-btn">CREATE TOKEN</a>
                                <a href="/market" className="w-full sm:w-[250px] openbook-btn">OPENBOOK MANAGER</a>
                            </div>
                            <div className="mb-[20px] flex flex-col gap-[5px] 2xl:gap-[10px] lg:flex-row items-start lg:items-center mt-[60px]">
                                <div className="features__item">
                                    <h5 className="features__heading">
                                        <img className="features__heading-icon" src="/assets/icons/feature_create_icon.svg" alt="Feature Create Icon" />
                                        <span>Token Creation</span>
                                    </h5>
                                    <p className="features__description">
                                        We provide ready-to-use, affordable Token Creater Tool for all developers for the cheapest price on the market.
                                    </p>
                                    <a className="features__link" href="/lp-manager">
                                        Try Now
                                        <img className="features__link-icon" src="/assets/icons/feature_link_icon.svg" alt="Feature Link Icon" />
                                    </a>
                                </div>
                                <div className="features__item">
                                    <h5 className="features__heading">
                                        <img className="features__heading-icon" src="/assets/icons/feature_openbook_icon.svg" alt="Feature Openbook Icon" />
                                        <span>Openbook Manager</span>
                                    </h5>
                                    <p className="features__description">
                                    Openbook Market of any size for everyone. Priority Fees included for transaction landing.
                                    </p>
                                    <a className="features__link" href="/lp-manager">
                                        Try Now
                                        <img className="features__link-icon" src="/assets/icons/feature_link_icon.svg" alt="Feature Link Icon" />
                                    </a>
                                </div>
                                <div className="features__item border-none">
                                    <h5 className="features__heading">
                                        <img className="features__heading-icon" src="/assets/icons/create_lp_icon.svg" alt="Feature Upcoming Icon" />
                                        <span>Raydium LP Manager</span>
                                    </h5>
                                    <p className="features__description">
                                    Manage the LP. Create a pool, add liquidity, close the pool.
                                    </p>
                                    <a className="features__link" href="/lp-manager">
                                        Try Now
                                        <img className="features__link-icon" src="/assets/icons/feature_link_icon.svg" alt="Feature Link Icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;