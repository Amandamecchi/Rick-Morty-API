import "../app/globals.css";
export const metadata = {
	title: "Rick and Morty App",
	descripition: "Primeiro consumo ed api grátis",
};
export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				{children}
			</body>
		</html>
	);
}
