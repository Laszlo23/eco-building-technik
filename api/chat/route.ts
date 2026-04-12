import { streamText, tool, convertToModelMessages } from 'ai'
import { z } from 'zod'

// Product catalog for recommendations
const productCatalog = [
  // Wärmepumpen
  {
    id: 1,
    category: 'Wärmepumpen',
    name: 'JNOD A+++ Wärmepumpe 12kW',
    description: 'Die ideale Wärmepumpe für Einfamilienhäuser bis 150m². A+++ Energieeffizienz mit R32 Kältemittel.',
    price: '€ 4.299,00',
    priceValue: 4299,
    power: 12,
    maxArea: 150,
    specs: ['A+++', '12kW', 'R32', 'COP 5.0', 'WiFi'],
    benefits: ['5 Jahre Garantie', 'Klimaförderung bis € 5.000', 'Lieferung in 3-5 Tagen'],
    isTopProduct: true,
  },
  {
    id: 2,
    category: 'Wärmepumpen',
    name: 'JNOD A+++ Wärmepumpe 16kW',
    description: 'Beste Wärmepumpe für größere Häuser bis 200m². Höchste Effizienzklasse A+++.',
    price: '€ 5.499,00',
    priceValue: 5499,
    power: 16,
    maxArea: 200,
    specs: ['A+++', '16kW', 'R32', 'COP 4.8', 'Smart Control'],
    benefits: ['5 Jahre Garantie', 'Klimaförderung bis € 5.000'],
    isTopProduct: true,
  },
  {
    id: 3,
    category: 'Wärmepumpen',
    name: 'JNOD Heizung und Warmwasser Wärmepumpe 11kW',
    description: 'Energieeffiziente Wärmepumpe für Heizung und Warmwasser. A+++ mit Zertifikat.',
    price: '€ 3.899,00',
    priceValue: 3899,
    power: 11,
    maxArea: 140,
    specs: ['A+++', '11kW', 'Heizung + WW', 'CE/UKCA/CB'],
    benefits: ['3 Jahre Garantie', 'Heizung + Warmwasser'],
    isTopProduct: true,
  },
  // Gas-Brennwert
  {
    id: 41,
    category: 'Gas-Brennwert',
    name: 'Squirrel M30 Gas-Boiler 25kW',
    description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 200m².',
    price: '€ 2.199,00',
    priceValue: 2199,
    power: 25,
    maxArea: 200,
    specs: ['25kW', 'WiFi/App', 'Kondensierend', '103% Effizienz'],
    isTopProduct: true,
  },
  {
    id: 42,
    category: 'Gas-Brennwert',
    name: 'Squirrel M30 Gas-Boiler 30kW',
    description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 280m².',
    price: '€ 2.599,00',
    priceValue: 2599,
    power: 30,
    maxArea: 280,
    specs: ['30kW', 'WiFi/App', 'Kondensierend', '103% Effizienz'],
    isTopProduct: true,
  },
  {
    id: 43,
    category: 'Gas-Brennwert',
    name: 'Squirrel M30 Gas-Boiler 35kW',
    description: 'Vollkondensierender Gas-Boiler mit WiFi & App-Steuerung. Für Häuser bis 420m².',
    price: '€ 2.999,00',
    priceValue: 2999,
    power: 35,
    maxArea: 420,
    specs: ['35kW', 'WiFi/App', 'Kondensierend', '103% Effizienz'],
    isTopProduct: true,
  },
  // Smart Home
  {
    id: 10,
    category: 'Smart Home',
    name: 'TONGOU Smart Switch 1-Gang',
    description: 'Intelligente Lichtsteuerung für Ihr Zuhause. Tuya/Smart Life App, Alexa & Google kompatibel.',
    price: '€ 24,90',
    priceValue: 24.9,
    specs: ['WiFi', '1-Gang', 'Tuya', 'Alexa', 'Google Home'],
    isTopProduct: true,
  },
  {
    id: 14,
    category: 'Smart Home',
    name: 'TONGOU Smart Dimmer Switch',
    description: 'Dimmbarer Smart Switch für stufenlose Lichtregelung.',
    price: '€ 32,90',
    priceValue: 32.9,
    specs: ['WiFi', 'Dimmer', 'Tuya', 'Alexa', 'Google Home'],
    isTopProduct: true,
  },
  {
    id: 17,
    category: 'Smart Home',
    name: 'TONGOU Smart Thermostat',
    description: 'Smartes Thermostat für Heizungssteuerung.',
    price: '€ 44,90',
    priceValue: 44.9,
    specs: ['WiFi', 'Thermostat', 'Tuya', 'Zeitplan', 'Sprachsteuerung'],
    isTopProduct: true,
  },
  {
    id: 50,
    category: 'Smart Home',
    name: 'GIRIER Zigbee Smart Switch Modul 1-Gang',
    description: 'Zigbee 3.0 Smart Switch Modul für Unterputz-Montage.',
    price: '€ 18,90',
    priceValue: 18.9,
    specs: ['Zigbee 3.0', '1-Gang', '10A', '2-Wege', 'Unterputz'],
    isTopProduct: true,
  },
]

