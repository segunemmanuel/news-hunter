// Realistic mock news data for demo when no API key is configured
const mockDatabase = {
  us: [
    {
      title: "Academy Awards Dazzle Hollywood as Record Viewers Tune In",
      description: "The 97th Oscars ceremony drew record viewership as surprise winners celebrated onstage at the Dolby Theatre, with emotional speeches drawing standing ovations from the star-studded crowd.",
      source: "Entertainment Tonight",
      url: "#",
      publishedAt: "2 hours ago",
      sentiment: "positive"
    },
    {
      title: "Tech Giants Report Record Quarter Earnings Amid AI Investment Surge",
      description: "Major technology companies beat Wall Street expectations as artificial intelligence investments continue to drive unprecedented revenue growth across the sector.",
      source: "Financial Times",
      url: "#",
      publishedAt: "4 hours ago",
      sentiment: "positive"
    }
  ],
  gb: [
    {
      title: "UK Economy Shows Resilient Growth in Latest Quarter",
      description: "Britain's GDP expanded more than expected as consumer spending and exports offset global headwinds, boosting confidence in the country's economic recovery.",
      source: "BBC News",
      url: "#",
      publishedAt: "1 hour ago",
      sentiment: "positive"
    },
    {
      title: "Historic Climate Deal Signed at London Summit",
      description: "World leaders gathered in Westminster to sign a landmark agreement pledging unprecedented funding for renewable energy transition across developing nations.",
      source: "The Guardian",
      url: "#",
      publishedAt: "3 hours ago",
      sentiment: "positive"
    }
  ],
  fr: [
    {
      title: "Paris Fashion Week Celebrates Return of Iconic Designers",
      description: "Spring collections dazzled the fashion world as legendary couture houses unveiled breathtaking runway shows along the Champs-Élysées to thunderous applause.",
      source: "Le Monde",
      url: "#",
      publishedAt: "30 mins ago",
      sentiment: "positive"
    },
    {
      title: "Protests Continue Over Pension Reform Amid Strike Action",
      description: "Thousands gathered in Paris and major cities as trade unions called for a general strike, disrupting transport networks and public services across the country.",
      source: "France 24",
      url: "#",
      publishedAt: "2 hours ago",
      sentiment: "negative"
    }
  ],
  de: [
    {
      title: "Germany Unveils Ambitious Green Hydrogen Infrastructure Plan",
      description: "Berlin announced a €40 billion investment in green hydrogen production and distribution, positioning Germany as Europe's leading clean energy hub by 2030.",
      source: "Der Spiegel",
      url: "#",
      publishedAt: "1 hour ago",
      sentiment: "positive"
    },
    {
      title: "Manufacturing Output Falls Amid Global Supply Chain Pressures",
      description: "German industrial production declined for the third consecutive month as energy costs and weakened export demand continue to weigh on Europe's largest economy.",
      source: "Deutsche Welle",
      url: "#",
      publishedAt: "3 hours ago",
      sentiment: "negative"
    }
  ],
  jp: [
    {
      title: "Tokyo Olympics Legacy: Japan's Sports Culture Transformed",
      description: "A new generation of Japanese athletes is dominating international competitions, with record medal hauls at recent world championships inspiring millions of young people.",
      source: "NHK World",
      url: "#",
      publishedAt: "45 mins ago",
      sentiment: "positive"
    },
    {
      title: "Earthquake Rocks Northern Japan, Tsunami Warning Issued",
      description: "A magnitude 6.4 earthquake struck off the Hokkaido coast, prompting emergency services to issue precautionary tsunami warnings and evacuate coastal communities.",
      source: "Japan Times",
      url: "#",
      publishedAt: "2 hours ago",
      sentiment: "negative"
    }
  ],
  au: [
    {
      title: "Australia Breaks Solar Energy Record with 70% Renewable Day",
      description: "For the first time in history, solar and wind power supplied over 70% of Australia's electricity needs for a full day, marking a milestone in the clean energy transition.",
      source: "ABC Australia",
      url: "#",
      publishedAt: "2 hours ago",
      sentiment: "positive"
    },
    {
      title: "Bushfire Season Declared Early Amid Record Drought Conditions",
      description: "Emergency authorities warn of severe bushfire risk across New South Wales and Victoria as a prolonged drought creates dangerous tinder-dry conditions weeks ahead of schedule.",
      source: "Sydney Morning Herald",
      url: "#",
      publishedAt: "1 hour ago",
      sentiment: "negative"
    }
  ],
  br: [
    {
      title: "Brazil Secures 2030 World Cup Co-Host Bid with Record Vote",
      description: "FIFA awarded South America its second World Cup in a decade as Brazil's passionate campaign and state-of-the-art stadium plans secured an overwhelming majority vote.",
      source: "Globo Esporte",
      url: "#",
      publishedAt: "3 hours ago",
      sentiment: "positive"
    },
    {
      title: "Amazon Deforestation Reaches Critical 5-Year High",
      description: "Satellite data reveals a devastating 28% spike in Amazon deforestation, alarming scientists who warn the tipping point for irreversible ecosystem collapse is approaching.",
      source: "Folha de S.Paulo",
      url: "#",
      publishedAt: "4 hours ago",
      sentiment: "negative"
    }
  ],
  in: [
    {
      title: "India Launches World's Largest Solar Farm in Rajasthan Desert",
      description: "Prime Minister Modi inaugurated a 30 GW solar mega-complex, enough to power 30 million homes, as India accelerates its renewable energy ambitions ahead of 2030 targets.",
      source: "Times of India",
      url: "#",
      publishedAt: "1 hour ago",
      sentiment: "positive"
    },
    {
      title: "Mumbai Flooding Displaces Thousands as Monsoon Intensifies",
      description: "Record rainfall triggered severe flooding in low-lying Mumbai suburbs, forcing emergency evacuations of over 50,000 residents as relief operations stretched capacity.",
      source: "Hindustan Times",
      url: "#",
      publishedAt: "30 mins ago",
      sentiment: "negative"
    }
  ],
  ua: [
    {
      title: "Ukraine Conflict: Ongoing Shelling Reported in Eastern Regions",
      description: "Intense artillery exchanges continued along the eastern front lines as international peace negotiations stalled, with civilian casualties reported in multiple settlements.",
      source: "Kyiv Independent",
      url: "#",
      publishedAt: "30 mins ago",
      sentiment: "negative"
    },
    {
      title: "Aid Convoy Delivers Critical Supplies to War-Torn Regions",
      description: "A UN-coordinated humanitarian convoy successfully reached isolated communities in eastern Ukraine, delivering food, medicine and winter supplies to over 100,000 displaced civilians.",
      source: "Reuters",
      url: "#",
      publishedAt: "2 hours ago",
      sentiment: "negative"
    }
  ],
  cn: [
    {
      title: "China's Space Station Welcomes New Six-Month Crew",
      description: "Three taikonauts successfully docked with the Tiangong space station, beginning a six-month mission that includes experiments in quantum communications and materials science.",
      source: "Xinhua",
      url: "#",
      publishedAt: "1 hour ago",
      sentiment: "positive"
    },
    {
      title: "Trade Tensions Rise as New Technology Export Controls Announced",
      description: "Beijing announced sweeping restrictions on the export of advanced semiconductor materials, escalating the ongoing technology conflict with Western nations.",
      source: "South China Morning Post",
      url: "#",
      publishedAt: "3 hours ago",
      sentiment: "negative"
    }
  ],
}

const defaultNews = (locationName) => [
  {
    title: `Breaking: Latest Developments from ${locationName}`,
    description: "Our correspondents are tracking multiple developing stories from this region. Stay tuned for comprehensive coverage as events continue to unfold.",
    source: "Globe News Network",
    url: "#",
    publishedAt: "Just now",
    sentiment: "neutral"
  },
  {
    title: `${locationName}: Economic and Social Updates`,
    description: "Analysts and local reporters provide insight into the key issues shaping daily life, governance and international relations in this part of the world.",
    source: "Globe News Network",
    url: "#",
    publishedAt: "1 hour ago",
    sentiment: "neutral"
  }
]

export function getMockNews(location) {
  const data = mockDatabase[location.country]
  if (data) return data
  return defaultNews(location.name)
}
