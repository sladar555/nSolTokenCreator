import FAQItem from "./FAQItem";

const answers = [
    {
        question: "What is the Solana Token Creator?",
        answer: "SolTokenCreator.io is a user-friendly platform that enables you to easily create and manage your own tokens on the Solana blockchain. Whether you're looking to launch a utility token, a meme coin, or need a unique market ID, our tool simplifies the process.",
    },
    {
        question: "How do I create a token on SolTokenCreator.io?",
        answer: "To create a token, simply visit our website, fill in the required fields such as token name, symbol, and total supply, and then choose additional features like mintability or freezability. Once you’ve configured your settings, you can deploy your token directly on the Solana blockchain.",
    },
    {
        question: "Is it free to use SolTokenCreator.io?",
        answer: "Creating a token on SolTokenCreator.io involves certain network fees that are required by the Solana blockchain for processing the creation and transactions. The cost for creating a token is 0.5 SOL and the cost for creating an Openbook Market ID is 2.33 SOL.",
    },
    {
        question: "Can I set a mint and freeze authority for my token?",
        answer: "Yes, SolTokenCreator.io allows you to configure both mint and freeze authorities for your token.",
    },
    {
        question: "What is a Market ID and why do I need one?",
        answer: "A Market ID is a unique identifier for your token on the Solana network, which is necessary for integrating your token with exchanges and other DeFi platforms. It helps users and services distinguish your token from others on the network.",
    },
    {
        question: "How can I ensure my token is secure?",
        answer: "Security is a priority at SolTokenCreator.io. We recommend following best practices such as keeping your private keys secure, using a reputable Solana wallet, and setting appropriate authorities for minting and freezing.",
    },
    {
        question: "What should I do if I encounter issues with token creation?",
        answer: "If you face any technical difficulties while creating your token, please consult our Help Center or contact our support team directly through the Telegram or Discord Channels. We are here to assist you with any issues or questions you might have.",
    },
    {
        question: "Can I update my token’s information after creation?",
        answer: "Some aspects of your token can be updated post-creation, such as minting additional tokens if you have retained minting authority. However, fundamental characteristics like the token symbol and initial supply are immutable once set.",
    },
    {
        question: "How can I add my token to cryptocurrency exchanges?",
        answer: "To list your token on cryptocurrency exchanges, you'll first need to ensure your token complies with the exchange's listing criteria, which often includes aspects like liquidity provisions, community interest, and security audits. You'll need to apply through their formal listing process and provide your Market ID.",
    },
    {
        question: "Can I create a token without any coding experience?",
        answer: "Absolutely! SolTokenCreator.io is designed to be accessible for everyone, regardless of their technical background. Our platform guides you through each step of the token creation process without the need for any coding.",
    }
];

const FAQ = () => {
    return (
        <div className="container mt-[85px]">
            <div className="w-full flex flex-col items-start justify-center mb-10 sm:mb-20">
                <h2 className="text-[32px] sm:text-[40px] font-bold mb-[30px]" style={{ fontFamily: "DM Sans" }} >Frequently asked questions</h2>
                
                <FAQItem index={"01"} question={answers[0].question} answer={answers[0].answer} />
                <FAQItem index={"02"} question={answers[1].question} answer={answers[1].answer} />
                <FAQItem index={"03"} question={answers[2].question} answer={answers[2].answer} />
                <FAQItem index={"04"} question={answers[3].question} answer={answers[3].answer} />
                <FAQItem index={"05"} question={answers[4].question} answer={answers[4].answer} />
                <FAQItem index={"06"} question={answers[5].question} answer={answers[5].answer} />
                <FAQItem index={"07"} question={answers[6].question} answer={answers[6].answer} />
                <FAQItem index={"08"} question={answers[7].question} answer={answers[7].answer} />
                <FAQItem index={"09"} question={answers[8].question} answer={answers[8].answer} />
                <FAQItem index={"10"} question={answers[9].question} answer={answers[9].answer} />
            </div>
        </div>
    );
}

export default FAQ;