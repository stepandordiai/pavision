// TODO: learn this
import {
	formatDistanceToNow,
	differenceInDays,
	format,
	isToday,
	isYesterday,
} from "date-fns";

import { cs } from "date-fns/locale";

export default function getCreatedDate(date: string) {
	const createdDate = new Date(date);

	if (isToday(createdDate)) return "today";
	if (isYesterday(createdDate)) return "yesterday";

	const days = differenceInDays(new Date(), createdDate);

	if (days <= 7) {
		return formatDistanceToNow(createdDate, {
			addSuffix: true,
			locale: cs,
		});
	}

	return format(createdDate, "d MMMM yyyy", {
		locale: cs,
	});
}
