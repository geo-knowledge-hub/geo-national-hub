/*
 * This file is part of GEO-National-Hub.
 *
 * Copyright (C) 2025 GEO Knowledge Hub contributors.
 *
 * GEO-National-Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { StaticImageData } from 'next/image';

import { BookOpenIcon } from '@heroicons/react/24/outline';

import { FocusAreasChallenges, GEOFocusArea, GEOFocusAreaChallenge } from './geo';

/**
 * Resource Icons
 */
import iconPackage from '@public/content/resources/knowledge-package.svg';
import iconPlatform from '@public/content/resources/platform.svg';

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
import flagSouthAfrica from '@public/content/groups/sageo.jpg';
import flagSwitzerland from '@public/content/flags/flag-switzerland.png';
import flagUSA from '@public/content/flags/flag-usa.png';

/**
 * Partners
 */
import ghanaPartnerGSA from '@public/content/partners/ghana/gsa.jpeg';
import ghanaPartnerAfriGEO from '@public/content/partners/ghana/afrigeo.png';
import ghanaPartnerDEAfrica from '@public/content/partners/ghana/deafrica.png';

import southAfricaPartnerCSIR from '@public/content/partners/south-africa/csir.jpg';
import southAfricaPartnerSANSA from '@public/content/partners/south-africa/sansa.png';

/**
 * Community of practice
 */
import imageMechanismSAEOInfra from '@public/content/concepts/community-of-practice/south-africa/mechanism-eoi.svg';
import imageMechanismSAEOGovernance from '@public/content/concepts/community-of-practice/south-africa/mechanism-governance.svg';

import { HeroIcon } from './geo';

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
  id?: number;
  title: string;
  description: string;
  link: string;
  icon: StaticImageData | string;
  type: string;
  uploaded: string;
  challenges: GEOFocusAreaChallenge[];
  extras: string[];
  country?: string;
}

/**
 * Represents a capacity-building activity.
 */
export interface CapacityBuildingActivity {
  title: string;
  description: string;
  link: string;
  logo: HeroIcon;
}

/**
 * Represents a partner organization.
 */
export interface Partner {
  name: string;
  description: string;
  logo: StaticImageData | string;
  link: string;
}

/**
 * Represents a Enabling mechanism.
 */
export interface Mechanism {
  name: string;
  description: string;
  link: string;
  logo: StaticImageData | string;
}

/**
 * Represents a key representative.
 */
export interface Representative {
  name: string;
  profile: string;
  role: string;
  avatar: StaticImageData | string;
}

/**
 * Represents a community of Practice
 */
export interface CommunityOfPractice {
  name: string;
  description: string;
  logo: StaticImageData | string;
  link: string;
}

/**
 * Represents a country's data including resources, activities, and partners.
 */
export interface Country {
  id: string;
  title: string;
  flag: StaticImageData;
  resources: Resource[];
  focusAreas: GEOFocusArea[];
  capacityBuildingActivities: CapacityBuildingActivity[];
  partners: Partner[];
  representatives: Representative[];
  communityOfPractice: CommunityOfPractice | null;
  mechanisms: Mechanism[];
  challenges: GEOFocusAreaChallenge[];
}

/**
 * Represents the main structure containing multiple countries' data.
 */
export interface CountryProfileData {
  countries: Record<string, Country>;
}

/**
 * Example country data
 */