const systemPrompt = `Du bist ein freundlicher und kompetenter Verkaufsberater bei ECO Building Technik GmbH, einem Fachbetrieb für nachhaltige Gebäudetechnik in Ebreichsdorf, Österreich.

DEINE AUFGABEN:
- Berate Kunden zu Wärmepumpen, Gas-Brennwertgeräten und Smart Home Produkten
- Frage nach relevanten Details wie Hausgröße (m²), aktuelle Heizung, Budget und besonderen Anforderungen
- Empfehle passende Produkte basierend auf den Kundenanforderungen
- Erkläre technische Spezifikationen verständlich
- Weise auf Förderungen hin (z.B. Klimaförderung bis € 5.000 für Wärmepumpen)

UNSER SORTIMENT:
- Wärmepumpen: JNOD A+++ (11-16kW) für Häuser von 140-200m², mit R32 Kältemittel
- Gas-Brennwertgeräte: Squirrel M30 Serie (25-35kW) für Häuser bis 420m²
- Smart Home: TONGOU WiFi-Switches, GIRIER Zigbee-Module, Thermostate, LED-Beleuchtung

WICHTIGE HINWEISE:
- Wärmepumpen und Gas-Brennwertgeräte qualifizieren sich für Förderungen
- Kostenloser Versand ab € 50 für Smart Home Produkte
- Wir bieten kostenlose Beratung und Angebotserstellung

KOMMUNIKATIONSSTIL:
- Sprich Deutsch mit dem Kunden
- Sei freundlich, hilfsbereit und professionell
- Frage nach, wenn du mehr Informationen brauchst
- Halte Antworten prägnant aber informativ

Wenn du Produkte empfiehlst, verwende das recommendProducts Tool um passende Produkte zu finden.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      recommendProducts: tool({
        description: 'Empfiehlt Produkte basierend auf den Kundenanforderungen. Verwende dieses Tool wenn der Kunde nach Produktempfehlungen fragt oder wenn du genug Informationen hast um eine Empfehlung zu geben.',
        inputSchema: z.object({
          houseSize: z.number().optional().describe('Hausgröße in Quadratmetern'),
          heatingType: z.enum(['Wärmepumpe', 'Gas-Brennwert', 'Smart Home', 'alle']).optional().describe('Gewünschter Heizungstyp oder Produktkategorie'),
          maxBudget: z.number().optional().describe('Maximales Budget in Euro'),
          requirements: z.string().optional().describe('Besondere Anforderungen des Kunden'),
        }),
        execute: async ({ houseSize, heatingType, maxBudget }) => {
          let filtered = [...productCatalog]

          // Filter by category
          if (heatingType && heatingType !== 'alle') {
            filtered = filtered.filter(p => p.category === heatingType)
          }

          // Filter by house size (for heating products)
          if (houseSize) {
            filtered = filtered.filter(p => {
              if (p.maxArea) {
                return p.maxArea >= houseSize
              }
              return true // Keep non-heating products
            })
          }

          // Filter by budget
          if (maxBudget) {
            filtered = filtered.filter(p => p.priceValue <= maxBudget)
          }

          // Sort by relevance (top products first, then by price)
          filtered.sort((a, b) => {
            if (a.isTopProduct && !b.isTopProduct) return -1
            if (!a.isTopProduct && b.isTopProduct) return 1
            return a.priceValue - b.priceValue
          })

          // Return top 3 recommendations
          const recommendations = filtered.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            specs: p.specs,
            benefits: p.benefits || [],
          }))

          return {
            recommendations,
            totalFound: filtered.length,
            message: recommendations.length > 0 
              ? `Ich habe ${recommendations.length} passende Produkte gefunden.`
              : 'Leider habe ich keine Produkte gefunden, die Ihren Kriterien entsprechen. Möchten Sie die Anforderungen anpassen?'
          }
        },
      }),
    },
    maxSteps: 5,
  })

  return result.toUIMessageStreamResponse()
}
