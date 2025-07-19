import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				civic: {
					blue: 'hsl(var(--civic-blue))',
					'blue-light': 'hsl(var(--civic-blue-light))',
					'blue-dark': 'hsl(var(--civic-blue-dark))',
					green: 'hsl(var(--civic-green))',
					'green-light': 'hsl(var(--civic-green-light))',
					'green-dark': 'hsl(var(--civic-green-dark))',
					mint: 'hsl(var(--civic-mint))',
					'mint-light': 'hsl(var(--civic-mint-light))',
					gold: 'hsl(var(--civic-gold))',
					orange: 'hsl(var(--civic-orange))',
					red: 'hsl(var(--civic-red))',
					purple: 'hsl(var(--civic-purple))',
					teal: 'hsl(var(--civic-teal))',
					indigo: 'hsl(var(--civic-indigo))',
					cyan: 'hsl(var(--civic-cyan))',
					pink: 'hsl(var(--civic-pink))',
					slate: 'hsl(var(--civic-slate))',
					white: 'hsl(var(--civic-white))',
					'gray-50': 'hsl(var(--civic-gray-50))',
					'gray-100': 'hsl(var(--civic-gray-100))',
					'gray-200': 'hsl(var(--civic-gray-200))',
					'gray-300': 'hsl(var(--civic-gray-300))',
					success: 'hsl(var(--civic-success))',
					warning: 'hsl(var(--civic-warning))',
					error: 'hsl(var(--civic-error))',
					info: 'hsl(var(--civic-info))'
				}
			},
			backgroundImage: {
				'gradient-civic': 'var(--gradient-civic)',
				'gradient-civic-alt': 'var(--gradient-civic-alt)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-glass-blue': 'var(--gradient-glass-blue)',
				'gradient-fund-flow': 'var(--gradient-fund-flow)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-cards': 'var(--gradient-cards)',
				'gradient-pastel': 'var(--gradient-pastel)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-premium': 'var(--gradient-premium)',
				'gradient-modern': 'var(--gradient-modern)',
				'gradient-executive': 'var(--gradient-executive)',
				'gradient-luxury': 'var(--gradient-luxury)',
				'gradient-power': 'var(--gradient-power)',
				'gradient-trust': 'var(--gradient-trust)',
				'gradient-interactive': 'var(--gradient-interactive)'
			},
			boxShadow: {
				'glass': 'var(--shadow-glass)',
				'elevation': 'var(--shadow-elevation)',
				'glow': 'var(--shadow-glow)',
				'fab': 'var(--shadow-fab)',
				'modal': 'var(--shadow-modal)',
				'card-hover': 'var(--shadow-card-hover)',
				'subtle': 'var(--shadow-subtle)',
				'success': 'var(--shadow-success)',
				'warning': 'var(--shadow-warning)',
				'error': 'var(--shadow-error)',
				'luxury': 'var(--shadow-luxury)',
				'executive': 'var(--shadow-executive)',
				'premium': 'var(--shadow-premium)',
				'trust': 'var(--shadow-trust)',
				'interactive': 'var(--shadow-interactive)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'spring': 'var(--transition-spring)',
				'page': 'var(--transition-page)',
				'morph': 'var(--transition-morph)',
				'gentle': 'var(--transition-gentle)',
				'cinematic': 'var(--transition-cinematic)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
