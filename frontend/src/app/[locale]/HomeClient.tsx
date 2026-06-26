import Hero from "@/components/Hero/Hero";
import Technologies from "@/components/home/Technologies/Technologies";
import OurSolutions from "@/components/home/OurSolutions/OurSolutions";
import WhatWeDo from "@/components/WhatWeDo/WhatWeDo";
import Testimonials from "@/components/Testimonials/Testimonials";
import Brands from "@/components/Brands/Brands";
import ProgrammingServices from "@/components/ProgrammingServices/ProgrammingServices";
import "./Home.scss";

export default function HomeClient() {
	return (
		<main>
			<Hero />
			<ProgrammingServices />
			<OurSolutions />
			<WhatWeDo />
			<Testimonials />
			<Technologies />
			<Brands />
		</main>
	);
}
