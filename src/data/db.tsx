/*
 * This file is part of GEO-Country-Profile.
 * Copyright (C) 2025 GEO Knowledge Hub Developers.
 *
 * GEO-Country-Profile is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { StaticImageData } from 'next/image';

/**
 * Resource Icons
 */
import iconVideo from '@public/content/resources/video.svg';
import iconUserStory from '@public/content/resources/user-story.svg';
import iconPackage from '@public/content/resources/knowledge-package.svg';
import iconPresentation from '@public/content/resources/presentation.svg';

/**
 * Placeholder icons
 */
import placeholderRepresentative from '@public/content/representative/placeholder.svg';

/**
 * Flags
 */
import flagAustralia from '@public/content/flags/flag-australia.png';
import flagBrazil from '@public/content/flags/flag-brazil.png';
import flagChina from '@public/content/flags/flag-china.png';
import flagColombia from '@public/content/flags/flag-colombia.png';
import flagFrance from '@public/content/flags/flag-france.png';
import flagGhana from '@public/content/flags/flag-ghana.png';
import flagItaly from '@public/content/flags/flag-italy.png';
import flagKazakhstan from '@public/content/flags/flag-kazakhstan.png';
import flagNorway from '@public/content/flags/flag-norway.png';
import flagSouthAfrica from '@public/content/flags/flag-south-africa.png';
import flagSwitzerland from '@public/content/flags/flag-switzerland.png';
import flagUSA from '@public/content/flags/flag-usa.png';

/**
 * Partners
 */
import ghanaPartnerGSA from '@public/content/partners/ghana/gsa.jpeg';
import ghanaPartnerAfriGEO from '@public/content/partners/ghana/afrigeo.png';
import ghanaPartnerDEAfrica from '@public/content/partners/ghana/deafrica.png';

/**
 * Represents a key fact about a country.
 */
export interface KeyFact {
  type: string; // The type of key fact (e.g., ``Capital``, ``Population``, ``Language``)
  value: string; // The corresponding value (e.g., ``Accra``, ``35 million``)
}

/**
 * Represents a resource item available for a country.
 */
export interface ResourceContentItem {
  title: string;
  type: string;
  uploaded: string;
  description: string;
  link: string;
  icon: string;
}

/**
 * Represents the content for a resource, categorized into local and global sources.
 */
export interface ResourceContent {
  local: ResourceContentItem[];
  global: ResourceContentItem[];
}

/**
 * Represents a resource with detailed information.
 */
export interface Resource {
  title: string;
  description: string;
  link: string;
  content: ResourceContent;
}

/**
 * Represents a capacity-building activity.
 */
export interface CapacityBuildingActivity {
  title: string;
  description: string;
  link: string;
}

/**
 * Represents a partner organization.
 */
export interface Partner {
  name: string;
  description: string;
  logo: StaticImageData | string;
}

/**
 * Represents a key representative.
 */
export interface Representative {
  name: string;
  email: string;
  logo: StaticImageData | string;
}

/**
 * Represents a country's data including resources, activities, and partners.
 */
export interface Country {
  id: string;
  title: string;
  description: string[];
  flag: StaticImageData;
  keyFacts: KeyFact[];
  resources: Resource[];
  capacityBuildingActivities: CapacityBuildingActivity[];
  partners: Partner[];
  representatives: Representative[];
}

/**
 * Represents the main structure containing multiple countries' data.
 */
export interface CountryProfileData {
  countries: Record<string, Country>;
}

