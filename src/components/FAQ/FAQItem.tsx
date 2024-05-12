import React, { useState } from "react";
import CaretDirection from "./CaretDirection";
import "./FAQItem.scss";

const FAQItem = ({ index, question, answer }: any) => {
    const [active, setActive] = useState(false);

    const toggleHandler = (e: any) => {
        e.preventDefault();
        setActive(!active);
    }

    return (
        <div className="flex-col w-full cursor-pointer faq-item" >
            <div className="w-full py-4 flex flex-row justify-between space-x-4 mb-1" onClick={toggleHandler}>
                <div className="flex flex-row justify-between space-x-4">
                    {/* <span className="text-[#777E90] text-[18px] leading-6 font-medium faq-item-idx">{index}</span> */}
                    <span className="text-[#FCFCFD] text-[18px] leading-6 font-medium faq-item-question">{ question }</span>
                </div>
                <div className="min-w-[24px]">
                    <CaretDirection arrangeDir={active} />
                </div>
            </div>
            {
                (active == false && index == "07") ? null : <h3 className="w-full h-0.5 rounded-full bg-[#292B2B] mb-1"></h3>
            }
            {
                (active)? 
                    <div className="w-full py-4 pl-1 mb-1 text-[#777E90] text-[18px] leading-6">
                        {answer}
                    </div>: null
            }
        </div>
    );
}

export default FAQItem;