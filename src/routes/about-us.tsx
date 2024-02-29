import {useLoader} from "./root";
import {useTranslation} from "react-i18next";

export default function AboutUs(){
    const {setLoading} = useLoader();
    setLoading(false);
    const [t] = useTranslation("global");


    return (
        <>
            <p className="text-lg text-neutral font-semibold">{t("about-us.title")}</p>
            <p className="mt-4 font-semibold text-lg text-neutral">{t("about-us.buyer-title")}</p>
            <div dangerouslySetInnerHTML={{ __html: t("about-us.list-buyer") }} />

            <p className="mt-4 font-semibold text-lg text-neutral">{t("about-us.creator-title")}</p>
            <div dangerouslySetInnerHTML={{ __html: t("about-us.list-creator") }} />
            {/*<ul className="text-neutral">*/}
            {/*    <li>1. Перейдите на страницу создания событий (+) и заполните необходимые данные, включая крайний срок покупки билетов и дату окончания события.</li>*/}
            {/*    <li>2. После завершения события определите выигрышный вариант в течение 24 часов. Если этого не произойдет, событие будет аннулировано.</li>*/}
            {/*    <li>3. После определения победителя вы получите 3,5% от общего объема события, а платформе Agora будет начислено 1,5%.</li>*/}
            {/*    <li>Помните, что вы несете ответственность за честное определение победителя и своевременное завершение события.</li>*/}
            {/*</ul>*/}

            <p className="font-semibold text-lg text-neutral mt-4 mb-5">{t("about-us.footer")}</p>
        </>
    );
}