"use client";

import { Image } from "next/image";
import Link from "next/link"
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from
    "@/components/ui/navigation-menu"
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem
} from
    "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
export default function RootPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-primary text-primary-foreground">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="#" className="flex items-center gap-2" prefetch={false}>
                        <MountainIcon className="h-6 w-6" />
                        <span className="font-semibold">Slick Solutions</span>
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Estimates
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Invoices
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Scheduling
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Payments
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Analytics
                                </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <Link href="#" className="px-4 py-2 hover:bg-primary/20" prefetch={false}>
                                    Settings
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Image src="/placeholder.svg" alt="User avatar" width={32} height={32}
                                        className="rounded-full" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Logged in as John Doe</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="#" prefetch={false}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="#" prefetch={false}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="#" prefetch={false}>
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="bg-muted py-8 md:py-12">
                    <div className="container grid gap-8 px-4 md:px-6">
                        <div className="grid gap-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Streamline Your
                                Business Operations</h1>
                            <p className="text-muted-foreground">
                                Slick Solutions provides a comprehensive suite of tools to manage your
                                business efficiently.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Estimates</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Create transparent estimates for your clients, track their status, and convert them to
                                        invoices.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Estimates
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Invoicing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Generate professional invoices, set up recurring billing, and track payments.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Invoices
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Scheduling</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Manage your team schedules, send email confirmations, and track
                                        availability.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Scheduling
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Payments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Collect deposits, process payments, and manage your business financial
                                        transactions.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Payments
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="py-8 md:py-12">
                    <div className="container grid gap-8 px-4 md:px-6">
                        <div className="grid gap-2">
                            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Streamline Your
                                Workflows</h2>
                            <p className="text-muted-foreground">
                                Slick Solutions provides tools to help you manage your business more
                                efficiently.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Real-Time Chat</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Communicate with your team and clients in real-time, share files, and stay
                                        connected.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Start Chatting
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Customer Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Manage your client information, track their interactions, and provide personalized
                                        service.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Customers
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Branding</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Customize your invoices, estimates, and other documents with your brand
                                        colors and logo.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Branding
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="bg-muted py-8 md:py-12">
                    <div className="container grid gap-8 px-4 md:px-6">
                        <div className="grid gap-2">
                            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Gain Valuable
                                Insights</h2>
                            <p className="text-muted-foreground">
                                Slick Solutions provides comprehensive analytics to help you make
                                informed decisions.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Business Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Track your revenue, expenses, and other key performance indicators to optimize
                                        your business.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        View Analytics
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Role-Based Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Manage permissions and access levels for your team, clients, and
                                        freelancers.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Access
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="bg-[#00AE98]/20 backdrop-blur-lg shadow-lg
 hover:shadow-[0_0_20px_rgba(0,174,152,0.5)] transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>Client Portal</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Provide your clients with a secure portal to view estimates, invoices, and
                                        schedules.</p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="font-medium underline" prefetch={false}>
                                        Manage Client Portal
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-primary text-primary-foreground">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6
 md:flex-row md:py-8">
                    <div className="flex items-center gap-2">
                        <MountainIcon className="h-6 w-6" />
                        <span className="font-semibold">Slick Solutions</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Link href="#" className="hover:underline" prefetch={false}>
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:underline" prefetch={false}>
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:underline" prefetch={false}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}
function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}