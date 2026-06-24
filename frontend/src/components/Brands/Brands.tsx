import { getTranslations } from "next-intl/server";
import "./styles.scss";

const brands = [
	{
		name: "Crestron",
		logo: "https://dominiontx.com/wp-content/uploads/2017/12/Crestron-PNG.png",
		bgImg:
			"https://kbbonline.com/wp-content/uploads/2023/04/Crestron.HorizonKeypadsDimmers.jpg",
	},
	{
		name: "Loxone",
		logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Logo-Loxone-green-Web.png",
		bgImg:
			"https://www.soundsuit.fm/images/sonos/loxone_hero_full_e2d9ac8e.jpg",
	},
	{
		name: "Lutron",
		logo: "https://www.blindsanddesignsltd.com/wp-content/uploads/sites/433/2019/04/logo-lutron.png",
		bgImg:
			"https://support.lutron.com/sites/default/files/2025-02/Homepage%20Images_HomeWorks_832x512.jpg",
	},
	{
		name: "Denon",
		logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Denon_Logo.svg",
		bgImg:
			"https://www.hifi-voice.com/images/testy/2019/20190503/2019-04-30-DK-Denon-AVC-X6500-1.jpg",
	},
	{
		name: "Marantz",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Marantz_%28logo%29.svg/1280px-Marantz_%28logo%29.svg.png",
		bgImg:
			"https://www.rodel-audio.cz/ew/ew_images/image?EwImage=f40c1fbb-4f17-4220-8d37-5f19b7cc14c5&Filter=38bb315d-6497-4ad4-9275-7213493a8945",
	},
	{
		name: "LG",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/960px-LG_logo_%282014%29.svg.png",
		bgImg:
			"https://www.lg.com/cz/lg-experience/images/lg-lab/2023/what-is-a-smart-tv/lg-experience-lg-lab-what-is-a-smart-tv-key-visual.jpg",
	},
	{
		name: "Sonos",
		logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Sonos_%28Unternehmen%29_logo.svg",
		bgImg:
			"https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/16015943/80143397_7FF2_4584_809D_08E74930277C.jpeg?quality=90&strip=all&crop=0%2C5.5555555555556%2C100%2C88.888888888889&w=2400",
	},
	{
		name: "Bowers & Wilkins",
		logo: "https://upload.wikimedia.org/wikipedia/commons/7/70/B%26W_Logo_new.svg",
		bgImg:
			"https://hifimanie.cz/wp-content/uploads/2024/03/Bowers_Wilkins_705_S3_Signature2-2000x1466x.jpg",
	},
	{
		name: "Ubiquiti",
		logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/Ubiquiti_Logo.png",
		bgImg:
			"https://images.squarespace-cdn.com/content/v1/5d3c73c906ac510001158d1b/1620456469724-S1ZF63BGI5JA32VQ0LKE/_DSC0222.jpeg",
	},
	{
		name: "MicroTik",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MikroTik_logo.svg/3840px-MikroTik_logo.svg.png",
		bgImg: "https://5.imimg.com/data5/AH/FM/MY-10416151/mikrotik-server.jpg",
	},
	,
	{
		name: "Cisco",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cisco_logo.svg/3840px-Cisco_logo.svg.png",
		bgImg:
			"https://www.networkworld.com/wp-content/uploads/2023/11/dsc04898-100716671-orig.jpg?quality=50&strip=all",
	},
	{
		name: "Jablotron",
		logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/20/Jablotron_logo.svg/1280px-Jablotron_logo.svg.png",
		bgImg:
			"https://www.jablotron.com/ver/1731315060992/api/stages/files?variant=next-fe&file=/produkty-a-sluzby/alarmy/kamery/jablotron_ban_2408_web_kamery_zaznam_1-ban_740x480_vin.jpg&width=3840",
	},
	{
		name: "Paradox",
		logo: "https://www.paradox.cz/files/2025/12/paralogo60.png",
		bgImg:
			"https://cms.bgwgroup.com.au/components/suppliers/landing-pages/bgwt/paradox/assets/paradox_12132.png",
	},
	{
		name: "Risco",
		logo: "https://images.seeklogo.com/logo-png/22/2/risco-group-logo-png_seeklogo-227111.png",
		bgImg:
			"https://securityjournaluk.com/wp-content/uploads/2023/09/RISCO-ADI-distribution-agreement-scaled-1.jpg",
	},
];

export default async function Brands() {
	const t = await getTranslations("brands");

	return (
		<section className="section">
			<h2 className="section__title">{t("heading")}</h2>
			<div className="brands">
				{brands.map((brand, i) => {
					return (
						<div className="brand-container" key={i}>
							<p className="brand-name">{brand?.name}</p>
							<img className="brand-bg" src={brand?.bgImg} alt="" />
						</div>
					);
				})}
			</div>
		</section>
	);
}
