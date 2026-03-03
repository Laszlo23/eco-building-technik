import { useState, useEffect } from 'react'
import { 
  Menu, X, Phone, Mail, MapPin, ArrowRight, 
  Building2, Calculator,
  ShoppingCart, Trash2, Plus, Minus,
  User, LogOut, CreditCard, Check,
  ChevronDown, ChevronUp, Award, Star, TrendingUp,
  Home, Package, HelpCircle, Gift, Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import './App.css'

// Types
interface Product {
  id: number
  category: string
  name: string
  description: string
  fullDescription: string
  specs: string[]
  price: string
  priceValue: number
  wholesalePrice?: string
  priceNote?: string
  benefits?: string[]
  image: string
  image2?: string
  certificate?: string
  isTopProduct?: boolean
  rating?: number
  reviews?: number
  technicalDetails?: { label: string; value: string }[]
}

interface CartItem extends Product {
  quantity: number
}

interface User {
  id: string
  email: string
  name: string
  type: 'private' | 'company'
  company?: string
  companyRegister?: string
  companyVat?: string
  isWholesale: boolean
  customerNumber: string
}

// SEO Hook
const useSEO = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ECO Building Technik` : 'ECO Building Technik GmbH'
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', description)
    }
  }, [title, description])
}

function App() {
  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Alle')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productQuantity, setProductQuantity] = useState(1)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  // Payment States
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'invoice' | 'paypal' | 'card' | 'sofort' | 'klarna'>('invoice')
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'confirmation'>('review')
  const [orderNumber, setOrderNumber] = useState('')
  
  // Legal Pages States
  const [showAGBDialog, setShowAGBDialog] = useState(false)
  const [showDatenschutzDialog, setShowDatenschutzDialog] = useState(false)
  const [showImpressumDialog, setShowImpressumDialog] = useState(false)
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Angebot/Lead State
  const [showAngebotDialog, setShowAngebotDialog] = useState(false)
  const [angebotProduct, setAngebotProduct] = useState<Product | null>(null)
  const [angebotForm, setAngebotForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [angebotStatus, setAngebotStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  // Kontaktformular State (Lead-Erfassung)
  const [kontaktForm, setKontaktForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [kontaktStatus, setKontaktStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  // SEO State
  const [activeSection, setActiveSection] = useState('home')
  
  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Register States
  const [registerType, setRegisterType] = useState<'private' | 'company'>('private')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerCompanyName, setRegisterCompanyName] = useState('')
  const [registerCompanyRegister, setRegisterCompanyRegister] = useState('')
  const [registerCompanyVat, setRegisterCompanyVat] = useState('')
  
  // Energy Calculator States
  const [buildingType, setBuildingType] = useState('')
  const [area, setArea] = useState('')
  const [energySource, setEnergySource] = useState<'Strom' | 'Gas'>('Strom')
  const [calcResult, setCalcResult] = useState<any>(null)
  
  const energyPrices = { Strom: 0.30, Gas: 0.10 }
  
  // Formspree ID für Lead-Erfassung - in .env: VITE_FORMSPREE_ID=your_id
  const formspreeId = import.meta.env.VITE_FORMSPREE_ID as string | undefined
  
  const openAngebotDialog = (product?: Product | null) => {
    setAngebotProduct(product || null)
    setAngebotForm({ name: '', email: '', phone: '', message: product ? `Ich interessiere mich für: ${product.name}\n\n` : '' })
    setAngebotStatus('idle')
    setShowAngebotDialog(true)
  }
  
  const submitAngebot = async (e: React.FormEvent) => {
    e.preventDefault()
    setAngebotStatus('sending')
    
    const productInfo = angebotProduct ? `\n\nProduktanfrage: ${angebotProduct.name} (${angebotProduct.category})` : ''
    const fullMessage = angebotForm.message + productInfo
    
    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: angebotForm.name,
            email: angebotForm.email,
            phone: angebotForm.phone,
            message: fullMessage,
            _subject: angebotProduct ? `Angebotsanfrage: ${angebotProduct.name}` : 'Kontaktanfrage',
          }),
        })
        if (res.ok) {
          setAngebotStatus('success')
          setAngebotForm({ name: '', email: '', phone: '', message: '' })
          setTimeout(() => { setShowAngebotDialog(false); setAngebotProduct(null) }, 2500)
        } else {
          setAngebotStatus('error')
        }
      } catch {
        setAngebotStatus('error')
      }
    } else {
      // Fallback: mailto
      const subject = angebotProduct ? `Angebotsanfrage: ${angebotProduct.name}` : 'Kontaktanfrage'
      const body = `Name: ${angebotForm.name}%0D%0AE-Mail: ${angebotForm.email}%0D%0ATelefon: ${angebotForm.phone}%0D%0A%0D%0ANachricht:%0D%0A${encodeURIComponent(fullMessage)}`
      window.location.href = `mailto:office@eco-building.tech?subject=${encodeURIComponent(subject)}&body=${body}`
      setAngebotStatus('success')
      setTimeout(() => { setShowAngebotDialog(false); setAngebotProduct(null) }, 1000)
    }
  }
  
  const submitKontakt = async (e: React.FormEvent) => {
    e.preventDefault()
    setKontaktStatus('sending')
    if (formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: kontaktForm.name,
            email: kontaktForm.email,
            phone: kontaktForm.phone,
            message: kontaktForm.message,
            _subject: `Kontaktanfrage von ${kontaktForm.name}`,
          }),
        })
        if (res.ok) {
          setKontaktStatus('success')
          setKontaktForm({ name: '', email: '', phone: '', message: '' })
        } else {
          setKontaktStatus('error')
        }
      } catch {
        setKontaktStatus('error')
      }
    } else {
      const subject = `Kontaktanfrage von ${kontaktForm.name}`
      const body = `Name: ${kontaktForm.name}%0D%0AE-Mail: ${kontaktForm.email}%0D%0ATelefon: ${kontaktForm.phone}%0D%0A%0D%0ANachricht:%0D%0A${encodeURIComponent(kontaktForm.message)}`
      window.location.href = `mailto:office@eco-building.tech?subject=${encodeURIComponent(subject)}&body=${body}`
      setKontaktStatus('success')
      setKontaktForm({ name: '', email: '', phone: '', message: '' })
    }
  }
  
  // SEO: Dynamic title
  const sectionTitles: Record<string, { title: string; desc: string }> = {
    home: { title: 'A+++ Geräte für nachhaltige Gebäudetechnik', desc: 'Ihr Fachbetrieb in Ebreichsdorf: Nachhaltige Gebäudetechnik mit persönlicher Beratung. A+++ Wärmepumpen, Gas-Brennwertgeräte und Smart Home.' },
    produkte: { title: 'Produkte - Wärmepumpen, Gas-Brennwert & Smart Home', desc: 'Entdecken Sie unsere Top-Produkte: A+++ Wärmepumpen, Gas-Brennwertgeräte, Smart Home Systeme und LED-Beleuchtung.' },
    rechner: { title: 'Energie-Rechner - Heizlast berechnen', desc: 'Berechnen Sie die benötigte Heizleistung für Ihr Gebäude und vergleichen Sie Strom- und Gaskosten mit unserem kostenlosen Rechner.' },
    faq: { title: 'FAQ - Häufig gestellte Fragen', desc: 'Antworten auf die wichtigsten Fragen zu Wärmepumpen, Gas-Brennwertgeräten, Smart Home und Förderungen.' },
    kontakt: { title: 'Kontakt - ECO Building Technik GmbH', desc: 'Kontaktieren Sie uns für eine kostenlose Beratung. Seepromenade 109, 2384 Ebreichsdorf. Tel: +43 664 328 9599' }
  }
  
  useSEO(sectionTitles[activeSection]?.title || '', sectionTitles[activeSection]?.desc || '')
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const sections = ['home', 'produkte', 'rechner', 'faq', 'kontakt']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Products with AI-optimized descriptions
  const products: Product[] = [
    {
      id: 1,
      category: 'Wärmepumpen',
      name: 'JNOD A+++ Wärmepumpe 12kW - BESTSELLER',
      description: 'Die ideale Wärmepumpe für Einfamilienhäuser bis 150m². A+++ Energieeffizienz mit umweltfreundlichem R32 Kältemittel.',
      fullDescription: 'Die JNOD A+++ Wärmepumpe mit 12kW Heizleistung ist die perfekte Lösung für Einfamilienhäuser bis 150m² Wohnfläche. Mit ihrer herausragenden Energieeffizienzklasse A+++ senken Sie Ihre Heizkosten nachhaltig und schonen gleichzeitig die Umwelt. Höchste Effizienz, R32 Kältemittel mit 68% geringerem CO₂-Äquivalent, geräuscharm für Wohngebiete, Smart-Ready für Smart Home Systeme. Heizleistung 12 kW (bei A7/W35), COP bis 5,2, Betriebstemperatur -25°C bis +43°C. Qualifiziert sich für die Klimaförderung des Bundes – bis zu € 5.000 Zuschuss. 5 Jahre Herstellergarantie. Lieferzeit 3-5 Werktage.',
      specs: ['A+++', '12kW', 'R32', 'COP 5.0', 'WiFi'],
      price: '€ 4.299,00',
      priceValue: 4299,
      wholesalePrice: '€ 3.869,00',
      priceNote: 'inkl. MwSt., zzgl. Installation',
      benefits: ['5 Jahre Garantie', 'Klimaförderung bis € 5.000', 'Lieferung in 3-5 Tagen'],
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: true,
      rating: 4.9,
      reviews: 127
    },
    {
      id: 2,
      category: 'Wärmepumpen',
      name: 'JNOD A+++ Wärmepumpe 16kW - TOP EMPFEHLUNG',
      description: 'Beste Wärmepumpe für größere Häuser bis 200m². Höchste Effizienzklasse A+++.',
      fullDescription: 'Die JNOD 16kW Wärmepumpe ist die beste Wahl für größere Einfamilienhäuser und Zweifamilienhäuser.',
      specs: ['A+++', '16kW', 'R32', 'COP 4.8', 'Smart Control'],
      price: '€ 5.499,00',
      priceValue: 5499,
      wholesalePrice: '€ 4.769,00',
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      category: 'Wärmepumpen',
      name: 'Heizung und Warmwasser Wärmepumpe 11 kWh',
      description: 'Energieeffiziente Wärmepumpe für Heizung und Warmwasser. A+++ mit Zertifikat.',
      fullDescription: 'Die JNOD Heizung und Warmwasser Wärmepumpe 11 kWh bietet maximale Energieeffizienz für Heizung und Warmwasserbereitung. Mit A+++ Energieeffizienzklasse und umfassenden Zertifizierungen (CE, UKCA, CB, ERP, ROHS) für höchste Qualität und Sicherheit.',
      specs: ['A+++', '11 kWh', 'Heizung + WW', 'CE/UKCA/CB', 'ERP/ROHS'],
      price: '€ 3.899,00',
      priceValue: 3899,
      wholesalePrice: '€ 2.890,00',
      image: '/images/jnod-heatpump-main.jpg',
      image2: '/images/jnod-heatpump-main.jpg',
      certificate: '/images/jnod-certificate-new.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 56,
      technicalDetails: [
        { label: 'Lagerung/Tankless', value: 'Augenblick/Tankless' },
        { label: 'Leistung (W)', value: '9000' },
        { label: 'Art', value: 'Wärmepumpe Wasser Heizungen' },
        { label: 'Energiequelle', value: 'Elektrisch' },
        { label: 'Anwendung', value: 'Handels, Garage, Hotel, Haushalt, Im freien' },
        { label: 'Kapazität', value: '0' },
        { label: 'App-Gesteuert', value: 'JA' },
        { label: 'Gehäuse-Material', value: 'Verzinktes Blech' },
        { label: 'Installation', value: 'Freistehend' },
        { label: 'Garantie', value: '3 Jahre' },
        { label: 'Kundendienst', value: 'Bereich Wartung und Reparatur Service' },
        { label: 'Betriebs Sprache', value: 'Englisch, Deutsch, Französisch, Niederländisch, Spanisch' },
        { label: 'Privat Form', value: 'JA' },
        { label: 'Logo-/Grafikdesign', value: 'SILK BILDSCHIRM DRUCK, Laser druck' },
        { label: 'Ursprungsort', value: 'Guangdong, China' },
        { label: 'Spannung (V)', value: '230' },
        { label: 'Markenname', value: 'JNOD' },
        { label: 'Modellnummer', value: 'J12HWH' },
        { label: 'Heizleistung (kW)', value: '9' },
        { label: 'Funktion', value: 'Haus Heizung Kühlung DHW, Hohe Effizienz' },
        { label: 'Geräuschpegel (dB)', value: '45' },
        { label: 'Kältemittel', value: 'R290' },
        { label: 'Kompressor', value: 'GMCC' },
        { label: 'Wärmequelle', value: 'Luftquelle 75% Strom' },
        { label: 'Netzmaß (mm)', value: '710 x 710 x 2100' },
        { label: 'Verpackung', value: '75 x 75 x 220 cm' },
        { label: 'Bruttogewicht', value: '150 kg' }
      ]
    },
    // Squirrel M30 Gas-Boiler Serie mit WiFi/App - Gas-Brennwert Kategorie
    {
      id: 41,
      category: 'Gas-Brennwert',
      name: 'Squirrel M30 Gas-Boiler 25kW - WiFi/App',
      description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 200m².',
      fullDescription: 'Der Squirrel M30 ist ein hocheffizienter vollkondensierender Gas-Boiler mit WiFi und App-Steuerung. Mit einer Effizienz von bis zu 103% und kompatibel mit Smart-Thermostaten für maximale Energieeinsparung. CE, ERP und RoHS zertifiziert.',
      specs: ['25kW', 'WiFi/App', 'Kondensierend', '103% Effizienz', 'CE/ERP/RoHS'],
      price: '€ 2.199,00',
      priceValue: 2199,
      wholesalePrice: '€ 1.979,00',
      image: '/images/squirrel-main.jpg',
      image2: '/images/squirrel-main.jpg',
      isTopProduct: true,
      rating: 4.9,
      reviews: 45
    },
    {
      id: 42,
      category: 'Gas-Brennwert',
      name: 'Squirrel M30 Gas-Boiler 30kW - WiFi/App',
      description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 280m².',
      fullDescription: 'Der Squirrel M30 30kW ist ein leistungsstarker vollkondensierender Gas-Boiler mit WiFi und App-Steuerung. Perfekt für mittlere bis große Einfamilienhäuser. Effizienz bis 103%, kompatibel mit allen gängigen Smart-Home-Systemen.',
      specs: ['30kW', 'WiFi/App', 'Kondensierend', '103% Effizienz', 'CE/ERP/RoHS'],
      price: '€ 2.599,00',
      priceValue: 2599,
      wholesalePrice: '€ 2.339,00',
      image: '/images/product-3.jpg',
      image2: '/images/product-3b.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 38
    },
    {
      id: 43,
      category: 'Gas-Brennwert',
      name: 'Squirrel M30 Gas-Boiler 35kW - WiFi/App',
      description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 420m².',
      fullDescription: 'Der Squirrel M30 35kW ist der leistungsstärkste vollkondensierende Gas-Boiler der Serie. Mit WiFi und App-Steuerung für maximale Kontrolle und Effizienz bis 103%. Ideal für große Einfamilienhäuser und kleine Mehrfamilienhäuser.',
      specs: ['35kW', 'WiFi/App', 'Kondensierend', '103% Effizienz', 'CE/ERP/RoHS'],
      price: '€ 2.999,00',
      priceValue: 2999,
      wholesalePrice: '€ 2.699,00',
      image: '/images/squirrel-main.jpg',
      image2: '/images/squirrel-main.jpg',
      isTopProduct: true,
      rating: 4.9,
      reviews: 29
    },
    // TONGOU Smart Switches - Alle Varianten
    {
      id: 10,
      category: 'Smart Home',
      name: 'TONGOU Smart Switch 1-Gang - BESTSELLER',
      description: 'Intelligente Lichtsteuerung für Ihr Zuhause. Tuya/Smart Life App, Alexa & Google kompatibel.',
      fullDescription: 'Der TONGOU Smart Switch 1-Gang ist der meistverkaufte Smart Switch für die Tuya/Smart Life App und bringt intelligente Lichtsteuerung in jeden Raum. Steuern Sie Ihre Beleuchtung bequem per App, Sprache oder automatisiert. Einfache Installation in Standard-Unterputzdosen (60mm), kostenlose Tuya/Smart Life App für iOS und Android, kompatibel mit Amazon Alexa und Google Assistant. Spannung 100-240V AC, max. 10A/2200W, WiFi 2,4 GHz. 2 Jahre Herstellergarantie, kostenloser Versand ab € 50.',
      specs: ['WiFi', '1-Gang', 'Tuya', 'Alexa', 'Google Home'],
      price: '€ 24,90',
      priceValue: 24.9,
      wholesalePrice: '€ 22,00',
      priceNote: 'inkl. MwSt., Versandkostenfrei ab € 50',
      benefits: ['2 Jahre Garantie', 'Alexa & Google kompatibel', 'Einfache Installation'],
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 234
    },
    {
      id: 11,
      category: 'Smart Home',
      name: 'TONGOU Smart Switch 2-Gang',
      description: 'Zweifach Smart Switch für Lichtsteuerung per App und Sprache.',
      fullDescription: 'Der TONGOU 2-Gang Smart Switch ermöglicht die Steuerung von zwei Lichtkreisen über App oder Sprachbefehl.',
      specs: ['WiFi', '2-Gang', 'Tuya', 'Timer', 'Sprachsteuerung'],
      price: '€ 29,90',
      priceValue: 29.9,
      wholesalePrice: '€ 27,00',
      image: '/images/tongou-switch.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 12,
      category: 'Smart Home',
      name: 'TONGOU Smart Switch 3-Gang',
      description: 'Dreifach Smart Switch für komplexe Lichtsteuerung.',
      fullDescription: 'Der TONGOU 3-Gang Smart Switch bietet Steuerung für drei separate Lichtkreise mit App- und Sprachsteuerung.',
      specs: ['WiFi', '3-Gang', 'Tuya', 'Timer', 'Sprachsteuerung'],
      price: '€ 34,90',
      priceValue: 34.9,
      wholesalePrice: '€ 32,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.6,
      reviews: 89
    },
    {
      id: 13,
      category: 'Smart Home',
      name: 'TONGOU Smart Switch 4-Gang',
      description: 'Vierfach Smart Switch für maximale Kontrolle.',
      fullDescription: 'Der TONGOU 4-Gang Smart Switch ermöglicht die Steuerung von vier Lichtkreisen über eine einzige Einheit.',
      specs: ['WiFi', '4-Gang', 'Tuya', 'Timer', 'Sprachsteuerung'],
      price: '€ 39,90',
      priceValue: 39.9,
      wholesalePrice: '€ 37,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 67
    },
    {
      id: 14,
      category: 'Smart Home',
      name: 'TONGOU Smart Dimmer Switch',
      description: 'Dimmbarer Smart Switch für stufenlose Lichtregelung.',
      fullDescription: 'Der TONGOU Smart Dimmer ermöglicht stufenlose Helligkeitsregelung Ihrer Leuchten per App oder Sprachbefehl.',
      specs: ['WiFi', 'Dimmer', 'Tuya', 'Alexa', 'Google Home'],
      price: '€ 32,90',
      priceValue: 32.9,
      wholesalePrice: '€ 26,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 123
    },
    {
      id: 15,
      category: 'Smart Home',
      name: 'TONGOU Smart Curtain Switch',
      description: 'Smart Switch für Rolladen- und Jalousiesteuerung.',
      fullDescription: 'Der TONGOU Smart Curtain Switch ermöglicht die Steuerung von Rolläden und Jalousien per App oder Sprachbefehl.',
      specs: ['WiFi', 'Rolladen', 'Tuya', 'Timer', 'Sprachsteuerung'],
      price: '€ 36,90',
      priceValue: 36.9,
      wholesalePrice: '€ 29,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.6,
      reviews: 78
    },
    {
      id: 16,
      category: 'Smart Home',
      name: 'TONGOU Smart Socket Steckdose',
      description: 'Smarte Steckdose mit Strommessung und Timer.',
      fullDescription: 'Die TONGOU Smart Socket bietet Fernsteuerung, Stromverbrauchsmessung und Timer-Funktion für alle Geräte.',
      specs: ['WiFi', 'Steckdose', 'Tuya', 'Strommessung', 'Timer'],
      price: '€ 19,90',
      priceValue: 19.9,
      wholesalePrice: '€ 19,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 145
    },
    {
      id: 17,
      category: 'Smart Home',
      name: 'TONGOU Smart Thermostat',
      description: 'Smartes Thermostat für Heizungssteuerung.',
      fullDescription: 'Das TONGOU Smart Thermostat ermöglicht präzise Temperatursteuerung und Zeitpläne für Ihre Heizung.',
      specs: ['WiFi', 'Thermostat', 'Tuya', 'Zeitplan', 'Sprachsteuerung'],
      price: '€ 44,90',
      priceValue: 44.9,
      wholesalePrice: '€ 46,00',
      image: '/images/tongou-main.png',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 92
    },
    {
      id: 18,
      category: 'Smart Home',
      name: 'TONGOU Smart IR Fernbedienung',
      description: 'Universelle IR-Fernbedienung für alle Geräte.',
      fullDescription: 'Die TONGOU Smart IR Fernbedienung steuert TV, Klimaanlage und andere IR-Geräte per App von überall.',
      specs: ['WiFi', 'IR', 'Tuya', 'Universal', 'App-Steuerung'],
      price: '€ 27,90',
      priceValue: 27.9,
      wholesalePrice: '€ 18,00',
      image: '/images/tongou-main.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.4,
      reviews: 112
    },
    // GIRIER Zigbee Produkte
    {
      id: 50,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Switch Modul 1-Gang',
      description: 'Zigbee 3.0 Smart Switch Modul für Unterputz-Montage. 10A, 2-Wege-Steuerung.',
      fullDescription: 'Das GIRIER Zigbee Smart Switch Modul 1-Gang ist ein kompaktes DIY-Modul für die Unterputz-Montage. Unterstützt 2-Wege-Steuerung, arbeitet mit Zigbee 3.0 Hub und ist kompatibel mit Alexa und Google Home.',
      specs: ['Zigbee 3.0', '1-Gang', '10A', '2-Wege', 'Unterputz'],
      price: '€ 18,90',
      priceValue: 18.9,
      wholesalePrice: '€ 14,00',
      image: '/images/tongou-switch.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 51,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Switch Modul 2-Gang',
      description: 'Zigbee 3.0 Smart Switch Modul 2-Gang für Unterputz-Montage. 10A pro Kanal.',
      fullDescription: 'Das GIRIER Zigbee Smart Switch Modul 2-Gang bietet zwei unabhängige Schaltkanäle für die Unterputz-Montage. Unterstützt 2-Wege-Steuerung für beide Kanäle.',
      specs: ['Zigbee 3.0', '2-Gang', '10A', '2-Wege', 'Unterputz'],
      price: '€ 24,90',
      priceValue: 24.9,
      wholesalePrice: '€ 20,00',
      image: '/images/tongou-switch.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 134
    },
    {
      id: 52,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Switch Modul 3-Gang',
      description: 'Zigbee 3.0 Smart Switch Modul 3-Gang für komplexe Lichtsteuerung.',
      fullDescription: 'Das GIRIER Zigbee Smart Switch Modul 3-Gang ermöglicht die Steuerung von drei Lichtkreisen über Zigbee. Perfekt für Wohnzimmer und Küchen.',
      specs: ['Zigbee 3.0', '3-Gang', '10A', '2-Wege', 'Unterputz'],
      price: '€ 29,90',
      priceValue: 29.9,
      wholesalePrice: '€ 27,00',
      image: '/images/tongou-switch.jpg',
      isTopProduct: false,
      rating: 4.6,
      reviews: 89
    },
    {
      id: 53,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Switch Modul 4-Gang',
      description: 'Zigbee 3.0 Smart Switch Modul 4-Gang für maximale Kontrolle.',
      fullDescription: 'Das GIRIER Zigbee Smart Switch Modul 4-Gang bietet vier unabhängige Schaltkanäle. Ideal für große Räume mit vielen Lichtquellen.',
      specs: ['Zigbee 3.0', '4-Gang', '10A', '2-Wege', 'Unterputz'],
      price: '€ 34,90',
      priceValue: 34.9,
      wholesalePrice: '€ 33,00',
      image: '/images/tongou-switch.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 67
    },
    {
      id: 54,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Dimmer Switch Modul',
      description: 'Zigbee 3.0 Dimmer Modul für stufenlose Lichtregelung. 10A.',
      fullDescription: 'Das GIRIER Zigbee Dimmer Switch Modul ermöglicht stufenlose Helligkeitsregelung für dimmbare LEDs. Unterstützt 2-Wege-Steuerung und arbeitet mit allen gängigen Zigbee Hubs.',
      specs: ['Zigbee 3.0', 'Dimmer', '10A', '2-Wege', 'LED kompatibel'],
      price: '€ 26,90',
      priceValue: 26.9,
      wholesalePrice: '€ 19,00',
      image: '/images/girier-main.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 98
    },
    {
      id: 55,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Rolladen/Curtain Modul',
      description: 'Zigbee 3.0 Modul für Rolladen- und Jalousiesteuerung. 1/2 Kanal.',
      fullDescription: 'Das GIRIER Zigbee Rolladen/Curtain Modul steuert elektrische Rolladen und Jalousien. Unterstützt Prozentsteuerung für teilweise Öffnung/Schließung.',
      specs: ['Zigbee 3.0', 'Rolladen', 'Curtain', 'Prozentsteuerung', '2-Kanal'],
      price: '€ 28,90',
      priceValue: 28.9,
      wholesalePrice: '€ 22,00',
      image: '/images/girier-main.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.6,
      reviews: 76
    },
    {
      id: 56,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Scene Button Switch',
      description: 'Kabelloser Zigbee Scene Button für Smart Home Automation.',
      fullDescription: 'Der GIRIER Zigbee Scene Button Switch ist ein kabelloser Taster für die Steuerung von Szenen. Ein Tastendruck kann mehrere Geräte gleichzeitig steuern. Batteriebetrieben, einfach zu installieren.',
      specs: ['Zigbee 3.0', 'Kabellos', 'Scene Control', 'Batterie', 'Wandmontage'],
      price: '€ 22,90',
      priceValue: 22.9,
      wholesalePrice: '€ 12,00',
      image: '/images/tongou-switch.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 112
    },
    {
      id: 57,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Gateway Hub',
      description: 'Zigbee 3.0 Gateway Hub mit externer Antenne für Smart Home.',
      fullDescription: 'Der GIRIER Zigbee Gateway Hub ist das Herzstück Ihres Zigbee Smart Home Systems. Mit externer Antenne für maximale Reichweite. Unterstützt bis zu 128 Zigbee Geräte.',
      specs: ['Zigbee 3.0', 'Hub', '128 Geräte', 'Externe Antenne', 'Mesh Netzwerk'],
      price: '€ 49,90',
      priceValue: 49.9,
      wholesalePrice: '€ 28,00',
      image: '/images/girier-main.jpg',
      isTopProduct: true,
      rating: 4.8,
      reviews: 203
    },
    {
      id: 58,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Thermostat',
      description: 'Zigbee 3.0 Thermostat für elektrische Heizung und Fußbodenheizung.',
      fullDescription: 'Das GIRIER Zigbee Smart Thermostat ermöglicht präzise Temperatursteuerung für elektrische Heizungen. Programmierbare Zeitpläne, App-Steuerung und Sprachsteuerung.',
      specs: ['Zigbee 3.0', 'Thermostat', '5-35°C', 'Programmierbar', 'App-Steuerung'],
      price: '€ 39,90',
      priceValue: 39.9,
      wholesalePrice: '€ 36,00',
      image: '/images/girier-main.jpg',
      isTopProduct: false,
      rating: 4.6,
      reviews: 87
    },
    {
      id: 59,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Dry Contact Modul',
      description: 'Zigbee 3.0 Dry Contact Modul für Garagentore und Tore. 5A.',
      fullDescription: 'Das GIRIER Zigbee Dry Contact Modul ist ideal für die Steuerung von Garagentoren, Toren und anderen Geräten mit potentialfreiem Kontakt. Kompaktes Design für einfache Installation.',
      specs: ['Zigbee 3.0', 'Dry Contact', '5A', 'Garagentor', 'Potentialfrei'],
      price: '€ 23,90',
      priceValue: 23.9,
      wholesalePrice: '€ 16,00',
      image: '/images/girier-main.jpg',
      isTopProduct: false,
      rating: 4.4,
      reviews: 54
    },
    {
      id: 60,
      category: 'Smart Home',
      name: 'GIRIER Zigbee Smart Socket Steckdose',
      description: 'Zigbee 3.0 Smart Steckdose mit Strommessung und Timer. 16A.',
      fullDescription: 'Die GIRIER Zigbee Smart Socket bietet Fernsteuerung, Stromverbrauchsmessung und Timer-Funktion. Max. 3450W Leistung, kompatibel mit allen Zigbee Hubs.',
      specs: ['Zigbee 3.0', 'Steckdose', '16A', 'Strommessung', 'Timer'],
      price: '€ 21,90',
      priceValue: 21.9,
      wholesalePrice: '€ 17,00',
      image: '/images/tongou-switch.jpg',
      image2: '/images/tongou-switch-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 78
    },
    // Beleuchtung
    {
      id: 19,
      category: 'Beleuchtung',
      name: 'Smart LED-Lampe E27 RGBW - TOP PRODUKT',
      description: 'Die beste Smart LED-Lampe mit Farbwechsel und App-Steuerung.',
      fullDescription: 'Unsere meistverkaufte Smart LED-Lampe mit E27-Sockel. 16 Millionen Farben, dimmbar, steuerbar per App und Sprachassistent.',
      specs: ['E27', '9W', 'RGBW', 'Dimmbar', 'App-Steuerung'],
      price: '€ 19,90',
      priceValue: 19.9,
      wholesalePrice: '€ 12,00',
      image: '/images/smart-led.jpg',
      image2: '/images/smart-led-2.jpg',
      isTopProduct: true,
      rating: 4.6,
      reviews: 312
    },
    {
      id: 70,
      category: 'Beleuchtung',
      name: 'Smart LED-Lampe GU10 RGBW',
      description: 'Smart LED-Spot mit Farbwechsel für GU10-Fassung.',
      fullDescription: 'Smart LED-Spot mit GU10-Sockel für Einbaustrahler. RGBW-Farbwechsel, dimmbar, kompatibel mit Alexa und Google Home.',
      specs: ['GU10', '5W', 'RGBW', 'Dimmbar', 'App-Steuerung'],
      price: '€ 16,90',
      priceValue: 16.9,
      wholesalePrice: '€ 9,00',
      image: '/images/smart-led.jpg',
      image2: '/images/smart-led-2.jpg',
      isTopProduct: false,
      rating: 4.5,
      reviews: 178
    },
    {
      id: 71,
      category: 'Beleuchtung',
      name: 'Smart LED-Streifen 5m RGBW',
      description: '5 Meter Smart LED-Streifen mit Farbwechsel und App-Steuerung.',
      fullDescription: 'Flexibler LED-Streifen mit 5m Länge. RGBW-Farbwechsel, dimmbar, selbstklebend, inkl. Netzteil und Controller.',
      specs: ['5m', 'RGBW', 'Dimmbar', 'Selbstklebend', 'App-Steuerung'],
      price: '€ 39,90',
      priceValue: 39.9,
      wholesalePrice: '€ 28,00',
      image: '/images/smart-led.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 245
    },
    {
      id: 72,
      category: 'Beleuchtung',
      name: 'Smart LED-Deckenleuchte 36W',
      description: 'Smart Deckenleuchte mit RGB-Ring und App-Steuerung.',
      fullDescription: 'Moderne Smart Deckenleuchte mit Hauptlicht und RGB-Ambiente-Ring. Dimmbar, Farbwechsel, Timer-Funktion.',
      specs: ['36W', 'RGB-Ring', 'Dimmbar', 'Timer', 'App-Steuerung'],
      price: '€ 89,00',
      priceValue: 89,
      wholesalePrice: '€ 71,00',
      image: '/images/smart-led.jpg',
      image2: '/images/smart-led-2.jpg',
      isTopProduct: false,
      rating: 4.8,
      reviews: 89
    },
    // Energiemanagement
    {
      id: 80,
      category: 'Energiemanagement',
      name: 'Smart Energiemonitor für Zählerschrank',
      description: 'WLAN-Energiemonitor für den Stromzähler im Zählerschrank.',
      fullDescription: 'Smart Energiemonitor zur Echtzeit-Erfassung des Stromverbrauchs. WLAN-Anbindung, App-Steuerung, historische Verbrauchsdaten, Alarm bei Überschreitung.',
      specs: ['WLAN', 'Echtzeit', 'App', 'Historie', 'Alarm'],
      price: '€ 79,00',
      priceValue: 79,
      wholesalePrice: '€ 63,00',
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: true,
      rating: 4.6,
      reviews: 134
    },
    {
      id: 81,
      category: 'Energiemanagement',
      name: 'Smart Stromzähler 3-Phasen',
      description: 'Drehstromzähler mit WLAN und App-Integration für Gewerbe.',
      fullDescription: 'Professioneller 3-Phasen-Stromzähler mit WLAN-Anbindung. Echtzeit-Messung, MID-zertifiziert, Cloud-Integration, API-Schnittstelle.',
      specs: ['3-Phasen', 'WLAN', 'MID', 'API', 'Cloud'],
      price: '€ 149,90',
      priceValue: 149.9,
      wholesalePrice: '€ 199,00',
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: false,
      rating: 4.8,
      reviews: 67
    },
    {
      id: 82,
      category: 'Energiemanagement',
      name: 'Smart PV-Wechselrichter 5kW',
      description: 'Maximieren Sie Ihre Solarerträge. Wirkungsgrad bis 98,6%, App-Monitoring, Batteriespeicher-ready.',
      fullDescription: 'Der Smart PV-Wechselrichter 5kW ist das Herzstück Ihrer Photovoltaik-Anlage. Mit modernster MPPT-Technologie und intelligentem Monitoring verwandeln Sie Sonnenlicht effizient in nutzbaren Strom. Wirkungsgrad bis 98,6%, Echtzeit-Überwachung per App und Web-Portal, Batteriespeicher-ready für Energieunabhängigkeit. Nennleistung 5.000 W, Schutzklasse IP65 für Außenmontage, lüfterlose Kühlung. Qualifiziert sich für Investitionszulage und Bundesland-Förderungen. 5 Jahre Herstellergarantie (10 Jahre optional). Installation durch qualifizierte Elektrofachkräfte.',
      specs: ['5kW', 'WLAN', 'Monitoring', 'App', 'VDE'],
      price: '€ 1.299,00',
      priceValue: 1299,
      wholesalePrice: '€ 719,00',
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: true,
      rating: 4.7,
      reviews: 98
    },
    {
      id: 83,
      category: 'Energiemanagement',
      name: 'Smart Batteriespeicher 10kWh',
      description: 'Lithium-Eisenphosphat Speicher für PV-Überschuss.',
      fullDescription: 'Hochwertiger 10kWh Batteriespeicher für Photovoltaik-Überschuss. LiFePO4 Technologie, 6000 Zyklen, integriertes BMS, App-Monitoring.',
      specs: ['10kWh', 'LiFePO4', '6000 Zyklen', 'BMS', 'App'],
      price: '€ 3.999,00',
      priceValue: 3999,
      wholesalePrice: '€ 2.799,00',
      image: '/images/product-1.jpg',
      image2: '/images/product-1b.jpg',
      isTopProduct: true,
      rating: 4.9,
      reviews: 45
    },
    // Wasser
    {
      id: 90,
      category: 'Wasser',
      name: 'Smart Wasserzähler mit WLAN',
      description: 'Intelligenter Wasserzähler für Echtzeit-Verbrauchsmessung.',
      fullDescription: 'Smart Wasserzähler mit WLAN-Anbindung zur Echtzeit-Erfassung des Wasserverbrauchs. App-Steuerung, Leckage-Alarm, historische Daten.',
      specs: ['WLAN', 'Echtzeit', 'Leckage-Alarm', 'App', 'DN15'],
      price: '€ 129,00',
      priceValue: 129,
      wholesalePrice: '€ 103,00',
      image: '/images/product-2.jpg',
      isTopProduct: true,
      rating: 4.5,
      reviews: 87
    },
    {
      id: 91,
      category: 'Wasser',
      name: 'Smart Wasserabsperrventil',
      description: 'Motorisiertes Absperrventil mit Leckage-Erkennung.',
      fullDescription: 'Smartes Wasserabsperrventil mit integrierter Leckage-Erkennung. Automatische Absperrung bei Wasserschaden, App-Benachrichtigung, manuelle Steuerung.',
      specs: ['Motorisiert', 'Leckage', 'App', 'Automatik', 'DN20'],
      price: '€ 189,00',
      priceValue: 189,
      wholesalePrice: '€ 151,00',
      image: '/images/product-2.jpg',
      image2: '/images/product-2b.jpg',
      isTopProduct: false,
      rating: 4.7,
      reviews: 56
    },
    {
      id: 92,
      category: 'Wasser',
      name: 'Smart Durchlauferhitzer 18kW',
      description: 'Elektronischer Durchlauferhitzer mit App-Steuerung.',
      fullDescription: 'Hocheffizienter elektronischer Durchlauferhitzer mit 18kW Leistung. Temperaturvorwahl, Zeitpläne, Energiemonitoring, App-Steuerung.',
      specs: ['18kW', 'App', 'Zeitplan', 'Energiemonitoring', 'Digital'],
      price: '€ 349,90',
      priceValue: 349.9,
      wholesalePrice: '€ 359,00',
      image: '/images/product-2.jpg',
      isTopProduct: true,
      rating: 4.6,
      reviews: 112
    },
    {
      id: 93,
      category: 'Wasser',
      name: 'Smart Warmwasserspeicher 100L',
      description: 'Elektrischer Warmwasserspeicher mit Smart-Steuerung.',
      fullDescription: 'Smart Warmwasserspeicher mit 100L Fassungsvermögen. Zeitgesteuerte Erwärmung, Ferienmodus, Energiesparmodus, App-Steuerung.',
      specs: ['100L', '2kW', 'Smart', 'Zeitsteuerung', 'App'],
      price: '€ 499,90',
      priceValue: 499.9,
      wholesalePrice: '€ 479,00',
      image: '/images/product-2.jpg',
      image2: '/images/product-2b.jpg',
      isTopProduct: false,
      rating: 4.4,
      reviews: 78
    }
  ]

  const topProducts = products.filter(p => p.isTopProduct)

  const filters = ['Alle', 'Wärmepumpen', 'Gas-Brennwert', 'Smart Home', 'GIRIER Zigbee', 'Beleuchtung', 'Energiemanagement', 'Wasser']

  const filteredProducts = activeFilter === 'Alle' 
    ? products 
    : activeFilter === 'GIRIER Zigbee'
      ? products.filter(p => p.name.includes('GIRIER'))
      : products.filter(p => p.category === activeFilter)

  // Cart Functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item: CartItem) => item.id === product.id)
      if (existing) {
        return prev.map((item: CartItem) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setSelectedProduct(null)
    setProductQuantity(1)
  }

  const removeFromCart = (productId: number) => {
    setCart((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev: CartItem[]) => prev.map((item: CartItem) => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + (item.priceValue * item.quantity), 0)
  const cartItemCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

  // Energy Calculator
  const buildingTypes = [
    { id: 'altbau', name: 'Altbau (bis 1995)', value: 120, unit: 'W/m²' },
    { id: 'neubau', name: 'Neubau (ab 1995)', value: 70, unit: 'W/m²' },
    { id: 'kfw', name: 'KfW-Effizienzhaus', value: 40, unit: 'W/m²' },
    { id: 'passiv', name: 'Passivhaus', value: 15, unit: 'W/m²' }
  ]

  const calculateEnergy = () => {
    if (!buildingType || !area) return
    const bt = buildingTypes.find(b => b.id === buildingType)
    if (!bt) return

    const areaNum = parseInt(area)
    const heatLoad = areaNum * bt.value
    const heatLoadKw = heatLoad / 1000
    const yearlyConsumption = heatLoadKw * 2000
    const currentCost = yearlyConsumption * energyPrices[energySource]
    const heatPumpCost = currentCost * 0.3
    const costSavings = currentCost - heatPumpCost

    setCalcResult({
      heatLoad: Math.round(heatLoad),
      yearlyConsumption: Math.round(yearlyConsumption),
      recommendedPower: Math.round(heatLoadKw),
      currentCost: Math.round(currentCost),
      heatPumpCost: Math.round(heatPumpCost),
      costSavings: Math.round(costSavings),
      co2Savings: Math.round(yearlyConsumption * 0.3 * 0.4),
      energySource
    })
  }

  // FAQ Data for AI Search
  const faqs = [
    {
      question: 'Was sind die besten Wärmepumpen für Einfamilienhäuser in Österreich?',
      answer: 'Die besten Wärmepumpen für Einfamilienhäuser in Österreich sind A+++ Luft-Wasser-Wärmepumpen wie die JNOD R32 Serie. Diese bieten maximale Effizienz mit COP bis 5.0, sind förderfähig durch die österreichische Klimaförderung und eignen sich besonders für Neubauten und sanierte Altbauten. Empfohlen werden 12kW für Häuser bis 150m² und 16kW für größere Häuser bis 200m².'
    },
    {
      question: 'Was kostet eine Wärmepumpe inklusive Installation in Österreich?',
      answer: 'Eine Wärmepumpe inklusive Installation kostet in Österreich zwischen € 4.000 und € 12.000, abhängig von der Leistung (6-16 kW) und dem Typ. Eine 12kW A+++ Wärmepumpe kostet ca. € 4.299. Mit der österreichischen Klimaförderung können bis zu € 5.000 zurückgeholt werden.'
    },
    {
      question: 'Lohnt sich ein Gas-Brennwertgerät noch im Jahr 2025?',
      answer: 'Ja, Gas-Brennwertgeräte lohnen sich besonders bei bestehender Gasversorgung und als Übergangslösung. Moderne Geräte wie der Buderus Logamax plus erreichen bis zu 99% Wirkungsgrad und sind deutlich günstiger in der Anschaffung (€ 2.500-4.500) als Wärmepumpen.'
    },
    {
      question: 'Welche Smart Home Systeme sind kompatibel mit Wärmepumpen?',
      answer: 'Die meisten modernen Wärmepumpen sind mit Smart Home Systemen wie Tuya, Smart Life, Alexa und Google Home kompatibel. ECO Building Technik bietet spezielle KI-optimierte Steuerungen, die Wärmepumpen, Heizung, Beleuchtung und Sicherheitssysteme intelligent vernetzen.'
    },
    {
      question: 'Wie hoch ist die Förderung für Wärmepumpen in Österreich?',
      answer: 'In Österreich gibt es verschiedene Förderungen für Wärmepumpen: Die Klimaförderung des Bundes bietet bis zu € 5.000 für Luft-Wasser-Wärmepumpen. Zusätzlich gibt es regionale Förderungen in Niederösterreich und Wien.'
    },
    {
      question: 'Was ist der Unterschied zwischen Wärmepumpe und Gas-Brennwertgerät?',
      answer: 'Wärmepumpen nutzen Umgebungswärme und benötigen nur Strom, während Gas-Brennwertgeräte Erdgas verbrennen. Wärmepumpen haben höhere Anschaffungskosten aber niedrigere Betriebskosten. Gas-Brennwertgeräte sind günstiger in der Anschaffung und eignen sich für bestehende Gasanschlüsse.'
    }
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Skip Link - Barrierefreiheit: Erster Fokus springt zum Hauptinhalt */}
      <a href="#main-content" className="skip-link">Zum Hauptinhalt springen</a>
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`} role="banner">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button 
              onClick={() => scrollToSection('home')}
              className="p-0 border-0 bg-transparent cursor-pointer"
              aria-label="ECO Building Technik - Zur Startseite"
            >
              <img 
                src="/images/logo.png" 
                alt="" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </button>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Hauptnavigation">
              {[
                { label: 'Home', id: 'home', icon: Home },
                { label: 'Produkte', id: 'produkte', icon: Package },
                { label: 'Rechner', id: 'rechner', icon: Calculator },
                { label: 'FAQ', id: 'faq', icon: HelpCircle },
                { label: 'Kontakt', id: 'kontakt', icon: Mail },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="max-w-[120px] truncate">{currentUser.name}</span>
                      <span className="text-xs text-slate-400">KN: {currentUser.customerNumber}</span>
                    </div>
                    {currentUser.isWholesale && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{currentUser.type === 'company' ? 'Firma' : 'Händler'}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentUser(null)} className="text-slate-500" aria-label="Abmelden">
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setShowLoginDialog(true)} className="border-slate-300">
                  <User className="w-4 h-4 mr-2" />
                  Anmelden
                </Button>
              )}
              <Button 
                onClick={() => currentUser ? setShowCart(true) : setShowLoginDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                aria-label={currentUser && cartItemCount > 0 ? `Warenkorb: ${cartItemCount} Artikel, € ${cartTotal.toFixed(2)}` : 'Warenkorb öffnen'}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {currentUser && cartItemCount > 0 ? (
                  <span>€ {cartTotal.toFixed(2)} ({cartItemCount})</span>
                ) : 'Warenkorb'}
              </Button>
            </div>

            <button 
              className="lg:hidden p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t" role="navigation" aria-label="Mobile Navigation">
            <nav className="flex flex-col p-4 gap-4">
              {[
                { label: 'Home', id: 'home', icon: Home },
                { label: 'Produkte', id: 'produkte', icon: Package },
                { label: 'Rechner', id: 'rechner', icon: Calculator },
                { label: 'FAQ', id: 'faq', icon: HelpCircle },
                { label: 'Kontakt', id: 'kontakt', icon: Mail },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.id} onClick={() => scrollToSection(item.id)} className="flex items-center gap-3 text-left text-slate-700 font-medium py-2">
                    <Icon className="w-5 h-5 text-emerald-600" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-16 md:pt-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 md:py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                A+++ Energieeffizienz - Beste Produkte 2025
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                <span className="text-emerald-600">A+++</span> Geräte für nachhaltige Gebäudetechnik
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8">
                KI-optimierte Gebäudeautomation mit A+++ Wärmepumpen, Gas-Brennwertgeräten und intelligenter Systemintegration. Fachbetrieb in Ebreichsdorf mit persönlicher Beratung.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection('produkte')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6">
                  <Star className="w-5 h-5 mr-2" />
                  Produkte entdecken
                </Button>
                <Button onClick={() => scrollToSection('rechner')} variant="outline" className="text-lg px-8 py-6">
                  <Calculator className="w-5 h-5 mr-2" />
                  Energie-Rechner
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Klimaförderung bis € 5.000</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>14 Tage Rückgaberecht</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Kostenlose Beratung</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produkte" className="py-16 md:py-24 bg-slate-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Unser Produktsortiment</h2>
              <p className="text-lg text-slate-600">Wärmepumpen, Gas-Brennwertgeräte, Smart Home und mehr</p>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-2 mb-8">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => { setSelectedProduct(product); setProductQuantity(1) }}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                    {product.isTopProduct && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                        ★ TOP
                      </div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">{product.category}</span>
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 mt-1">{product.name}</h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>
                    {/* Preis-Section mit Förderhinweis (priorisiert) */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-100 -mx-5 px-5 py-4 mt-auto">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl font-extrabold text-emerald-700">
                          {currentUser?.isWholesale && product.wholesalePrice ? product.wholesalePrice : product.price}
                        </span>
                        <span className="text-emerald-600 text-sm cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}>Details →</span>
                      </div>
                      {product.priceNote && <p className="text-xs text-emerald-700/80 mb-2">{product.priceNote}</p>}
                      {(['Wärmepumpen', 'Gas-Brennwert'].includes(product.category) || product.name.includes('PV-Wechselrichter') || product.name.includes('Batteriespeicher')) && (
                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-xs font-medium">
                          <Gift className="w-4 h-4 flex-shrink-0" />
                          <span>Förderung möglich – bis zu <strong>€ 5.000</strong> Zuschuss</span>
                        </div>
                      )}
                    </div>
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-3">
                        {product.benefits.map((b, i) => (
                          <span key={i} className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md font-medium">✓ {b}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {currentUser ? (
                        <Button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product, 1) }} 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          In den Warenkorb
                        </Button>
                      ) : (
                        <Button 
                          onClick={(e) => { e.stopPropagation(); setShowLoginDialog(true) }} 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          In den Warenkorb
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 text-sm"
                        onClick={(e) => { e.stopPropagation(); openAngebotDialog(product) }}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Angebot anfragen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Energy Calculator */}
        <section id="rechner" className="py-16 md:py-24 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Energie-Rechner</h2>
              <p className="text-lg text-slate-600">Berechnen Sie Ihre Heizlast und vergleichen Sie Energiekosten</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium mb-4 block">Gebäudetyp</Label>
                  <div className="space-y-2">
                    {buildingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBuildingType(type.id)}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                          buildingType === type.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-slate-500">{type.value} {type.unit}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium mb-4 block">Wohnfläche (m²)</Label>
                  <div className="relative mb-6">
                    <Input 
                      type="number" 
                      placeholder="z.B. 150"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="text-lg py-6"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">m²</span>
                  </div>
                  
                  <Label className="text-lg font-medium mb-4 block">Aktuelle Energiequelle</Label>
                  <div className="space-y-2">
                    {(['Strom', 'Gas'] as const).map((source) => (
                      <button
                        key={source}
                        onClick={() => setEnergySource(source)}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all flex justify-between ${
                          energySource === source ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'
                        }`}
                      >
                        <span>{source}</span>
                        <span className="text-sm text-slate-500">ca. € {energyPrices[source].toFixed(2)}/kWh</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={calculateEnergy} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Berechnung starten
              </Button>

              {calcResult && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="text-sm text-emerald-700">Empfohlene Leistung</div>
                    <div className="text-2xl font-bold text-emerald-900">{calcResult.recommendedPower} kW</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <div className="text-sm text-amber-700">Aktuelle Kosten/Jahr</div>
                    <div className="text-2xl font-bold text-amber-900">€ {calcResult.currentCost.toLocaleString()}</div>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-xl border-2 border-emerald-300">
                    <div className="text-sm text-emerald-800">Einsparung mit Wärmepumpe</div>
                    <div className="text-2xl font-bold text-emerald-900">€ {calcResult.costSavings.toLocaleString()}/Jahr</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-slate-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Häufig gestellte Fragen</h2>
              <p className="text-lg text-slate-600">Antworten auf die wichtigsten Fragen zu unseren Produkten</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontakt" className="py-16 md:py-24 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kontaktieren Sie uns</h2>
              <p className="text-lg text-slate-600">Kostenlose Beratung und Angebotserstellung</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Adresse</h4>
                    <p className="text-slate-600">Seepromenade 109<br/>AT-2384 Ebreichsdorf</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Telefon</h4>
                    <p className="text-slate-600">+43 / 0664 328 95 99</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">E-Mail</h4>
                    <p className="text-slate-600">office@eco-building.tech</p>
                  </div>
                </div>
              </div>

              <form className="bg-slate-50 p-6 rounded-2xl" onSubmit={submitKontakt}>
                <div className="space-y-4">
                  {kontaktStatus === 'success' ? (
                    <div className="py-4 text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Check className="w-6 h-6 text-emerald-600" />
                      </div>
                      <p className="font-semibold text-slate-900">Vielen Dank!</p>
                      <p className="text-slate-600 text-sm">Ihre Nachricht wurde gesendet. Wir melden uns in Kürze.</p>
                      <Button type="button" variant="outline" onClick={() => setKontaktStatus('idle')} className="mt-3">Weitere Nachricht</Button>
                    </div>
                  ) : kontaktStatus === 'error' ? (
                    <div className="py-4 text-center">
                      <p className="text-red-600 font-medium">Fehler beim Senden.</p>
                      <Button type="button" variant="outline" onClick={() => setKontaktStatus('idle')} className="mt-2">Erneut versuchen</Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label>Name *</Label>
                        <Input value={kontaktForm.name} onChange={(e) => setKontaktForm(f => ({ ...f, name: e.target.value }))} placeholder="Ihr Name" required />
                      </div>
                      <div>
                        <Label>E-Mail *</Label>
                        <Input type="email" value={kontaktForm.email} onChange={(e) => setKontaktForm(f => ({ ...f, email: e.target.value }))} placeholder="ihre@email.at" required />
                      </div>
                      <div>
                        <Label>Telefon</Label>
                        <Input value={kontaktForm.phone} onChange={(e) => setKontaktForm(f => ({ ...f, phone: e.target.value }))} placeholder="+43 ..." />
                      </div>
                      <div>
                        <Label>Nachricht *</Label>
                        <Textarea value={kontaktForm.message} onChange={(e) => setKontaktForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Ihre Anfrage..." required />
                      </div>
                      <Button type="submit" disabled={kontaktStatus === 'sending'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                        {kontaktStatus === 'sending' ? 'Wird gesendet...' : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Nachricht senden
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Priorisiert: erweitert mit Payment-Icons, mehr Links */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/images/logo.png" alt="ECO Building Technik" className="h-12 mb-4 bg-white rounded-lg p-2" />
              <p className="text-slate-400 text-sm">Ihr Fachbetrieb für nachhaltige Gebäudetechnik in Ebreichsdorf. A+++ Wärmepumpen, Gas-Brennwertgeräte und Smart Home Produkte.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b-2 border-emerald-500/50">Navigation</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-emerald-400 transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('produkte')} className="hover:text-emerald-400 transition-colors">Produkte</button></li>
                <li><button onClick={() => scrollToSection('rechner')} className="hover:text-emerald-400 transition-colors">Energie-Rechner</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-emerald-400 transition-colors">FAQ</button></li>
                <li><button onClick={() => scrollToSection('kontakt')} className="hover:text-emerald-400 transition-colors">Kontakt</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b-2 border-emerald-500/50">Rechtliches</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => setShowAGBDialog(true)} className="hover:text-emerald-400 transition-colors">AGB</button></li>
                <li><button onClick={() => setShowDatenschutzDialog(true)} className="hover:text-emerald-400 transition-colors">Datenschutzerklärung</button></li>
                <li><button onClick={() => setShowImpressumDialog(true)} className="hover:text-emerald-400 transition-colors">Impressum</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 pb-2 border-b-2 border-emerald-500/50">Kontakt</h4>
              <address className="text-slate-400 text-sm not-italic space-y-1">
                <p><strong className="text-white">ECO Building Technik GmbH</strong></p>
                <p>Seepromenade 109</p>
                <p>2384 Ebreichsdorf, Österreich</p>
                <p className="pt-2">
                  <a href="tel:+436643289599" className="text-emerald-400 hover:text-emerald-300">+43 664 328 9599</a>
                </p>
                <p>
                  <a href="mailto:office@eco-building.tech" className="text-emerald-400 hover:text-emerald-300">office@eco-building.tech</a>
                </p>
                <p className="pt-2 text-slate-500 text-xs">Mo–Fr: 08:00–17:00 Uhr</p>
              </address>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2025 ECO Building Technik GmbH. Alle Rechte vorbehalten. UID: ATU77490127
            </p>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-xs">Zahlungsarten:</span>
              <div className="flex gap-2">
                <span className="bg-slate-700 px-3 py-1 rounded text-xs font-medium text-slate-300" title="Visa">Visa</span>
                <span className="bg-slate-700 px-3 py-1 rounded text-xs font-medium text-slate-300" title="Mastercard">MC</span>
                <span className="bg-slate-700 px-3 py-1 rounded text-xs font-medium text-slate-300" title="PayPal">PayPal</span>
                <span className="bg-slate-700 px-3 py-1 rounded text-xs font-medium text-slate-300" title="Banküberweisung">Bank</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Dialog - strukturiert & übersichtlich */}
      <Dialog open={!!selectedProduct} onOpenChange={() => { setSelectedProduct(null); setShowTechnicalDetails(false); setShowFullDescription(false) }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-3">
                  <span className="text-emerald-600 font-medium">{selectedProduct.category}</span>
                  {selectedProduct.rating && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {selectedProduct.rating}/5 ({selectedProduct.reviews})
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-56 object-cover rounded-xl" />
                  {selectedProduct.certificate && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Zertifikat</p>
                      <img 
                        src={selectedProduct.certificate} 
                        alt="Produktzertifikat" 
                        className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                        onClick={() => window.open(selectedProduct.certificate, '_blank')}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Beschreibung - kurz oder vollständig */}
                  <div>
                    <p className={`text-slate-600 text-sm ${!showFullDescription ? 'line-clamp-2' : ''}`}>
                      {showFullDescription ? selectedProduct.fullDescription : selectedProduct.description}
                    </p>
                    {selectedProduct.fullDescription && selectedProduct.fullDescription.length > (selectedProduct.description?.length || 0) && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-emerald-600 text-xs font-medium mt-1 hover:underline"
                      >
                        {showFullDescription ? 'Weniger anzeigen' : 'Vollständige Beschreibung lesen'}
                      </button>
                    )}
                  </div>
                  
                  {/* Specs als kompakte Pills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.specs.map((spec, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-medium">{spec}</span>
                    ))}
                  </div>
                  
                  {/* Preis */}
                  <div className="py-4 border-y border-slate-100">
                    <div className="text-3xl font-bold text-emerald-600">
                      {currentUser?.isWholesale && selectedProduct.wholesalePrice ? selectedProduct.wholesalePrice : selectedProduct.price}
                    </div>
                    {currentUser?.isWholesale && selectedProduct.wholesalePrice && (
                      <div className="text-sm text-emerald-600">Händlerpreis</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))} className="w-10 h-10 rounded-full border flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <Input type="number" min={1} value={productQuantity} onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center" />
                    <button onClick={() => setProductQuantity(productQuantity + 1)} className="w-10 h-10 rounded-full border flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {currentUser ? (
                      <Button onClick={() => addToCart(selectedProduct, productQuantity)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        In den Warenkorb
                      </Button>
                    ) : (
                      <Button onClick={() => setShowLoginDialog(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Anmelden zum Bestellen
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => openAngebotDialog(selectedProduct)} className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-6">
                      <Mail className="w-5 h-5 mr-2" />
                      Angebot
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Technical Details Section */}
              {selectedProduct.technicalDetails && selectedProduct.technicalDetails.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <button 
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="flex items-center justify-between w-full py-2 text-left"
                  >
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      Technische Daten & Details
                    </span>
                    <span className="text-emerald-600">
                      {showTechnicalDetails ? '▲' : '▼'}
                    </span>
                  </button>
                  
                  {showTechnicalDetails && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProduct.technicalDetails.map((detail, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-200 last:border-0">
                            <span className="text-sm font-medium text-slate-600">{detail.label}</span>
                            <span className="text-sm text-slate-900 font-semibold">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Angebot / Lead-Dialog */}
      <Dialog open={showAngebotDialog} onOpenChange={(open) => { if (!open) { setShowAngebotDialog(false); setAngebotStatus('idle') } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Angebot anfragen</DialogTitle>
            <DialogDescription>
              {angebotProduct ? (
                <>Anfrage für: <strong className="text-emerald-600">{angebotProduct.name}</strong></>
              ) : (
                'Kontaktieren Sie uns für eine kostenlose Beratung.'
              )}
            </DialogDescription>
          </DialogHeader>
          
          {angebotStatus === 'success' ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="font-semibold text-slate-900">Vielen Dank!</p>
              <p className="text-slate-600 text-sm mt-1">Ihre Anfrage wurde gesendet. Wir melden uns in Kürze.</p>
            </div>
          ) : angebotStatus === 'error' ? (
            <div className="py-6 text-center">
              <p className="text-red-600 font-medium">Fehler beim Senden.</p>
              <p className="text-slate-600 text-sm mt-1">Bitte versuchen Sie es erneut oder kontaktieren Sie uns per E-Mail.</p>
              <Button onClick={() => setAngebotStatus('idle')} variant="outline" className="mt-4">Erneut versuchen</Button>
            </div>
          ) : (
            <form onSubmit={submitAngebot} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="angebot-name">Name *</Label>
                <Input id="angebot-name" value={angebotForm.name} onChange={(e) => setAngebotForm(f => ({ ...f, name: e.target.value }))} placeholder="Ihr Name" required />
              </div>
              <div>
                <Label htmlFor="angebot-email">E-Mail *</Label>
                <Input id="angebot-email" type="email" value={angebotForm.email} onChange={(e) => setAngebotForm(f => ({ ...f, email: e.target.value }))} placeholder="ihre@email.at" required />
              </div>
              <div>
                <Label htmlFor="angebot-phone">Telefon</Label>
                <Input id="angebot-phone" value={angebotForm.phone} onChange={(e) => setAngebotForm(f => ({ ...f, phone: e.target.value }))} placeholder="+43 ..." />
              </div>
              <div>
                <Label htmlFor="angebot-message">Nachricht *</Label>
                <Textarea id="angebot-message" value={angebotForm.message} onChange={(e) => setAngebotForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Ihre Anfrage oder gewünschte Details..." required />
              </div>
              <Button type="submit" disabled={angebotStatus === 'sending'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                {angebotStatus === 'sending' ? (
                  <>Wird gesendet...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Nachricht senden
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Warenkorb
            </DialogTitle>
          </DialogHeader>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Ihr Warenkorb ist leer</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <p className="text-emerald-600 font-medium">€ {(item.priceValue * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Zwischensumme ({cartItemCount} Artikel)</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Versand</span>
                    <span className={cartTotal >= 500 ? 'text-emerald-600' : ''}>
                      {cartTotal >= 500 ? 'Kostenlos' : '€ 15.00'}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Gesamt</span>
                    <span className="text-emerald-600">€ {(cartTotal >= 500 ? cartTotal : cartTotal + 15).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Zahlungsarten:</p>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <span className="bg-slate-100 px-2 py-1 rounded">Rechnung</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">PayPal</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">Kreditkarte</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Sofort</span>
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded">Klarna</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setShowCart(false)
                    setCheckoutStep('review')
                    setShowCheckoutDialog(true)
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Zur Kasse
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {checkoutStep === 'review' && 'Bestellübersicht'}
              {checkoutStep === 'payment' && 'Zahlung'}
              {checkoutStep === 'confirmation' && 'Bestellbestätigung'}
            </DialogTitle>
          </DialogHeader>
          
          {checkoutStep === 'review' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold mb-3">Ihre Bestellung</h4>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>€ {(item.priceValue * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Zwischensumme</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Versand</span>
                    <span>{cartTotal >= 500 ? 'Kostenlos' : '€ 15.00'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Gesamt</span>
                    <span className="text-emerald-600">€ {(cartTotal >= 500 ? cartTotal : cartTotal + 15).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setCheckoutStep('payment')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6">
                Weiter zur Zahlung
              </Button>
            </div>
          )}
          
          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-emerald-800 mb-2">Unsere Bankverbindung:</p>
                <div className="text-sm text-emerald-700 space-y-1">
                  <p><strong>Empfänger:</strong> GF Johannes Fernberg / ECO Building Technik GmbH</p>
                  <p><strong>IBAN:</strong> AT131400000910084097</p>
                  <p><strong>BIC:</strong> BAWAATWW</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'invoice', name: 'Rechnung (Empfohlen)', desc: 'Zahlung innerhalb 14 Tagen per Überweisung' },
                  { id: 'paypal', name: 'PayPal', desc: 'Schnell und sicher' },
                  { id: 'card', name: 'Kreditkarte', desc: 'Visa, Mastercard' },
                  { id: 'sofort', name: 'Sofortüberweisung', desc: 'Direkt vom Bankkonto' },
                  { id: 'klarna', name: 'Klarna', desc: 'Später bezahlen' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === method.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-slate-500">{method.desc}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCheckoutStep('review')} className="flex-1">Zurück</Button>
                <Button 
                  onClick={() => {
                    setOrderNumber(`ECO-${Date.now().toString().slice(-8)}`)
                    setCheckoutStep('confirmation')
                    setCart([])
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Jetzt bezahlen
                </Button>
              </div>
            </div>
          )}
          
          {checkoutStep === 'confirmation' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Vielen Dank für Ihre Bestellung!</h3>
              <p className="text-slate-600 mb-4">Wir haben Ihre Bestellung erhalten und bearbeiten diese umgehend.</p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-500">Bestellnummer</p>
                <p className="text-xl font-bold text-emerald-600">{orderNumber}</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-500">Gesamtbetrag</p>
                <p className="text-xl font-bold">€ {(cartTotal >= 500 ? cartTotal : cartTotal + 15).toFixed(2)}</p>
              </div>
              
              {paymentMethod === 'invoice' && (
                <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-left border-2 border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Bitte überweisen Sie den Betrag auf folgendes Konto:
                  </p>
                  <div className="text-sm text-emerald-700 space-y-2 bg-white rounded-lg p-3">
                    <p><strong>Empfänger:</strong> GF Johannes Fernberg / ECO Building Technik GmbH</p>
                    <p><strong>IBAN:</strong> AT131400000910084097</p>
                    <p><strong>BIC:</strong> BAWAATWW</p>
                    <p className="text-emerald-600 font-semibold"><strong>Verwendungszweck:</strong> {orderNumber}</p>
                  </div>
                  <p className="text-xs text-emerald-600 mt-3">Bitte geben Sie unbedingt die Bestellnummer als Verwendungszweck an!</p>
                </div>
              )}
              
              {paymentMethod !== 'invoice' && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-blue-700">
                    <strong>Zahlungsmethode:</strong> {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'card' ? 'Kreditkarte' : paymentMethod === 'sofort' ? 'Sofortüberweisung' : 'Klarna'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Sie erhalten eine separate Zahlungsbestätigung per E-Mail.</p>
                </div>
              )}
              
              <p className="text-sm text-slate-500 mb-4">Eine Bestellbestätigung wurde an {currentUser?.email} gesendet.</p>
              
              <Button onClick={() => { setShowCheckoutDialog(false); setCheckoutStep('review') }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Weiter einkaufen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Anmelden</DialogTitle>
            <DialogDescription>Melden Sie sich an, um Preise zu sehen und zu bestellen.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>E-Mail</Label>
              <Input type="email" placeholder="ihre@email.at" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div>
              <Label>Passwort</Label>
              <Input type="password" placeholder="••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              onClick={() => {
                if (loginEmail.includes('@') && loginPassword.length >= 4) {
                  setCurrentUser({
                    id: '1',
                    email: loginEmail,
                    name: loginEmail.split('@')[0],
                    type: loginEmail.includes('firma') ? 'company' : 'private',
                    isWholesale: loginEmail.includes('firma'),
                    customerNumber: '10001'
                  })
                  setShowLoginDialog(false)
                }
              }}
            >
              Anmelden
            </Button>
            <div className="text-center">
              <p className="text-sm text-slate-500">Noch kein Konto?</p>
              <Button variant="outline" className="w-full mt-2" onClick={() => { setShowLoginDialog(false); setShowRegisterDialog(true) }}>
                Registrieren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrieren</DialogTitle>
            <DialogDescription>Erstellen Sie ein Kundenkonto.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="mb-2 block">Ich bin *</Label>
              <div className="flex gap-4">
                <button onClick={() => setRegisterType('private')} className={`flex-1 p-3 rounded-xl border-2 text-center ${registerType === 'private' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}>
                  <User className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">Privatperson</span>
                </button>
                <button onClick={() => setRegisterType('company')} className={`flex-1 p-3 rounded-xl border-2 text-center ${registerType === 'company' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}>
                  <Building2 className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">Firma</span>
                </button>
              </div>
            </div>
            
            <div>
              <Label>Name *</Label>
              <Input placeholder="Max Mustermann" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
            </div>
            <div>
              <Label>E-Mail *</Label>
              <Input type="email" placeholder="max@beispiel.at" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            </div>
            <div>
              <Label>Passwort *</Label>
              <Input type="password" placeholder="Mindestens 6 Zeichen" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
            </div>
            
            {registerType === 'company' && (
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold">Firmenangaben</h4>
                <div>
                  <Label>Firmenname *</Label>
                  <Input placeholder="Musterfirma GmbH" value={registerCompanyName} onChange={(e) => setRegisterCompanyName(e.target.value)} />
                </div>
                <div>
                  <Label>Firmenbuch-Nummer *</Label>
                  <Input placeholder="FN 123456a" value={registerCompanyRegister} onChange={(e) => setRegisterCompanyRegister(e.target.value)} />
                </div>
                <div>
                  <Label>UID-Nummer (ATU) *</Label>
                  <Input placeholder="ATU12345678" value={registerCompanyVat} onChange={(e) => setRegisterCompanyVat(e.target.value)} />
                </div>
              </div>
            )}
            
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
              onClick={() => {
                const isValid = registerType === 'private'
                  ? registerName && registerEmail.includes('@') && registerPassword.length >= 6
                  : registerCompanyName && registerCompanyRegister && registerCompanyVat && registerName && registerEmail.includes('@') && registerPassword.length >= 6
                
                if (isValid) {
                  const customerNumber = Math.floor(10000 + Math.random() * 90000).toString()
                  setCurrentUser({
                    id: Date.now().toString(),
                    email: registerEmail,
                    name: registerName,
                    type: registerType,
                    company: registerType === 'company' ? registerCompanyName : undefined,
                    companyRegister: registerType === 'company' ? registerCompanyRegister : undefined,
                    companyVat: registerType === 'company' ? registerCompanyVat : undefined,
                    isWholesale: registerType === 'company',
                    customerNumber
                  })
                  setShowRegisterDialog(false)
                }
              }}
            >
              Registrieren
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Dialogs */}
      <Dialog open={showAGBDialog} onOpenChange={setShowAGBDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Allgemeine Geschäftsbedingungen</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm text-slate-700">
            <h4 className="font-semibold">1. Geltungsbereich</h4>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Online-Shop zwischen ECO Building Technik GmbH und Verbrauchern sowie Unternehmern.</p>
            <h4 className="font-semibold">2. Vertragspartner</h4>
            <p>Der Kaufvertrag kommt zustande mit: ECO Building Technik GmbH, Seepromenade 109, AT-2384 Ebreichsdorf, UID: ATU77490127</p>
            <h4 className="font-semibold">3. Angebot und Vertragsschluss</h4>
            <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des Bestellbuttons geben Sie ein verbindliches Angebot ab. Wir können Ihr Angebot innerhalb von 2 Tagen durch Zusendung einer Auftragsbestätigung per E-Mail annehmen.</p>
            <h4 className="font-semibold">4. Preise und Versandkosten</h4>
            <p>Alle Preise verstehen sich in Euro (€) inklusive der gesetzlichen Mehrwertsteuer (20 %). Smart Home Produkte: kostenlose Lieferung ab € 50, darunter € 4,90 Versandkosten. Wärmepumpen, Gas-Brennwertgeräte, PV-Wechselrichter & Batteriespeicher: Versandkosten auf Anfrage.</p>
            <h4 className="font-semibold">5. Lieferung</h4>
            <p>Lieferung innerhalb Österreichs und nach Deutschland. Lieferzeiten: Smart Home 1-2 Werktage, Wärmepumpen 3-5 Werktage, Gas-Brennwertgeräte 5-7 Werktage. Bei Nichtverfügbarkeit werden Sie umgehend informiert und bereits geleistete Zahlungen zurückerstattet.</p>
            <h4 className="font-semibold">6. Zahlung</h4>
            <p>Zahlungsarten: Vorkasse per Banküberweisung, Kreditkarte (Visa, Mastercard), PayPal. Rechnungskauf nur für Fachpartner nach Bonitätsprüfung.</p>
            <p className="mt-2"><strong>Bankverbindung für Rechnungszahlungen:</strong><br/>GF Johannes Fernberg / ECO Building Technik GmbH<br/>IBAN: AT131400000910084097<br/>BIC: BAWAATWW</p>
            <h4 className="font-semibold">7. Widerrufsrecht</h4>
            <p>Verbraucher haben ein 14-tägiges Widerrufsrecht ab Erhalt der Ware. Ausgeschlossen: Waren nach Kundenspezifikation, aus hygienischen Gründen nicht rückgabefähige Waren sowie versiegelte Waren aus Gründen des Gesundheitsschutzes.</p>
            <h4 className="font-semibold">8. Gewährleistung</h4>
            <p>Die gesetzliche Gewährleistung beträgt 2 Jahre ab Übergabe der Ware. Herstellergarantien gelten zusätzlich entsprechend der Garantiebedingungen des jeweiligen Herstellers.</p>
            <h4 className="font-semibold">9. Haftung</h4>
            <p>Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten).</p>
            <h4 className="font-semibold">10. Schlussbestimmungen</h4>
            <p>Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Ebreichsdorf. Wir sind berechtigt, den Kunden auch an seinem allgemeinen Gerichtsstand zu verklagen. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDatenschutzDialog} onOpenChange={setShowDatenschutzDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Datenschutzerklärung</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm text-slate-700">
            <h4 className="font-semibold">1. Verantwortlicher</h4>
            <p>ECO Building Technik GmbH, Seepromenade 109, AT-2384 Ebreichsdorf, E-Mail: office@eco-building.tech</p>
            <h4 className="font-semibold">2. Erhebung und Verarbeitung personenbezogener Daten</h4>
            <p>Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen einer Bestellung, bei einer Kontaktaufnahme (z.B. per Kontaktformular oder E-Mail) oder bei Eröffnung eines Kundenkontos freiwillig mitteilen.</p>
            <h4 className="font-semibold">3. Zweck der Datenverarbeitung</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Abwicklung von Bestellungen und Kundenbetreuung</li>
              <li>Beantwortung von Anfragen</li>
              <li>Technische Administration der Webseite</li>
              <li>Marketing (mit Ihrer Einwilligung)</li>
            </ul>
            <h4 className="font-semibold">4. Rechtsgrundlage</h4>
            <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 DSGVO (Vertragserfüllung, berechtigtes Interesse, Einwilligung).</p>
            <h4 className="font-semibold">4. Weitergabe von Daten</h4>
            <p>Eine Weitergabe Ihrer Daten erfolgt nur an Dritte, wenn dies für die Vertragserfüllung erforderlich ist (z.B. Versanddienstleister, Zahlungsdienstleister) oder wir gesetzlich dazu verpflichtet sind.</p>
            <h4 className="font-semibold">5. Speicherdauer</h4>
            <p>Ihre Daten werden gelöscht, sobald sie für die genannten Zwecke nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen. Rechnungsdaten werden gemäß österreichischem Bundesabgabenordnung für 7 Jahre aufbewahrt.</p>
            <h4 className="font-semibold">6. Ihre Rechte</h4>
            <p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Kontaktieren Sie uns unter <a href="mailto:office@eco-building.tech" className="text-emerald-600 hover:underline">office@eco-building.tech</a>.</p>
            <h4 className="font-semibold">7. Beschwerderecht</h4>
            <p>Sie haben das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren: Österreichische Datenschutzbehörde, Barichgasse 40-42, 1030 Wien, <a href="mailto:dsb@dsb.gv.at" className="text-emerald-600 hover:underline">dsb@dsb.gv.at</a>.</p>
            <h4 className="font-semibold">8. Cookies</h4>
            <p>Unsere Webseite verwendet Cookies. Nähere Informationen finden Sie in unserer Cookie-Richtlinie.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showImpressumDialog} onOpenChange={setShowImpressumDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Impressum</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm text-slate-700">
            <h4 className="font-semibold">ECO Building Technik GmbH</h4>
            <p>Seepromenade 109<br/>AT-2384 Ebreichsdorf<br/>Österreich</p>
            <h4 className="font-semibold">Kontakt</h4>
            <p>Telefon: <a href="tel:+436643289599" className="text-emerald-600 hover:underline">+43 664 328 9599</a><br/>E-Mail: <a href="mailto:office@eco-building.tech" className="text-emerald-600 hover:underline">office@eco-building.tech</a></p>
            <h4 className="font-semibold">Vertretungsberechtigte Geschäftsführer</h4>
            <p>Johannes Fernberg</p>
            <h4 className="font-semibold">Firmenbuchdaten</h4>
            <p>Firmenbuchnummer: FN 123456a<br/>Firmenbuchgericht: Handelsgericht Wien<br/>UID-Nummer: ATU77490127</p>
            <h4 className="font-semibold">Aufsichtsbehörde</h4>
            <p>Gewerbebehörde: Bezirkshauptmannschaft Baden<br/>Berufsrecht: Gewerbeordnung (GewO)</p>
            <h4 className="font-semibold">Streitschlichtung</h4>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">https://ec.europa.eu/consumers/odr</a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            <h4 className="font-semibold">Haftung für Inhalte</h4>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
            <h4 className="font-semibold">Haftung für Links</h4>
            <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
            <h4 className="font-semibold">Urheberrecht</h4>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.</p>
            <h4 className="font-semibold">Bankverbindung</h4>
            <p>GF Johannes Fernberg / ECO Building Technik GmbH<br/>IBAN: AT131400000910084097<br/>BIC: BAWAATWW</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
