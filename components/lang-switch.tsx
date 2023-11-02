import { useTranslation } from "next-i18next";

const LangSwitch = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: any) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>EN</button>
      <button onClick={() => changeLanguage("ru")}>RUS</button>
    </div>
  );
};

export default LangSwitch;
