import { groq } from 'next-sanity'

// Query to get all posts with specified fields, ordered by publishedAt descending
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body
  }
`

// Query to get a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body
  }
`

// Query to get posts with author and categories
export const postsWithAuthorAndCategoriesQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body,
    author,
    categories
  }
`



// Query to get all features ordered by display order
export const featuresQuery = groq`
  *[_type == "feature"] | order(order asc) {
    _id,
    title,
    paragraph,
    icon
  }
`

// Query to get all testimonials ordered by display order
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    name,
    designation,
    image,
    content,
    star
  }
`



// Query to get all active services ordered by display order
export const servicesQuery = groq`
  *[_type == "service" && isActive == true] | order(order asc) {
    _id,
    "name": title,
    slug,
    "shortDescription": description,
    fullDescription,
    icon,
    image,
    features,
    url,
    order,
    isActive,
    showInNavbar,
    showInHomepage,
    metaTitle,
    metaDescription
  }
`

// Query to get services for navbar dropdown
export const navbarServicesQuery = groq`
  *[_type == "service" && isActive == true && showInNavbar == true] | order(order asc) {
    _id,
    "name": title,
    slug,
    "shortDescription": description,
    url,
    isActive,
    showInNavbar
  }
`

// Query to get services for homepage
export const homepageServicesQuery = groq`
  *[_type == "service" && isActive == true && showInHomepage == true] | order(order asc) {
    _id,
    "name": title,
    slug,
    "shortDescription": description,
    icon,
    image,
    features,
    url
  }
`

// Query to get a single service by slug
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    "name": title,
    slug,
    "shortDescription": description,
    fullDescription,
    icon,
    image,
    features,
    url,
    metaTitle,
    metaDescription
  }
`

// Query to get the active hero section
export const heroQuery = groq`
  *[_type == "hero" && isActive == true][0] {
    _id,
    title,
    paragraph,
    primaryButton,
    secondaryButton,
    backgroundImage,
    heroImage,
    videoUrl
  }
`

// Query to get the active about section
export const aboutQuery = groq`
  *[_type == "about" && isActive == true][0] {
    _id,
    title,
    subtitle,
    description,
    image,
    features,
    stats
  }
`

// Fallback query to get any about section if none is active
export const aboutFallbackQuery = groq`
  *[_type == "about"][0] {
    _id,
    title,
    subtitle,
    description,
    image,
    features,
    stats
  }
`

// Query to get all about posts for the about page
export const allAboutPostsQuery = groq`
  *[_type == "about"] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    description,
    image,
    features,
    stats,
    isActive,
    _createdAt
  }
`



// Query to get the active contact section
export const contactQuery = groq`
  *[_type == "contact" && isActive == true][0] {
    _id,
    title,
    subtitle,
    description,
    contactInfo,
    socialLinks,
    newsletter
  }
`

// Query to get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    logo,
    logoDark,
    favicon,
    typography,
    contactInfo,
    socialLinks,
    footer,
    legal
  }
`



// Query to get all active projects ordered by order
export const projectsQuery = groq`
  *[_type == "project" && isActive == true] | order(order asc) {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      "name": title,
      slug
    }
  }
`

// Query to get projects by service slug
export const projectsByServiceQuery = groq`
  *[_type == "project" && isActive == true && service->slug.current == $serviceSlug] | order(order asc) {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      "name": title,
      slug
    }
  }
`

// Query to get featured projects
export const featuredProjectsQuery = groq`
  *[_type == "project" && isActive == true && featured == true] | order(order asc) {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    mainImage,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    service->{
      _id,
      "name": title,
      slug
    }
  }
`

// Query to get a single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    fullDescription,
    mainImage,
    gallery,
    client,
    completionDate,
    technologies,
    projectUrl,
    githubUrl,
    featured,
    service->{
      _id,
      "name": title,
      slug,
      "shortDescription": description
    }
  }
`


// ===== DASHBOARD QUERIES =====

// Query to get all services for dashboard with financial data
export const dashboardServicesQuery = groq`
  *[_type == "service" && isActive == true] | order(order asc) {
    _id,
    "name": title,
    slug,
    "shortDescription": description,
    icon,
    order,
    isActive,
    // Campi per dati finanziari (da aggiungere allo schema se necessario)
    "price": coalesce(price, 0),
    "cost": coalesce(cost, 0),
    "hoursSold": coalesce(hoursSold, 0),
    "revenue": coalesce(revenue, 0),
    "margin": coalesce(margin, 0)
  }
`

// Query to get all projects for dashboard with financial data
export const dashboardProjectsQuery = groq`
  *[_type == "project" && isActive == true] | order(order asc) {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    client,
    completionDate,
    technologies,
    featured,
    service->{
      _id,
      "name": title,
      slug
    },
    // Campi per dati finanziari (da aggiungere allo schema se necessario)
    "budget": coalesce(budget, 0),
    "actualCost": coalesce(actualCost, 0),
    "expectedRevenue": coalesce(expectedRevenue, 0),
    "progress": coalesce(progress, 0),
    "status": coalesce(status, "active"),
    "startDate": coalesce(startDate, completionDate),
    "endDate": coalesce(endDate, completionDate)
  }
`

// Query to get projects by service for dashboard
export const dashboardProjectsByServiceQuery = groq`
  *[_type == "project" && isActive == true && service->slug.current == $serviceSlug] | order(order asc) {
    _id,
    "title": name,
    slug,
    "shortDescription": description,
    client,
    completionDate,
    technologies,
    featured,
    service->{
      _id,
      "name": title,
      slug
    },
    "budget": coalesce(budget, 0),
    "actualCost": coalesce(actualCost, 0),
    "expectedRevenue": coalesce(expectedRevenue, 0),
    "progress": coalesce(progress, 0),
    "status": coalesce(status, "active"),
    "startDate": coalesce(startDate, completionDate),
    "endDate": coalesce(endDate, completionDate)
  }
`

// Query to get dashboard statistics
export const dashboardStatsQuery = groq`
  {
    "totalServices": count(*[_type == "service" && isActive == true]),
    "totalProjects": count(*[_type == "project" && isActive == true]),
    "activeProjects": count(*[_type == "project" && isActive == true && status == "active"]),
    "completedProjects": count(*[_type == "project" && isActive == true && status == "completed"]),
    "projects": *[_type == "project" && isActive == true] {
      expectedRevenue,
      actualCost,
      budget
    }
  }
`

// ===== NOVITÀ QUERIES =====

// Query to get all active novità ordered by creation date
export const novitaQuery = groq`
  *[_type == "novita" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    slug,
    mainImage,
    miniIntro,
    isActive,
    _createdAt
  }
`

// Query to get a single novità by slug
export const novitaBySlugQuery = groq`
  *[_type == "novita" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    mainImage,
    miniIntro,
    fullContent,
    isActive,
    _createdAt
  }
`

// Query to get the latest active novità (for pop-up)
export const latestNovitaQuery = groq`
  *[_type == "novita" && isActive == true] | order(_createdAt desc) [0] {
    _id,
    title,
    subtitle,
    slug,
    mainImage,
    miniIntro,
    isActive,
    _createdAt
  }
`


