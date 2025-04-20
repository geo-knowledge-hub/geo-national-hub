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

import southAfricaPartnerARC from '@public/content/partners/south-africa/arc.png';
import southAfricaPartnerSAEON from '@public/content/partners/south-africa/saeon.png';
import southAfricaPartnerCFG from '@public/content/partners/south-africa/cfg.png';
import southAfricaPartnerSSA from '@public/content/partners/south-africa/statsa.png';
import southAfricaPartnerWRC from '@public/content/partners/south-africa/wrc.jpg';
import southAfricaPartnerSTSA from '@public/content/partners/south-africa/stepsa.jpg';
import southAfricaPartnerSANBI from '@public/content/partners/south-africa/sanbi.jpg';
import southAfricaPartnerGB from '@public/content/partners/south-africa/greenbook.svg';

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
  id?: number | string;
  name: string;
  overview: string;
  description: string;
  license: string;
  subjects: string;
  locations: string;
  link: string;
  icon: StaticImageData | string;
  type: string;
  uploaded: string;
  country?: string;
  challenges: GEOFocusAreaChallenge[];
  extras: string[];
  geoGWP?: string;
  geoThemes?: string[];
  contributors?: string[];
  targetAudiences?: string[];
  organization?: string;
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
  capacityBuildingActivities: [],
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
          name: 'Monitoring Chlorophyll-a in Africa Waterbodies Using DEA Data Cube',
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
          overview: '',
          license: '',
          subjects: '',
          contributors: [],
          organization: '',
          locations: '',
        },
        {
          name: 'Detecting Change in Urban Extent Using Digital Earth Africa Data Cube',
          type: 'Knowledge Package',
          uploaded: 'November 29, 2022',
          description:
            'Knowledge Package presenting tools for monitoring urban expansion, sustainability, and infrastructure challenges using EO data.',
          link: 'https://gkhub.earthobservations.org/packages/ka6hq-87x10',
          icon: iconPackage,
          challenges: [FocusAreasChallenges.Pollution],
          extras: [],
          overview: '',
          license: '',
          subjects: '',
          organization: '',
          locations: '',
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
        name: 'SA-GEO Community of Practice',
        description:
          'The South African Group on Earth Observations (SA-GEO) is a forum which aims to mobilise the South African observations communities to advocate the use of Earth observations for societal benefit.',
        logo: flagSouthAfrica,
        link: 'https://neoss.co.za/sa-geo',
      },
      resources: [
        {
          name: 'Water Detection with Sentinel-1 Using Digital Earth Africa Data Cube',
          type: 'Knowledge Package',
          uploaded: 'October 19, 2022',
          description:
            "This knowledge package includes the necessary data, computational resources, and instructions required to reproduce the methodology used in Digital Earth Africa's 'Water Detection with Sentinel-1' Jupyter Notebook.",
          link: 'https://doi.org/10.60566/x119v-vfp64',
          icon: iconPackage,
          challenges: [
            FocusAreasChallenges.LandDegradation,
            FocusAreasChallenges.Drought,
            FocusAreasChallenges.Flood,
          ],
          extras: [],
          overview: '',
          license: '',
          subjects: '',
          organization: '',
          locations: '',
        },
        {
          name: 'Vegetation Change Detection using Digital Earth Africa Data Cube',
          type: 'Knowledge Package',
          uploaded: 'December 13, 2022',
          description:
            "This knowledge package includes the necessary data, computational resources, and instructions required to reproduce the methodology used in Digital Earth Africa's ' Vegetation Change Detection Jupyter Notebook.",
          link: 'https://doi.org/10.60566/9z3th-kac25',
          icon: iconPackage,
          challenges: [FocusAreasChallenges.LandDegradation],
          extras: [],
          overview: '',
          license: '',
          subjects: '',
          organization: '',
          locations: '',
        },
        {
          name: 'WaPOR (Water Productivity through Open access of Remotely sensed derived data)',
          type: 'Knowledge Package',
          uploaded: 'December 13, 2022',
          description:
            'This Knowledge Package presents the WaPOR (Water Productivity through Open access of Remotely sensed derived data), its concepts, resources and methodology.',
          link: 'https://doi.org/10.60566/4dkpz-75t98',
          icon: iconPackage,
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Overfishing],
          extras: [],
          overview: '',
          license: '',
          subjects: '',
          organization: '',
          locations: '',
        },
        {
          name: 'ARC Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Agricultural research data on crop yields, soil properties, and climate impacts for South Africa,',
          overview:
            "The Agricultural Research Council's Agri-Data Web Portal is a comprehensive platform designed to provide access to a variety of agricultural and climate-related data. Users can view maps, access data for specific dates, and place orders for specific datasets. The platform supports agricultural research and decision-making by providing high-quality, up-to-date information on weather and climate conditions. Additionally, the portal offers features such as weather station distribution maps, temperature scales, and data visualization tools to enhance user experience and data interpretation.\nThe types of datasets available on the Agri-Data Web Portal include, Weather Data, Temperature Data, Precipitation Data, Wind Data, Humidity Data, Solar Radiation Data, Soil Moisture Data, Evapotranspiration Data, Climate Data\n\n",
          license: 'CC BY 4.0',
          contributors: ['Agricultural Research Council (ARC)'],
          link: 'https://www.agroclimate.agric.za/WP/WP/',
          subjects: 'Crop yields, soil types, climate',
          geoGWP: 'GEOGLAM',
          targetAudiences: ['Researchers', 'farmers', 'policymakers'],
          geoThemes: ['SDG 2: Zero Hunger / Agriculture'],
          organization: 'Agricultural Research Council (ARC)',
          locations: 'South Africa',
          extras: ['Dataset (in-situ)', 'Agricultural Research Council (ARC)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
        },
        {
          name: 'Greenbook',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Municipal risk profiles for agriculture, forestry, and fisheries, providing environmental risk data for local planning.',
          overview:
            'The GreenBook Risk Profile Tool is a dynamic, interactive online planning support tool developed by the CSIR to help local municipalities in South Africa adapt to climate change. The tool provides scientific evidence on the likely risks each municipality will face under changing climate conditions. It includes risk profiles that showcase information through an interactive dashboard. The platform is designed to support decision-makers in planning and prioritizing adaptation actions to build long-term resilience. Additionally, the tool offers future projections for population growth and the likely impacts of climate change on water resources, the economy, and agriculture.\n\nThe types of datasets available on the GreenBook Risk Profile Tool include, Socio-Economic Vulnerability, Development Trajectories. Climate Change Projections, Hydro-Meteorological Hazards, Water Resources. Economic Impact, Agricultural Impact',
          license: 'Not specified',
          contributors: ['CSIR'],
          link: 'https://riskprofiles.greenbook.co.za/',
          subjects: 'Agriculture, forestry, risk profiles',
          targetAudiences: ['Municipal planners, researchers'],
          geoThemes: ['SDG 15: Life on Land / Agriculture'],
          organization: 'Council for Scientific and Industrial Research (CSIR) - Greenbook',
          locations: 'South Africa',
          extras: [
            'Web portal',
            'Council for Scientific and Industrial Research (CSIR) - Greenbook',
          ],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
        },
        {
          name: 'Chief Directorate: National Geo-spatial Information',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Historical and current aerial imagery and geospatial data for agricultural and land use planning in South Africa.',
          overview:
            'The CDNGI Geospatial Portal is an online platform provided by the Chief Directorate: National Geo-spatial Information (CDNGI) of South Africa. Users can search, view, and download various datasets, which are available in formats such as FileGeodatabase and GeoPackage. The portal supports spatial analysis and mapping through tools like Web Map Services (WMS) and Web Feature Services (WFS). Additionally, the platform provides high-quality, up-to-date geographic information to support research, planning, and decision-making in various fields.\n\nThe types of datasets available on the CDNGI Geospatial Portal include, Topographical Data, Aerial Photography, Geodetic Data, Raster Data, Ancillary Data\n',
          license: 'Not specified',
          contributors: ['DALRRD'],
          link: 'http://www.cdngiportal.co.za/cdngiportal/',
          subjects: 'Aerial photography, geospatial, land use',
          targetAudiences: ['Planners, surveyors, researchers'],
          geoThemes: ['SDG 15: Life on Land / Agriculture'],
          organization: 'Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          locations: 'South Africa',
          extras: [
            'Dataset (remote sensing)',
            'Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          ],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.LandDegradation, FocusAreasChallenges.Drought],
        },
        {
          name: 'eThekwini GIS Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Real-time weather monitoring data for Durban, including rainfall and river levels, aiding disaster preparedness.',
          overview:
            'The eThekwini Datafeeds portal is an online platform provided by the eThekwini Municipality that offers access to various types of real-time and historical data. Users can view and download these datasets, which are made available for non-exclusive, non-commercial use. The platform is designed to support research, planning, and decision-making by providing high-quality, up-to-date information. Additionally, the portal offers features such as camera feeds for monitoring weather conditions and a user-friendly interface for easy navigation and data access.\nThe types of datasets available on the eThekwini Datafeeds portal include, Weather Stations, Rainfall, River Levels, Tides, Wave Conditions',
          license: 'CC BY 4.0 ',
          contributors: ['City of eThekwini'],
          link: 'https://data.ethekwinifews.durban/',
          subjects: 'Weather, rainfall, river levels, tides',
          targetAudiences: ['City officials, disaster managers'],
          geoGWP: 'GEO Disasters',
          geoThemes: ['SDG 11: Sustainable Cities / Climate, Hazard'],
          organization: 'City of eThekwini',
          locations: 'eThekwini (Durban)',
          extras: ['Dataset (in-situ)', 'City of eThekwini'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Climate Information Portal (CIP)',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Observed and projected climate data for Africa, supporting adaptation and research with temperature projections.',
          overview:
            'The Climate Information Portal (CIP) is an online platform developed by the Climate System Analysis Group (CSAG) at the University of Cape Town. It integrates two key information sources into an easy-to-use interface: a comprehensive climate database and extensive guidance documentation. The climate database stores and manages queries to a large suite of observational climate data as well as projections of future climate. The guidance documentation helps users interpret the data and apply it to relevant problems. The portal is designed to support a wide range of users, from those new to climate data to experienced researchers. Additionally, the platform offers tools for visualizing data, performing custom queries, and downloading datasets in various formats.\nThe types of datasets available on the CIP include, Historical Climate Data, Downscaled Climate Projections, Seasonal Forecasts, Hydro-Meteorological Data',
          license: 'CC BY 4.0 ',
          contributors: ['CSAG (UCT)'],
          link: 'https://cip.csag.uct.ac.za',
          subjects: 'Temperature, rainfall, climate models',
          geoGWP: 'GEO Climate Change',
          targetAudiences: ['Researchers', 'policymakers'],
          geoThemes: ['SDG 13: Climate Action / Climate, Hazard'],
          organization: 'CSAG (UCT)',
          locations: 'Africa, South Africa',
          extras: ['Web portal', 'CSAG (UCT)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'South African Air Quality Information System (SAAQIS)',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Live and historical air quality data from SA monitoring networks for environmental health and policy.',
          overview:
            'The South African Air Quality Information System (SAAQIS) is an online platform developed by the Department of Environmental Affairs in collaboration with the South African Weather Service. It provides centralized access to air quality information across South Africa.  Users can view data from different monitoring stations, access air quality forecasts, and download datasets for analysis. Additionally, the platform offers tools for visualizing data, performing custom queries, and generating reports to support research, policy-making, and public awareness.\n\nThe types of datasets available on SAAQIS include, Air Quality Data, Air Quality Indices, Emissions Data, Meteorological Data',
          license: 'CC BY 4.0 ',
          contributors: ['DWS', 'SAWS'],
          link: 'https://saaqis.environment.gov.za',
          subjects: 'Air quality, pollutants, AQI',
          geoGWP: 'GEO Health',
          targetAudiences: ['Public', 'health officials', 'researchers'],
          geoThemes: ['SDG 3: Good Health / Climate, Hazard'],
          organization:
            'Department of Water and Sanitation (DWS)/South African Weather Service (SAWS)',
          locations: 'South Africa',
          extras: [
            'Dataset (in-situ)',
            'Department of Water and Sanitation (DWS)/South African Weather Service (SAWS)',
          ],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'AFIS',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Satellite-based tool providing near real-time global fire information for disaster management.',
          overview:
            'The Advanced Fire Information System (AFIS) is a satellite-based fire information tool that provides near real-time fire information to users across the globe. Developed by the CSIR, AFIS offers various features to help manage and monitor wildfire incidents. Users can receive notifications whenever an active fire is detected within their designated areas, enhancing situational awareness and safety. Additionally, AFIS integrates data from multiple satellite sources to deliver near-instantaneous updates on fire incidents, ensuring users are always informed of potential threats.\n\nThe types of datasets available on AFIS include, AFIS Map Viewer, AFIS Alert System, Windy Viewer, AFIS API ',
          license: 'Not specified',
          link: 'https://www.afis.co.za/',
          subjects: 'Fire data, satellite, real-time',
          geoGWP: 'GEO Disasters ',
          targetAudiences: ['Disaster managers, researchers'],
          geoThemes: ['SDG 15: Life on Land / Climate, Hazard'],
          organization: 'Fire Monitoring System',
          locations: 'Global, South Africa',
          extras: ['Dataset (remote sensing)', 'Fire Monitoring System'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'SAEON Open Data Platform (ODP)',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Metadata and data portal for long-term environmental observations across SA ecosystems.',
          overview:
            'The South African Environmental Observation Network (SAEON) Open Data Platform (ODP) is a metadata repository that facilitates the publication, discovery, dissemination, and preservation of earth observation and environmental data in South Africa. The platform is part of SAEON, a long-term environmental observation and research facility of the National Research Foundation (NRF). It provides access to a wide range of datasets related to environmental monitoring and research, supporting scientific studies and policy-making.\n\nThe types of datasets available on the SAEON Data Portal include, Climate Data, Biodiversity Data, Hydrological Data, Atmospheric Data, Soil Data, Oceanographic Data\n',
          license: 'CC BY 4.0 ',
          contributors: ['SAEON'],
          link: 'https://catalogue.saeon.ac.za',
          subjects: 'Climate, ecological, meteorological',
          geoGWP: 'GEO BON',
          targetAudiences: ['Researchers', 'environmentalists'],
          geoThemes: ['SDG 15: Life on Land / Climate, Hazard'],
          organization: 'South African Environmental Observation Network (SAEON)',
          locations: 'South Africa',
          extras: ['Web portal', 'South African Environmental Observation Network (SAEON)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'IBA Database',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Directory and maps of key bird and biodiversity areas in SA for conservation planning.',
          overview:
            "The BirdLife DataZone page for South Africa provides comprehensive information on the country's bird species and their conservation status. It highlights key statistics and data, including the total number of bird species, endemic species, and globally threatened species. Additionally, it outlines ongoing threats to bird species and the conservation actions needed to protect them. The DataZone serves as a vital resource for researchers, conservationists, and policymakers, offering insights into the state of bird populations and the effectiveness of conservation efforts.\nThe BirdLife DataZone offers a variety of datasets, including, Species Data, Endemic Species Data, Threatened Species Data, IBA DataHabitat Data",
          license: 'Not specified',
          contributors: ['BirdLife SA'],
          link: 'https://datazone.birdlife.org/country/factsheet/south-africa',
          subjects: 'Bird areas, species, habitats',
          geoGWP: 'GEO BON',
          targetAudiences: ['Conservationists', 'researchers'],
          geoThemes: ['SDG 15: Life on Land / Ecosystems, Biodiversity'],
          organization: 'BirdLife SA',
          locations: 'South Africa',
          extras: ['Dataset (in-situ)', 'BirdLife SA'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'E-GIS Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Central hub for environmental spatial data like protected areas and land cover in SA.',
          overview:
            "The Environmental Geographic Information Systems (E-GIS) portal, managed by South Africa's Department of Forestry, Fisheries, and the Environment (DFFE), provides access to a wide range of environmental geospatial data and tools. It supports decision-making processes related to environmental management and conservation. The portal is designed to facilitate data sharing and collaboration among researchers, policymakers, and the public, enhancing the understanding and management of South Africa's diverse environmental resources.\n\nKey Features: Baseline Environmental Data, Interactive Mapping Tools, Printable Maps, Map Services\n\nThe E-GIS portal offers a variety of datasets, including, Protected and Conservation Areas Data, Marine Protected Area Zonations, Renewable Energy EIA Application Data, National Land Cover Data",
          license: 'CC BY 4.0 ',
          contributors: ['DFFE'],
          link: 'https://egis.environment.gov.za',
          subjects: 'Protected areas, land cover, marine',
          geoGWP: 'GEO BON',
          targetAudiences: ['Environmentalists', 'planners'],
          geoThemes: ['SDG 15: Life on Land / Ecosystems, Biodiversity'],
          organization: 'Department of Forestry, Fisheries and the Environment (DFFE)',
          locations: 'South Africa',
          extras: ['Web portal', 'Department of Forestry, Fisheries and the Environment (DFFE)'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'Biodiversity GIS (BGIS)',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Interactive portal with biodiversity data like vegetation and conservation areas in SA.',
          overview:
            "The Biodiversity Geographic Information System (BGIS), managed by the South African National Biodiversity Institute (SANBI), is a central hub for biodiversity planning and information dissemination in South Africa. It provides access to a wide range of geospatial data and tools to support biodiversity conservation and management efforts. The BGIS platform is designed to facilitate data sharing and collaboration among researchers, conservationists, and policymakers, enhancing the understanding and management of South Africa's rich biodiversity. It also offers training and resources to help users effectively utilize the platform.\n\nKey Features:\nInteractive Mapping, Biodiversity Data, Training and Resources:, Legislation and Policies. The BGIS portal offers a variety of datasets, including, National Biodiversity Assessment (NBA) Data, Vegetation Maps, Conservation Plans, Strategic Water Source Areas (SWSA)",
          license: 'CC BY 4.0 ',
          contributors: ['SANBI'],
          link: 'https://bgis.sanbi.org',
          subjects: 'Vegetation, wetlands, conservation',
          geoGWP: 'GEO BON',
          targetAudiences: ['Conservationists', 'planners', 'researchers'],
          geoThemes: ['SDG 15: Life on Land / Ecosystems, Biodiversity'],
          organization: 'South African National Biodiversity Institute',
          locations: 'South Africa',
          extras: ['Web portal', 'South African National Biodiversity Institute'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'Plants of Southern Africa (POSA) Database',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Online database of SA flora with occurrence and distribution records for research.',
          overview:
            "The Plants of Southern Africa (POSA) website, managed by the South African National Biodiversity Institute (SANBI), provides access to comprehensive information on South African plant names, specimens, and botanical records. It is a valuable resource for researchers, conservationists, and the public interested in the region's flora. The website is part of the Botanical Database of Southern Africa (BODATSA), which integrates specimen-based data collected over more than 200 years from various herbaria, including the National Herbarium in Pretoria, the Compton Herbarium in Cape Town, and the KwaZulu-Natal Herbarium in Durban.\n\nKey Features: Plant Names Database, Herbarium Specimens, Botanical Records, Data Management, datasets, including:\nTaxonomic Data, Specimen Data, Field Observations",
          license: 'CC BY 4.0 ',
          contributors: ['SANBI'],
          link: 'http://posa.sanbi.org',
          subjects: 'Flora, distribution, herbarium',
          geoGWP: 'GEO BON',
          targetAudiences: ['Botanists', 'researchers'],
          geoThemes: ['SDG 15: Life on Land / Ecosystems, Biodiversity'],
          organization: 'South African National Biodiversity Institute',
          locations: 'Southern Africa, South Africa',
          extras: ['Dataset (in-situ)', 'South African National Biodiversity Institute'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'SANBI Red List of SA Species',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Conservation assessments and spatial data for SA species to support biodiversity protection.',
          overview:
            "The SANBI Red List of South African Plants website, managed by the South African National Biodiversity Institute (SANBI), provides up-to-date information on the national conservation status of South Africa's indigenous plants. It is part of the Threatened Species Programme, which aims to assess and monitor the status of the country's flora.\n\nKey Features: Searchable Red List, Red List Statistics, Assessment Methodology, Conservation Concerns, Datasets, including, Species Assessments, Threatened Species Data, Habitat Data",
          license: 'CC BY 4.0 ',
          contributors: ['SANBI'],
          link: 'http://redlist.sanbi.org',
          subjects: 'Red List, species, conservation',
          geoGWP: 'GEO BON',
          targetAudiences: ['Conservationists', 'researchers'],
          geoThemes: ['SDG 15: Life on Land / Ecosystems, Biodiversity'],
          organization: 'South African National Biodiversity Institute',
          locations: 'South Africa',
          extras: ['Dataset (in-situ)', 'South African National Biodiversity Institute'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'SARVA',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Aggregates datasets on environmental risks and vulnerabilities for local decision-making.',
          overview:
            'The South African Risk and Vulnerability Atlas (SARVA) is an initiative by the Department of Science and Innovation. SARVA is an open science portal that provides access to a wide range of decision-ready data. The primary goal of SARVA is to disseminate spatial and non-spatial data that describe, assess, and evaluate the risks and vulnerabilities facing South Africa. It combines multi-disciplinary datasets from various organizations into a single access point, making it easier for municipalities, government departments, and sectors to respond to global change risks. \n\nTypes of Data Available on SARVA\nTraditional Spatial Data, Multidimensional Data, Observational and Biodiversity Data, Themed Atlases, Climate Risk Data, Sustainable Development Goal (SDG) Indicators, Historical Climate Data\n',
          license: 'CC BY 4.0 ',
          contributors: ['SAEON'],
          link: 'https://sarva.saeon.ac.za',
          subjects: 'Flood, drought, vulnerability',
          geoGWP: 'Not specified',
          targetAudiences: ['Planners', 'researchers'],
          geoThemes: ['SDG 13: Climate Action / Ecosystems, Biodiversity'],
          organization: 'South African Risk & Vulnerability Atlas',
          locations: 'South Africa',
          extras: ['Web portal', 'South African Risk & Vulnerability Atlas'],
          icon: iconPlatform,
          challenges: [
            FocusAreasChallenges.LossBiodiversity,
            FocusAreasChallenges.IllegalMining,
            FocusAreasChallenges.Deforestation,
            FocusAreasChallenges.Overfishing,
            FocusAreasChallenges.Pollution,
          ],
        },
        {
          name: 'PSV',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Land parcel data and survey diagrams for cadastral and urban planning in South Africa.',
          overview:
            "The Chief Surveyor General's GIS Portal provides access to spatial data and information about land parcels, administrative boundaries, and surveyed rights in South Africa. This portal is part of the Department of Rural Development and Land Reform's efforts to make geospatial information readily available to the public and professionals. It aims to promote an equitable and sustainable land dispensation that fosters socio-economic development.\n\nTypes of Land Parcel Data Available: Spatial Data, Surveyed Real Rights, Document Images, Alphanumeric Data, Approval Data",
          license: 'Not specified',
          contributors: ['Chief Surveyor General (DALRRD)'],
          link: 'https://csggis.drdlr.gov.za/psv/',
          subjects: 'Cadastral, land parcels, SG diagrams',
          targetAudiences: ['Surveyors', 'planners'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization:
            'Chief Surveyor General (part of Department of Rural Development and Land Reform)',
          locations: 'South Africa',
          extras: [
            'Dataset (in-situ)',
            'Chief Surveyor General (part of Department of Rural Development and Land Reform)',
          ],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Cape Town Open Data Portal & Map Viewer',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Municipal portal with datasets and maps for urban planning and service delivery in Cape Town.',
          overview:
            'The City of Cape Town Open Data Portal provides access to a wide range of datasets that have been approved for public use under the Open Data Policy. This portal aims to increase transparency and benefit the wider community and other stakeholders by making city information readily available. \nKey Features of the Portal:\nData Categories: The portal includes datasets across various categories such as Basic Services and Infrastructure, Community Services, Demography and Statistics, Economic Development, Finance, Health, Human Settlements, Imagery, Land Administration, Natural Resources & the Environment, Political and Administrative Boundaries, Safety and Security, Social Development, Spatial Planning, and Transportation',
          license: 'CC BY 4.0 ',
          contributors: ['City of Cape Town'],
          link: 'https://odp-cctegis.opendata.arcgis.com',
          subjects: 'Zoning, infrastructure, land use',
          targetAudiences: ['Planners', 'public', 'developers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'City of Cape Town',
          locations: 'Cape Town',
          extras: ['Web portal', 'City of Cape Town'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Ekurhuleni GIS',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'GIS portal with aerial imagery and property data for urban management in Ekurhuleni.',
          overview:
            "The City of Ekurhuleni Geographic Information Website provides interactive access to maps and spatial data for the citizens of Ekurhuleni, as well as public and private sector users. This portal supports the municipality's mission to manage geo-information and related resources effectively, ensuring timely provision of accurate, complete, and consistent spatially referenced data to all stakeholders. The portal aims to be a smart, creative, and innovative centralized GIS to better support the municipality\n\nKey Features: Map Viewer, Imagery, Transportation Data, Property Data, Administrative Boundaries, Points of Interest, Environmental Data, Geographical Areas\n",
          license: 'CC BY 4.0 ',
          contributors: ['City of Ekurhuleni'],
          link: 'https://gis.ekurhuleni.gov.za/',
          subjects: 'Aerial, property, transportation',
          targetAudiences: ['Planners', 'public'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'City of Ekurhuleni',
          locations: 'Ekurhuleni',
          extras: ['Web portal', 'City of Ekurhuleni'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'eThekwini GIS Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Interactive maps of Durban\u2019s spatial data for urban planning and service management.',
          overview:
            'The eThekwini Datafeeds portal is an online platform provided by the eThekwini Municipality that offers access to various types of real-time and historical data. Users can view and download these datasets, which are made available for non-exclusive, non-commercial use. The platform is designed to support research, planning, and decision-making by providing high-quality, up-to-date information. Additionally, the portal offers features such as camera feeds for monitoring weather conditions and a user-friendly interface for easy navigation and data access.\nThe types of datasets available on the eThekwini Datafeeds portal include, Weather Stations, Rainfall, River Levels, Tides, Wave Conditions',
          license: 'CC BY 4.0 ',
          contributors: ['City of eThekwini'],
          link: 'https://data.ethekwinifews.durban/',
          subjects: 'Zoning, property, transport',
          targetAudiences: ['Planners', 'public'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'City of eThekwini',
          locations: 'eThekwini (Durban)',
          extras: ['Web portal', 'City of eThekwini'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Interactive Web Map',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Geological maps and data for energy and urban planning, including tectonic features.',
          overview:
            "The Council for Geoscience Interactive Web Map provides access to a wide range of geological data and maps. This portal is designed to support the discovery, analysis, and download of geospatial data related to geoscience. It aims to enhance decision-making processes and improve service delivery by providing accurate and up-to-date geoscientific information. The portal is part of the Council for Geoscience's mission to be the national custodian of all geoscientific information and its dissemination to stakeholders and clients.\n\nKey Features:\nData Downloads, API Links, Analysis Tools, Interactive Map Viewer.\nTypes of Geological Data Available, Minerals, Coal and Core Boreholes, Geochemistry, Geological Resources, Geophysics, Geohazards",
          license: 'Not specified',
          contributors: ['Council for Geoscience'],
          link: 'https://maps.geoscience.org.za/portal/apps/sites/?fromEdit=true#/interactivewebmap',
          subjects: 'Geology, tectonics, faults',
          targetAudiences: ['Geologists', 'planners'],
          geoThemes: ['SDG 7: Affordable Energy / Energy, Urbanisation'],
          organization: 'Council for Geoscience',
          locations: 'South Africa',
          extras: ['Web portal', 'Council for Geoscience'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'CSIR Geospatial Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Datasets for environmental monitoring and urban planning from CSIR\u2019s geospatial research.',
          overview:
            "The CSIR ArcGIS Web Application provides access to various geographic information and mapping services. This portal is designed to support the exploration and analysis of spatial data, facilitating efficient decision-making and planning. It aims to enhance research, development, and innovation by providing accurate and up-to-date geospatial information. The portal is part of the Council for Scientific and Industrial Research's (CSIR) mission to improve the quality of life in South Africa through multidisciplinary research and technological innovation.\n\nKey Features: Interactive Map Viewer, Data Analysis Tools, Customizable Dashboards\nTypes of GIS Layers Available: Feature Layers, Imagery Layers, Elevation Layers, Thematic Layers, Basemap Layers",
          license: 'Not specified',
          contributors: ['CSIR'],
          link: 'https://pta-gis-2-web1.csir.co.za/portal2/',
          subjects: 'Environmental, urban, geospatial',
          targetAudiences: ['Researchers', 'planners'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'Council for Scientific and Industrial Research (CSIR)',
          locations: 'South Africa',
          extras: ['Web portal', 'Council for Scientific and Industrial Research (CSIR)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'CSG Cadastral Data Viewer',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Web tool for viewing cadastral boundaries and survey data for urban management.',
          overview:
            "The Chief Surveyor General website provides access to a national cadastral survey management system in South Africa. This portal supports the Department of Rural Development and Land Reform's mission to provide an equitable and sustainable land dispensation that promotes socio-economic development. The website aims to be a recognized world leader in the provision of cadastral survey management. It offers a comprehensive suite of tools and resources.\nKey Features: Spatial Data, Surveyed Real Rights, Document Images, Alphanumeric Data, Approval Data",
          license: 'Not specified',
          contributors: ['DALRRD'],
          link: 'http://csg.drdlr.gov.za',
          subjects: 'Cadastral, boundaries, survey',
          targetAudiences: ['Surveyors', 'planners'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization:
            'CSG - Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          locations: 'South Africa',
          extras: [
            'Web portal',
            'CSG - Department of Agriculture, Land Reform and Rural Development (DALRRD)',
          ],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'DataFirst Open Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Socio-economic and census data with GIS boundaries for urban and energy analysis.',
          overview:
            'The DataFirst Data Portal, hosted by the University of Cape Town, provides access to a wide range of datasets for research purposes. This portal supports academic and policy research by offering high-quality data and metadata. It aims to enhance the capacity for evidence-based decision-making in Africa. Researchers can easily search and filter datasets, view metadata, and access data files. The portal also includes datasets from various surveys conducted by Research ICT Africa, covering topics like ICT access and mobile pricing across different years.\n\nTypes of Datasets Available: Household Surveys, Labor Market Surveys, Health Surveys, Education Surveys, ICT Surveys, Census Data, Economic Surveys',
          license: 'CC BY 4.0 ',
          contributors: ['DataFirst (UCT)'],
          link: 'https://www.datafirst.uct.ac.za/dataportal/index.php/catalog',
          subjects: 'Census, socio-economic, boundaries',
          targetAudiences: ['Researchers', 'policymakers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'DataFirst (UCT)',
          locations: 'South Africa',
          extras: ['Web portal', 'DataFirst (UCT)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Eskom Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Operational performance data, including spatial energy infrastructure insights.',
          overview:
            "The Eskom Data Portal provides up-to-date insights into the operational performance of South Africa's national electricity grid. This portal supports Eskom's mission to ensure the stability of the national electricity grid by balancing the supply and demand for electricity. The portal also includes a data request form for users to obtain specific datasets.\n\nKey Features: Generation Performance, Demand History and Forecasts, OCGT Usage, Renewable Energy Contributions, Outage Performance, Load Shedding",
          license: 'Not specified',
          contributors: ['Eskom'],
          link: 'https://www.eskom.co.za/dataportal/',
          subjects: 'Energy, power stations, networks',
          targetAudiences: ['Energy planners', 'researchers'],
          geoThemes: ['SDG 7: Affordable Energy / Energy, Urbanisation'],
          organization: 'Eskom',
          locations: 'South Africa',
          extras: ['Dataset (in-situ, spatial)', 'Eskom'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'South Africa GeoPortal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Spatial data portal with land cover, schools, and dams for urban planning in SA.',
          overview:
            'The South Africa GeoPortal, powered by Esri, provides a comprehensive platform for accessing and utilizing geospatial data and tools. It aims to inspire communities through location intelligence, enhancing the ability to analyze spatial patterns and make informed decisions. Users can create maps, analyze spatial data, and share geospatial information using advanced tools that are free to use and regularly updated.\n\nTypes of Geospatial Data Available: Environmental Data, Demographic Data, Infrastructure Data, Land Use Data, Health Data, Educational Data, Economic Data',
          license: 'CC BY 4.0 ',
          contributors: ['ESRI South Africa'],
          link: 'https://za.africageoportal.com/',
          subjects: 'Land cover, schools, dams',
          targetAudiences: ['Planners', 'public'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'ESRI South Africa or similar',
          locations: 'South Africa',
          extras: ['Web portal', 'ESRI South Africa or similar'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'GCR Observatory',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Geocoded business and land cover data for urban planning in Gauteng City-Region.',
          overview:
            'The Gauteng City-Region Observatory (GCRO) Data Portal provides access to a variety of datasets focused on the Gauteng City-Region. This portal supports academic, teaching, and research purposes, providing valuable resources for policymakers and the public. The portal aims to enhance understanding and decision-making within the region by offering comprehensive and reliable data.\n\nTypes of Quality of Life Metrics Included, Demographics, Households, Access to Services, Economy, Safety, Political Attitudes, Social Attitudes, Community Attitudes, Health, Transport, Quality of Life Index',
          license: 'CC BY 4.0 ',
          contributors: ['Gauteng City-Region Observatory'],
          link: 'https://www.gcro.ac.za/outputs/datasets/',
          subjects: 'Business, land cover, urban',
          targetAudiences: ['Planners', 'researchers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'Gauteng City-Region Observatory',
          locations: 'Gauteng',
          extras: ['Web portal', 'Gauteng City-Region Observatory'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Integrated Geospatial Data Platform',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Geospatial data on education, health, and land use for Gauteng\u2019s urban management.',
          overview:
            'The Gauteng GIS Portal, managed by the Gauteng Provincial Government, is an interactive tool designed to assist both local and provincial governments in understanding the Gauteng City-Region (GCR) and making informed decisions about its development. This portal supports urban planning, infrastructure development, and environmental management by providing access to a wide range of geospatial data and maps. It aims to enhance decision-making processes and promote sustainable development within the region.\n\nTypes of Geospatial Data Available: Environmental Data, Demographic Data, Infrastructure Data, Land Use Data, Health Data, Educational Data, Economic Data',
          license: 'CC BY 4.0 ',
          contributors: ['Gauteng Province'],
          link: 'https://gisportal.gauteng.gov.za/',
          subjects: 'Education, health, land use',
          targetAudiences: ['Planners', 'policymakers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'Gauteng Province',
          locations: 'Gauteng',
          extras: ['Web portal', 'Gauteng Province'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'MDB Spatial Data Portal',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Official administrative boundaries for provinces, municipalities, and wards in SA.',
          overview:
            'The Municipal Demarcation Board (MDB) Data Portal provides public access to spatial (GIS-related) data produced by the MDB for municipalities and wards in South Africa. This portal supports local and provincial governments in understanding and managing municipal boundaries, facilitating effective governance and planning. Users can explore, analyze, and download data in various formats, and access API links for advanced data integration and analysis. The portal aims to enhance transparency and accessibility of boundary data, promoting informed decision-making and public engagement.\n\nTypes of Boundary Data Available: Local Municipal Boundaries, District Municipal Boundaries, Ward Boundaries',
          license: 'CC BY 4.0 ',
          contributors: ['Municipal Demarcation Board'],
          link: 'https://dataportal-mdb-sa.opendata.arcgis.com',
          subjects: 'Administrative, municipalities, wards',
          targetAudiences: ['Planners', 'researchers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'MDB',
          locations: 'South Africa',
          extras: ['Dataset (in-situ)', 'MDB'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'Wazimap South Africa',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description: 'Aggregates census and election data by geography for urban insights in SA.',
          overview:
            'Wazimap is a comprehensive platform that provides easy access to South African census and election data. This portal, developed by Media Monitoring Africa and OpenUp, aims to make complex data more understandable and accessible to the public. It supports local governments, civil society organizations, and corporate social responsibility programs by offering detailed insights into various aspects of local demographics and political data. Wazimap also integrates multiple datasets to provide context and facilitate informed decision-making.\n\nTypes of Data Available: Demographic Data, Service Delivery Data, Economic Data, Education Data, Election Data\n',
          license: 'CC BY 4.0 ',
          contributors: ['OpenUp (NPO)'],
          link: 'https://wazimap.co.za',
          subjects: 'Population, education, employment',
          targetAudiences: ['Public', 'policymakers'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'OpenUp (NPO)',
          locations: 'South Africa',
          extras: ['Web portal', 'OpenUp (NPO)'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'SuperWEB Interactive Data Service',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Web tool for custom tables and maps from census/survey data for urban analysis.',
          overview:
            'The SuperWEB2 portal, managed by Statistics South Africa (Stats SA), provides a powerful platform for accessing and analyzing a wide range of statistical data. This portal supports academic, policy, and public research by offering high-quality data and metadata. It aims to enhance the capacity for evidence-based decision-making in South Africa. Users can create customized reports and tables based on their specific data needs, making it a versatile tool for various research purposes. The portal also includes tools for visualizing data through charts, graphs, and maps.\n\nTypes of Datasets Available: Demographic Data, Economic Data, Health Data, Education Data, Labor Market Data, Service Delivery Data',
          license: 'CC BY 4.0 ',
          contributors: ['Statistics South Africa'],
          link: 'https://superweb.statssa.gov.za',
          subjects: 'Census, statistics, geographic',
          targetAudiences: ['Researchers', 'planners'],
          geoThemes: ['SDG 11: Sustainable Cities / Energy, Urbanisation'],
          organization: 'Stats SA',
          locations: 'South Africa',
          extras: ['Web portal', 'Stats SA'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'OCIMS',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'Portal for oceans and coastal data, supporting marine research and management in SA.',
          overview:
            "The Western Cape Government's Open Data Portal is a comprehensive platform that allows users to discover, analyze, and download various datasets related to the Western Cape region. The portal provides data in multiple formats such as CSV, KML, Zip, GeoJSON, GeoTIFF, and PNG. Users can also access API links for GeoServices, WMS, and WFS. Additionally, the portal offers tools for creating StoryMaps and Web Maps, and for analyzing data with charts and thematic maps. The platform is designed to promote transparency, support research, and facilitate data-driven decision-making by providing easy access to high-quality, up-to-date information.\n\nThe portal offers a wide range of datasets across various categories, including, Basic Services and Infrastructure, Community Services, Demography and Statistics, Economic Development, Finance, Health, Human Settlements, Imagery, Land Administration, Natural Resources & the Environment, Political and Administrative Boundaries, Safety and Security, Social Development, Spatial Planning",
          license: 'CC BY 4.0 ',
          contributors: ['DFFE'],
          link: 'https://ocims.environment.gov.za/',
          subjects: 'Oceans, coastal, marine',
          geoGWP: 'GEO Blue Planet',
          targetAudiences: ['Marine researchers, policymakers'],
          geoThemes: ['SDG 14: Life Below Water / Oceans, Coasts'],
          organization: 'National Oceans and Coastal Information Management System',
          locations: 'South African coasts',
          extras: ['Web portal', 'National Oceans and Coastal Information Management System'],
          icon: iconPlatform,
          challenges: [FocusAreasChallenges.ClimateChange],
        },
        {
          name: 'CSIR ArcGIS REST Services Directory',
          type: 'Web Portal',
          uploaded: 'April 09, 2025',
          description:
            'REST services with climate, socio-economic, and energy data for infrastructure planning.',
          overview:
            "The CSIR's ArcGIS REST Services Directory is a comprehensive platform that provides access to a variety of geographic information system (GIS) services and datasets. Users can view and interact with these datasets through different ArcGIS platforms like ArcGIS Online, ArcGIS Earth, ArcMap, and ArcGIS Pro. The platform supports various operations such as exporting maps, identifying features, querying data, and generating dynamic legends. It is designed to facilitate spatial analysis, decision-making, and research by providing high-quality, up-to-date geographic information.\n\nThe types of datasets available include, Agriculture, Climate, Demographics, Economy, Education, Energy, Environment, Health, Infrastructure, Land Use, Transportation",
          license: 'Not specified',
          contributors: ['CSIR'],
          link: 'https://pta-gis-2-web1.csir.co.za/server2/rest/services',
          subjects: 'Climate, energy, socio-economic',
          targetAudiences: ['Developers, researchers'],
          geoThemes: ['SDG 9: Infrastructure / Open Data, Infrastructure'],
          organization: 'Council for Scientific and Industrial Research (CSIR)',
          locations: 'South Africa',
          extras: ['Web portal', 'Council for Scientific and Industrial Research (CSIR)'],
          icon: iconPlatform,
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
          name: 'Agricultural Research Council',
          description: '',
          logo: southAfricaPartnerARC,
          link: 'https://www.arc.agric.za/Pages/Home.aspx',
        },
        {
          name: 'SAEON',
          description: '',
          logo: southAfricaPartnerSAEON,
          link: 'https://www.saeon.ac.za/',
        },
        {
          name: 'Council for Geoscience',
          description: '',
          logo: southAfricaPartnerCFG,
          link: 'https://www.geoscience.org.za/',
        },
        {
          name: 'Stats SA',
          description: '',
          logo: southAfricaPartnerSSA,
          link: 'https://www.statssa.gov.za/',
        },
        {
          name: 'Water Research Commission',
          description: '',
          logo: southAfricaPartnerWRC,
          link: 'https://www.wrc.org.za/',
        },
        {
          name: 'stepSA',
          description: '',
          logo: southAfricaPartnerSTSA,
          link: 'http://www.stepsa.co.za/',
        },
        {
          name: 'Sanbi',
          description: '',
          logo: southAfricaPartnerSANBI,
          link: 'https://www.sanbi.org/biodiversity/',
        },
        {
          name: 'Greenbook',
          description: '',
          logo: southAfricaPartnerGB,
          link: 'https://greenbook.co.za/',
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
          profile: '#',
          avatar: 'https://earthobservations.org/storage/profile-photos/653bedbda5c58977907361.jpg',
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
