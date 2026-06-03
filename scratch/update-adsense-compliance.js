const fs = require('fs');
const path = require('path');

const updates = {
  de: "Diese Website zeigt über Google AdSense eingebundene Werbeanzeigen an. Google und Drittanbieter verwenden Cookies, um Anzeigen basierend auf Ihren vorherigen Besuchen auf dieser und anderen Websites im Internet zu schalten. Die Verwendung von Werbecookies durch Google ermöglicht es Google und seinen Partnern, Anzeigen basierend auf Besuchen auf dieser Website und/oder anderen Websites im Internet zu schalten. Sie können personalisierte Werbung in den Google-Anzeigeneinstellungen (https://www.google.com/settings/ads) deaktivieren. Alternativ können Sie die Verwendung von Cookies von Drittanbietern für personalisierte Werbung auf www.aboutads.info deaktivieren.",
  
  en: "This website displays advertisements integrated through Google AdSense. Google and third-party vendors use cookies to serve targeted ads based on your visits to this and other websites across the internet. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet. You can easily opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads). Alternatively, you can opt out of third-party vendors' cookies for personalized advertising by visiting www.aboutads.info.",
  
  es: "Este sitio web muestra anuncios integrados a través de Google AdSense. Google y proveedores externos utilizan cookies para publicar anuncios dirigidos según tus visitas previas a este y otros sitios web en Internet. El uso de cookies de publicidad por parte de Google permite a Google y a sus socios publicar anuncios a los usuarios según sus visitas a este sitio y/u otros sitios en Internet. Puedes optar por no recibir publicidad personalizada visitando la Configuración de Anuncios de Google (https://www.google.com/settings/ads). Alternativamente, puedes optar por no recibir cookies de proveedores externos para publicidad personalizada visitando www.aboutads.info.",
  
  fr: "Ce site affiche des publicités intégrées via Google AdSense. Google et les fournisseurs tiers utilisent des cookies pour diffuser des annonces ciblées basées sur vos visites précédentes sur ce site et d'autres sites sur Internet. L'utilisation de cookies publicitaires par Google permet à Google et à ses partenaires de diffuser des annonces aux utilisateurs basées sur leur visite sur ce site et/ou d'autres sites sur Internet. Vous pouvez facilement désactiver la publicité personnalisée en configurant vos préférences directement dans les paramètres des annonces Google (https://www.google.com/settings/ads). Alternativement, vous pouvez désactiver les cookies de tiers pour la publicité personnalisée en visitant www.aboutads.info.",
  
  it: "Questo sito web mostra annunci tramite Google AdSense. Google e fornitori terzi utilizzano cookie per mostrare annunci mirati in base alle visite precedenti a questo o altri siti web. L'uso dei cookie pubblicitari da parte di Google consente a Google e ai suoi partner di mostrare annunci in base alla visita a questo e/o ad altri siti su Internet. È possibile disattivare la pubblicità personalizzata nelle impostazioni degli annunci Google (https://www.google.com/settings/ads). In alternativa, è possibile disattivare l'uso dei cookie da parte di fornitori terzi per la pubblicità personalizzata visitando www.aboutads.info.",
  
  ja: "当ウェブサイトでは、Google AdSenseを介した広告表示を行っています。Googleおよびサードパーティベンダーは、ユーザーが当サイトや他のウェブサイト에過去にアクセスした際の情報を元に、クッキーを使用してパーソナライズ広告を表示します。Googleの広告クッキーの使用により、Googleとそのパートナーは、当サイトや他のサイトへのアクセス情報に基づいて広告をユーザーに提供できます。ユーザーは、Googleの広告設定（https://www.google.com/settings/ads）でパーソナライズ広告をオプトアウトできます。または、www.aboutads.infoにアクセスして、サードパーティベンダーのパーソナライズ広告用クッキーの使用をオプトアウトすることもできます。",
  
  ko: "본 웹사이트는 구글(Google)에서 제공하는 웹 광고 서비스인 '구글 애드센스'를 게재합니다. 구글 및 제3자 제공업체는 사용자가 본 사이트 및 다른 인터넷 사이트를 방문한 기록을 바탕으로 쿠키를 사용하여 맞춤형 광고를 게재합니다. 구글의 광고 쿠키 사용을 통해 구글과 그 파트너사는 사용자의 본 사이트 및 타 사이트 방문 정보를 기반으로 광고를 게재할 수 있습니다. 사용자는 구글 광고 설정(https://www.google.com/settings/ads)을 방문하여 맞춤형 광고 게재를 설정하거나 거부할 수 있습니다. 또는 www.aboutads.info를 방문하여 제3자 제공업체의 맞춤형 광고용 쿠키 사용을 거부하도록 선택할 수도 있습니다.",
  
  pt: "Este site exibe anúncios integrados através do Google AdSense. O Google e fornecedores terceirizados usam cookies para veicular anúncios direcionados com base em suas visitas anteriores a este e outros sites na internet. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios aos usuários com base em suas visitas a este site e/ou a outros sites na Internet. Você pode optar por sair da publicidade personalizada a qualquer momento nas Configurações de Anúncios do Google (https://www.google.com/settings/ads). Alternativamente, você pode optar por desativar o uso de cookies de fornecedores terceirizados para publicidade personalizada visitando www.aboutads.info."
};

Object.entries(updates).forEach(([locale, adsenseDesc]) => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);

  if (json.Privacy) {
    json.Privacy.adsenseDesc = adsenseDesc;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated privacy policy AdSense description for: ${locale}`);
  } else {
    console.log(`Privacy key not found in: ${locale}`);
  }
});

console.log("All locale privacy policies updated for AdSense compliance!");
