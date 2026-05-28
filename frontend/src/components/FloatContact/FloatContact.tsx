import WhatsappIcon from "../icons/WhatsappIcon";
import "./styles.scss";

export default function FloatContact() {
	return (
		<a
			className="float-contact"
			href="https://wa.me/420775632426"
			target="_blank"
			rel="noopener noreferrer"
		>
			<WhatsappIcon size={20} />
		</a>
	);
}
