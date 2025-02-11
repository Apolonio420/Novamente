"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const publicRoutes = ["/", "/sign-in", "/sign-up"];

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	function LayoutContent({ children }: { children: React.ReactNode }) {
		const pathname = usePathname();
		const { isSignedIn } = useUser();
		const isPublicRoute = publicRoutes.includes(pathname);

		return (
			<div className="flex min-h-screen">
				{isSignedIn && !isPublicRoute && <Sidebar />}
				<main className={`flex-1 ${isSignedIn && !isPublicRoute ? 'md:ml-64' : ''}`}>
					<div className="max-w-7xl mx-auto px-4 py-8 md:py-8 pt-20 md:pt-8">
						{children}
					</div>
				</main>
			</div>
		);
	}

	return (
		<ClerkProvider>
			<html lang="es">
				<head>
					<meta 
						name="viewport" 
						content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
					/>
					<meta 
						name="format-detection" 
						content="telephone=no"
					/>
				</head>
				<body className="bg-background text-textLight font-sans">
					<div>
						<header className="bg-primary p-4 flex items-center justify-between border-b-2 border-gray-700">
							<div className="flex items-center">
								<Image
									src="/logo.png"
									alt="Logo"
									width={40}
									height={40}
									className="rounded-full"
									priority
								/>
								<h1 className="text-xl font-bold">Novamente</h1>
							</div>
							<nav className="flex space-x-4">
								<a href="#" className="text-white hover:text-gray-300">Inicio</a>
								<a href="#" className="text-white hover:text-gray-300">Servicios</a>
								<a href="#" className="text-white hover:text-gray-300">Contacto</a>
							</nav>
						</header>
						<LayoutContent>{children}</LayoutContent>
						<Toaster />
						<footer className="bg-primary p-4 text-center border-t-2 border-gray-700">
							<p className="text-sm">© 2024 Novamente</p>
							<div className="flex justify-center space-x-4 mt-2">
								<a href="#" className="text-white hover:text-gray-300">Facebook</a>
								<a href="#" className="text-white hover:text-gray-300">Twitter</a>
								<a href="#" className="text-white hover:text-gray-300">Instagram</a>
							</div>
						</footer>
					</div>
				</body>
			</html>
		</ClerkProvider>
	);
}

