export default function formatDate(date) {
	let day = date.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);

	if (sameDay(date, today)) {
		day = "Today";
	} else if (sameDay(date, yesterday)) {
		day = "Yesterday";
	}
	
	const time = date.toLocaleTimeString('en-us', { "hour": "numeric", "minute": "numeric" });
	return day + " at " + time;
}

function sameDay(date1, date2) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}