const data: CountryProfileData = {
  countries: {
    australia: {
      id: 'australia',
      title: 'Australia',
      description: ['Example description'],
      flag: flagAustralia,
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    brazil: {
      id: 'brazil',
      title: 'Brazil',
      flag: flagBrazil,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    colombia: {
      id: 'colombia',
      title: 'Colombia',
      flag: flagColombia,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    france: {
      id: 'france',
      title: 'France',
      flag: flagFrance,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    ghana: {
      id: 'ghana',
      title: 'Ghana',
      description: [
        'Ghana, located in West Africa, is known for its diverse ecosystems, ranging from coastal lagoons and savannahs to lush rainforests. It has a rich cultural heritage, abundant natural resources, and a growing economy driven by agriculture, mining, and energy.',
        'Despite its progress, Ghana faces significant environmental challenges, including deforestation, land degradation, water pollution, and the effects of climate change. These issues have critical implications for sustainable development and the livelihoods of its citizens.',
        'This platform aims to provide resources and knowledge to support efforts in addressing these environmental challenges and fostering sustainable growth.',
      ],
      flag: flagGhana,
      keyFacts: [
        {
          type: 'Capital',
          value: 'Accra',
        },
        {
          type: 'Population',
          value: '35 million',
        },
        {
          type: 'Official Language',
          value: 'English',
        },
        {
          type: 'Currency',
          value: 'Ghanaian Cedi (GHS)',
        },
      ],
      resources: [
        {
          title: 'Land Degradation',
          description: 'Learn about soil erosion, overgrazing, and unsustainable farming.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Climate Change',
          description:
            'Explore mitigation strategies for rising temperatures and erratic weather patterns.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Loss of Biodiversity',
          description: 'Learn about efforts to protect wildlife and restore ecosystems.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Illegal Mining',
          description:
            "Discover resources addressing the impacts of 'galamsey' on the environment.",
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Overfishing',
          description:
            'Understand the consequences of unsustainable fishing practices on food security.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Drought',
          description: 'Learn about resources for drought management and mitigation.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Coastal Erosion',
          description: 'Explore impacts of coastal erosion and protective measures.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Pollution',
          description: 'Find resources to address air, water, and industrial pollution.',
          link: 'pollution',
          content: {
            local: [
              {
                title: 'Monitoring Chlorophyll-a in Africa Waterbodies Using DEA Data Cube',
                type: 'Knowledge Package',
                uploaded: 'September 22, 2022',
                description:
                  'This knowledge package examines inland waterbodies, utilizing satellite imagery to assess water quality and analyze algal bloom patterns.',
                link: 'https://gkhub.earthobservations.org/packages/mpx7j-a8510',
                icon: iconPackage,
              },
              {
                title: 'Detecting Change in Urban Extent Using Digital Earth Africa Data Cube',
                type: 'Knowledge Package',
                uploaded: 'November 29, 2022',
                description:
                  'Knowledge Package presenting tools for monitoring urban expansion, sustainability, and infrastructure challenges using EO data.',
                link: 'https://gkhub.earthobservations.org/packages/ka6hq-87x10',
                icon: iconPackage,
              },
              {
                title: 'Big Data Ghana: Sustainable Agriculture with Digital Earth Africa',
                type: 'User Story',
                uploaded: 'January 4, 2023',
                description: 'Using CHIRPS and NDVI data to improve agricultural sustainability.',
                link: 'https://gkhub.earthobservations.org/records/ttr2j-qfq47',
                icon: iconUserStory,
              },
              {
                title: 'Space-based Data Advancement on Data Providers',
                type: 'Presentation',
                uploaded: 'October 7, 2024',
                description: 'Focused on leveraging space-based data for pollution monitoring.',
                link: 'https://gkhub.earthobservations.org/records/zgm2k-1tw39',
                icon: iconPresentation,
              },
            ],
            global: [
              {
                title: 'UrbEm - The Urban Emission downscaling model for air quality modeling',
                type: 'Knowledge Package',
                uploaded: 'October 7, 2024',
                description: 'Detailed Knowledge Package about the UrbEm model',
                link: 'https://doi.org/10.60566/t252k-rk431',
                icon: iconPackage,
              },
              {
                title:
                  'e-shape pilot S2-P3 - EO-based pollution-health risks profiling in the urban environment',
                type: 'Video',
                uploaded: 'October 7, 2024',
                description:
                  'Detailed knowledge package addressing pollution-health risks in urban environments.',
                link: 'https://doi.org/10.60566/jaf2d-7bj57',
                icon: iconVideo,
              },
            ],
          },
        },
        {
          title: 'Flood',
          description: 'Explore resources related to flood risks and mitigation.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
        {
          title: 'Deforestation',
          description: 'Understand deforestation trends and management strategies.',
          link: '#',
          content: {
            local: [],
            global: [],
          },
        },
      ],
      capacityBuildingActivities: [
        {
          title: 'Capacity build example A',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
        },
        {
          title: 'Capacity build example B',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
        },
        {
          title: 'Capacity build example C',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
        },
      ],
      partners: [
        {
          name: 'Ghana Space Agency',
          description: 'A leading innovation center promoting technology growth in Ghana.',
          logo: ghanaPartnerGSA,
        },
        {
          name: 'AfriGEO',
          description: 'Supporting innovative initiatives across Africa.',
          logo: ghanaPartnerAfriGEO,
        },
        {
          name: 'Digital Earth Africa',
          description:
            'Fostering the development of innovative tools and capacity building in Africa.',
          logo: ghanaPartnerDEAfrica,
        },
      ],
      representatives: [
        {
          name: 'Representative Contact A',
          email: 'email@mail.org',
          logo: placeholderRepresentative,
        },
        {
          name: 'Representative Contact B',
          email: 'email@mail.org',
          logo: placeholderRepresentative,
        },
        {
          name: 'Representative Contact C',
          email: 'email@mail.org',
          logo: placeholderRepresentative,
        },
      ],
    },
    italy: {
      id: 'italy',
      title: 'Italy',
      flag: flagItaly,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    kazakhstan: {
      id: 'kazakhstan',
      title: 'Kazakhstan',
      flag: flagKazakhstan,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    norway: {
      id: 'norway',
      title: 'Norway',
      flag: flagNorway,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    china: {
      id: 'china',
      title: "People's Republic of China",
      flag: flagChina,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    'south-africa': {
      id: 'south-africa',
      title: 'South Africa',
      flag: flagSouthAfrica,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    switzerland: {
      id: 'switzerland',
      title: 'Switzerland',
      flag: flagSwitzerland,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
    usa: {
      id: 'usa',
      title: 'United States of America',
      flag: flagUSA,
      description: ['Example description'],
      keyFacts: [
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
        {
          type: 'Key',
          value: 'Fact',
        },
      ],
      resources: [],
      capacityBuildingActivities: [
        {
          title: 'Example',
          description: 'Example',
          link: 'example',
        },
      ],
      partners: [
        {
          name: 'Example',
          description: 'Example',
          logo: '',
        },
      ],
      representatives: [
        {
          name: 'example',
          email: 'example@example.org',
          logo: '',
        },
      ],
    },
  },
};

export default data;
