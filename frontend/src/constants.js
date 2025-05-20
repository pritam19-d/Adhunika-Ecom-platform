// export const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : ""
export const BASE_URL = "";
export const PRODUCTS_URL = "/api/products";
export const USERS_URL = "/api/users";
export const ORDERS_URL = "/api/orders";
export const PAYPAL_URL = "/api/config/paypal";
export const UPLOAD_URL = "/api/upload";

export const dateFormatting = (date) => {
	return new Date(date)
		.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true, // For AM/PM format
			timeZone: "Asia/Kolkata", // Optional: set to your desired timezone
		})
		.replace(",", " at");
};