const exampleCountry = {
  communityOfPractice: null,
  resources: [],
  focusAreas: [],
  challenges: [],
  mechanisms: [],
  capacityBuildingActivities: [
    {
      title: 'Capacity build example A',
      description:
        'This placeholder text shows how capacity building can be presented on the country profile page.',
      link: '#',
      logo: BookOpenIcon,
    },
    {
      title: 'Capacity build example B',
      description:
        'This placeholder text shows how capacity building can be presented on the country profile page.',
      link: '#',
      logo: BookOpenIcon,
    },
    {
      title: 'Capacity build example C',
      description:
        'This placeholder text shows how capacity building can be presented on the country profile page.',
      link: '#',
      logo: BookOpenIcon,
    },
    {
      title: 'Capacity build example D',
      description:
        'This placeholder text shows how capacity building can be presented on the country profile page.',
      link: '#',
      logo: BookOpenIcon,
    },
  ],
  partners: [],
  representatives: [
    {
      name: 'Representative Contact A',
      role: 'Capacity Building manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact B',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
    {
      name: 'Representative Contact C',
      role: 'Manager in Ghana',
      profile: '#',
      avatar: placeholderRepresentative,
    },
  ],
};

const data: CountryProfileData = {
  countries: {
    australia: {
      ...exampleCountry,
      id: 'australia',
      title: 'Australia',
      flag: flagAustralia,
    },
    brazil: {
      ...exampleCountry,
      id: 'brazil',
      title: 'Brazil',
      flag: flagBrazil,
    },
    colombia: {
      ...exampleCountry,
      id: 'colombia',
      title: 'Colombia',
      flag: flagColombia,
    },
    france: {
      ...exampleCountry,
      id: 'france',
      title: 'France',
      flag: flagFrance,
    },
    ghana: {
      id: 'ghana',
      title: 'Ghana',
      flag: flagGhana,
      communityOfPractice: null,
      focusAreas: [],
      challenges: [],
      mechanisms: [],
      resources: [
        {
          title: 'Monitoring Chlorophyll-a in Africa Waterbodies Using DEA Data Cube',
          type: 'Knowledge Package',
          uploaded: 'September 22, 2022',
          description:
            'This knowledge package examines inland waterbodies, utilizing satellite imagery to assess water quality and analyze algal bloom patterns.',
          link: 'https://gkhub.earthobservations.org/packages/mpx7j-a8510',
          icon: iconPackage,
          challenges: [
            FocusAreasChallenges.Pollution,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.LossBiodiversity,
          ],
          extras: [],
        },
        {
          title: 'Detecting Change in Urban Extent Using Digital Earth Africa Data Cube',
          type: 'Knowledge Package',
          uploaded: 'November 29, 2022',
          description:
            'Knowledge Package presenting tools for monitoring urban expansion, sustainability, and infrastructure challenges using EO data.',
          link: 'https://gkhub.earthobservations.org/packages/ka6hq-87x10',
          icon: iconPackage,
          challenges: [FocusAreasChallenges.Pollution],
          extras: [],
        },
      ],
      capacityBuildingActivities: [
        {
          title: 'Capacity build example A',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example B',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example C',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example D',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
      ],
      partners: [
        {
          name: 'Ghana Space Science and Technology Institute',
          description: 'A leading innovation center promoting technology growth in Ghana.',
          logo: ghanaPartnerGSA,
          link: 'https://gssti.org/',
        },
        {
          name: 'AfriGEO',
          description: 'Supporting innovative initiatives across Africa.',
          logo: ghanaPartnerAfriGEO,
          link: 'https://afrigeo.africageoportal.com/',
        },
        {
          name: 'Digital Earth Africa',
          description:
            'Fostering the development of innovative tools and capacity building in Africa.',
          logo: ghanaPartnerDEAfrica,
          link: 'https://www.digitalearthafrica.org/',
        },
      ],
      representatives: [
        {
          name: 'Joseph Bremang Tandoh',
          role: 'GEO Principal',
          profile: 'https://earthobservations.org/profile/13885',
          avatar: placeholderRepresentative,
        },
        {
          name: 'Amos Kabo-Bah',
          role: 'GEO Principal Alternate',
          profile: 'https://earthobservations.org/profile/14390',
          avatar:
            'https://earthobservations.org/storage/app/resources/resize/700_0_0_0_auto/img_27e065dd50b7d4137c8cd3e312aaa246.webp',
        },

        {
          name: 'Kofi Asare',
          role: 'GEO Principal Alternate and GEO Focal Point',
          profile: 'https://earthobservations.org/profile/13056',
          avatar:
            'https://earthobservations.org/storage/app/resources/resize/700_0_0_0_auto/img_fbafa07e9ef623d7e1e8db60a3e77a1d.webp',
        },
      ],
    },
    italy: {
      ...exampleCountry,
      id: 'italy',
      title: 'Italy',
      flag: flagItaly,
    },
    kazakhstan: {
      ...exampleCountry,
      id: 'kazakhstan',
      title: 'Kazakhstan',
      flag: flagKazakhstan,
    },
    norway: {
      ...exampleCountry,
      id: 'norway',
      title: 'Norway',
      flag: flagNorway,
    },
    china: {
      ...exampleCountry,
      id: 'china',
      title: "People's Republic of China",
      flag: flagChina,
    },
    'south-africa': {
      id: 'south-africa',
      title: 'South Africa',
      flag: flagSouthAfrica,
      focusAreas: [],
      challenges: [],
      mechanisms: [
        {
          name: 'Earth Observations Infrastructure',
          description:
            'This CoP is dedicated to promoting the current efforts and activities leading towards the integration, harmonisation, interoperability and dissemination of data, derived products and services and decision support systems activities, through utilization of relevant data infrastructures.',
          link: 'https://neoss.co.za/sa-geo/earth-observations-infrastructure',
          logo: imageMechanismSAEOInfra,
        },
        {
          name: 'Data Governance',
          description:
            'This CoP is dedicated to promoting data governance and developing general principles for facilitating and enhancing access to and the uptake of earth observation data and formation by a wide range of user communities, in a coherent manner and provide guidance and best practices on standards such as data openness, transparency, stakeholder engagement, intellectual property rights (IPR).',
          link: 'https://neoss.co.za/sa-geo/data-governance',
          logo: imageMechanismSAEOGovernance,
        },
      ],
      communityOfPractice: {
        name: 'NEOSS Community of Practice',
        description:
          'A collaborative space where experts, stakeholders, and community members come together to share knowledge, learn, and drive innovation in EO',
        logo: flagSouthAfrica,
        link: 'https://neoss.co.za/',
      },
      resources: [
        {
          title: 'ARC Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Data on agricultural research including crop yields and soil types.',
          link: 'https://www.agroclimate.agric.za/WP/WP/',
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
          extras: ['Agriculture, Soil, Climate', 'Agricultural Research Council (ARC)'],
        },
        {
          title: 'Greenbook',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Municipal risk profile',
          link: 'https://riskprofiles.greenbook.co.za/',
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
          extras: [
            'Agriculture, forestry and fisheries',
            'Council for Scientific and Industrial Research (CSIR) - Greenbook',
          ],
        },
        {
          title: 'Chief Directorate: National Geo-spatial Information',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Historical aerial photography, National digital aerial imagery coverage',
          link: 'http://www.cdngiportal.co.za/cdngiportal/',
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
          extras: [
            'Imagery, Maps',
            'Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          ],
        },
        {
          title: 'Climate Information Portal (CIP)',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Web portal delivering observed climate data and future projections for Africa.',
          link: 'https://cip.csag.uct.ac.za',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Temperature, rainfall, and climate model projections for specific locations',
            'CSAG (UCT)',
          ],
        },
        {
          title: 'GIS Data',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Monitoring points, Rivers, Drainage regions, Ecoregions, Water resources',
          link: 'https://www.dws.gov.za/iwqs/gis_data/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Water-related spatial data, vector data',
            'Department of Water and Sanitation (DWS)',
          ],
        },
        {
          title: 'South African Air Quality Information System (SAAQIS)',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Platform providing live and historical air quality data from monitoring networks.',
          link: 'https://saaqis.environment.gov.za',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Ambient pollutant levels (PM, SO\u2082, NO\u2082, O\u2083), AQI maps',
            'Department of Water and Sanitation (DWS)/South African Weather Service(SAWS)',
          ],
        },
        {
          title: 'AFIS',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'a satellite-based fire information tool that provides near real time fire information to users across the globe.',
          link: 'https://www.afis.co.za/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Fire data', 'Fire Monitoring System'],
        },
        {
          title: 'SAEON Open Data Platform (ODP)',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Metadata repository and data portal for long-term environmental observations across SA.',
          link: 'https://catalogue.saeon.ac.za',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Climate, oceanographic, ecological, meteorological data from field stations',
            'South African Environmental Observation Network (SAEON)',
          ],
        },
        {
          title: 'IBA Database',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Directory and map of Important Bird & Biodiversity Areas in SA for conservation.',
          link: 'https://datazone.birdlife.org/country/factsheet/south-africa',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'IBA boundaries, species of concern, habitat types, threat assessments',
            'BirdLife SA',
          ],
        },
        {
          title: 'E-GIS Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Central portal for environmental spatial data including protected areas and land cover.',
          link: 'https://egis.environment.gov.za',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Protected areas, land cover, conservation zones, marine data',
            'Department of Forestry, Fisheries and the Environment (DFFE)',
          ],
        },
        {
          title: 'Biodiversity GIS (BGIS)',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Interactive portal for biodiversity spatial data including vegetation, wetlands, and conservation areas.',
          link: 'https://bgis.sanbi.org',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Vegetation maps, critical biodiversity areas, protected area layers, ecosystem data',
            'South African National Biodiversity Institute',
          ],
        },
        {
          title: 'Plants of Southern Africa (POSA) Database',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Online database of South African flora with occurrence and distribution records.',
          link: 'http://posa.sanbi.org',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Botanical records, herbarium specimen data, species distribution maps',
            'South African National Biodiversity Institute',
          ],
        },
        {
          title: 'SANBI Red List of SA Species',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Database of conservation assessments for SA species with spatial distribution maps.',
          link: 'http://redlist.sanbi.org',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Red List categories, species occurrence, conservation status, distribution maps',
            'South African National Biodiversity Institute',
          ],
        },
        {
          title: 'SARVA',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Platform uniting datasets on environmental risks and vulnerabilities at local scales.',
          link: 'https://sarva.saeon.ac.za',
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Flood, drought, heat stress, socio-economic vulnerability indices',
            'South African Risk & Vulnerability Atlas',
          ],
        },
        {
          title: 'PSV',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Land parcels with erf/stand numbers, SG diagrams',
          link: 'https://csggis.drdlr.gov.za/psv/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Cadastral data, vector data',
            'Chief Surveyor General (part of Department of Rural Development and Land Reform)',
          ],
        },
        {
          title: 'Cape Town Open Data Portal & Map Viewer',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Municipal portal providing downloadable datasets and interactive maps for the city.',
          link: 'https://odp-cctegis.opendata.arcgis.com',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'City boundaries, zoning, infrastructure, service delivery, land use',
            'City of Cape Town',
          ],
        },
        {
          title: 'Ekurhuleni GIS',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Aerial Imagery, Environmental data, Hillshade, Property data, POI, Transportation',
          link: 'https://gis.ekurhuleni.gov.za/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Municipal GIS data, imagery, vector data', 'City of Ekurhuleni'],
        },
        {
          title: 'Interactive Web Map',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Geological maps and polygons, Tectonic contact and fault lines, etc.',
          link: 'https://maps.geoscience.org.za/portal/apps/sites/?fromEdit=true#/interactivewebmap',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Geological data, vector data', 'Council for Geoscience'],
        },
        {
          title: 'CSIR Geospatial Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Datasets for environmental monitoring and urban planning.',
          link: 'https://pta-gis-2-web1.csir.co.za/portal2/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Environmental, Urban Planning',
            'Council for Scientific and Industrial Research (CSIR)',
          ],
        },
        {
          title: 'CSG Cadastral Data Viewer',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Web tool for viewing cadastral parcel boundaries and survey data.',
          link: 'http://csg.drdlr.gov.za',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Cadastral boundaries and survey information',
            'CSG -Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          ],
        },
        {
          title: 'DataFirst Open Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Repository for socio-economic and census data with associated GIS boundary files.',
          link: 'https://www.datafirst.uct.ac.za/dataportal/index.php/catalog',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Census microdata, survey datasets, and geographic boundaries for analysis',
            'DataFirst (UCT)',
          ],
        },
        {
          title: 'Eskom Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            "Provides up-to-date insights into Eskom's operational performance, some spatial data",
          link: 'https://www.eskom.co.za/dataportal/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Operational performance data, some of which may be spatial (e.g., locations of power stations, distribution networks)',
            'Eskom',
          ],
        },
        {
          title: 'South Africa GeoPortal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Landcover, Schools, Rivers, Protected Areas, Dams, Education District Boundaries, Post Office Locations, SASSA Pay Points',
          link: 'https://za.africageoportal.com/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Spatial data specific to South Africa, vector and raster',
            'ESRI South Africa or similar',
          ],
        },
        {
          title: 'GCR Observatory',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Bizcount geocoded business layer, gated communities, provincial land cover, etc.',
          link: 'https://www.gcro.ac.za/outputs/datasets/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Urban planning and development data, vector and raster',
            'Gauteng City-Region Observatory',
          ],
        },
        {
          title: 'Integrated Geospatial Data Platform',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Education districts, health facilities, railway stations, land use change, etc.',
          link: 'https://gisportal.gauteng.gov.za/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Integrated geospatial data for Gauteng, vector and raster', 'Gauteng Province'],
        },
        {
          title: 'MDB Spatial Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Official source for administrative boundaries at provincial, municipal, and ward levels.',
          link: 'https://dataportal-mdb-sa.opendata.arcgis.com',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Administrative boundaries (provinces, municipalities, wards)', 'MDB'],
        },
        {
          title: 'Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'District municipality, Local municipality, Wards',
          link: 'https://dataportal-mdb-sa.opendata.arcgis.com/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Administrative boundaries, vector data', 'Municipal Demarcation Board'],
        },
        {
          title: 'SuperWEB Interactive Data Service',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Web interface to generate custom tables and maps from census/survey data.',
          link: 'https://superweb.statssa.gov.za',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: ['Aggregated census/survey data (with geographic units)', 'Stats SA'],
        },
        {
          title: 'Open Data Portal',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description:
            'Boundaries, Population Dynamics, Employment, Economic growth, Education, Health and Wellness, Human Settlements, Transport',
          link: 'https://wcg-opendataportal-westerncapegov.hub.arcgis.com/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Open data for Western Cape, diverse themes, vector and tabular data',
            'Western Cape Government',
          ],
        },
        {
          title: 'OCIMS',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'No featured datasets specified',
          link: 'https://ocims.environment.gov.za/',
          challenges: [FocusAreasChallenges.ClimateChange],
          extras: [
            'Oceans and coastal data, likely raster and vector',
            'National Oceans and Coastal Information Management System',
          ],
        },
        {
          title: 'CSIR ArcGIS REST Services Directory',
          type: 'Web Portal',
          icon: iconPlatform,
          uploaded: 'March 25, 2025',
          description: 'Climate, socio-economic, agriculture, energy, mining data',
          link: 'https://pta-gis-2-web1.csir.co.za/server2/rest/services',
          challenges: [
            FocusAreasChallenges.LandDegradation,
            FocusAreasChallenges.ClimateChange,
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Drought,
            FocusAreasChallenges.Flood,
            FocusAreasChallenges.Pollution,
          ],
          extras: [
            'Climate, socio-economic, agriculture, energy, mining data',
            'Council for Scientific and Industrial Research (CSIR) ',
          ],
        },
      ],
      capacityBuildingActivities: [
        {
          title: 'Capacity build example A',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example B',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example C',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
        {
          title: 'Capacity build example D',
          description:
            'This placeholder text shows how capacity building can be presented on the country profile page.',
          link: '#',
          logo: BookOpenIcon,
        },
      ],
      partners: [
        {
          name: 'South African National Space Agency (SANSA)',
          description: 'A leading innovation center promoting technology growth in South Africa.',
          logo: southAfricaPartnerSANSA,
          link: 'https://www.sansa.org.za/',
        },
        {
          name: 'Council for Scientific and Industrial Research (CSIR)',
          description: 'World-class African research and development organisation',
          logo: southAfricaPartnerCSIR,
          link: 'https://www.csir.co.za/',
        },
        {
          name: 'AfriGEO',
          description: 'Supporting innovative initiatives across Africa.',
          logo: ghanaPartnerAfriGEO,
          link: 'https://afrigeo.africageoportal.com/',
        },
        {
          name: 'Digital Earth Africa',
          description:
            'Fostering the development of innovative tools and capacity building in Africa.',
          logo: ghanaPartnerDEAfrica,
          link: 'https://www.digitalearthafrica.org/',
        },
      ],
      representatives: [
        {
          name: 'Lulu Makapela',
          role: 'Strategic Programmes contracts manager',
          profile: 'https://earthobservations.org/profile/3891',
          avatar:
            'https://earthobservations.org/storage/app/resources/resize/700_0_0_0_auto/img_927fdc7195756418532d29143da32dd1.webp',
        },
        {
          name: 'Christelle Taylor',
          role: 'Group Assistant',
          profile: '#',
          avatar: placeholderRepresentative,
        },
        {
          name: 'Kwanele Ngongoma',
          role: 'Junior System Administrator',
          profile: '#',
          avatar: placeholderRepresentative,
        },
      ],
    },
    switzerland: {
      ...exampleCountry,
      id: 'switzerland',
      title: 'Switzerland',
      flag: flagSwitzerland,
    },
    usa: {
      ...exampleCountry,
      id: 'usa',
      title: 'United States of America',
      flag: flagUSA,
    },
  },
};

export default data;
