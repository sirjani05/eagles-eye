import { getPayload } from "payload";
import config from "../payload.config";

if (process.env.NODE_ENV !== "development") {
  throw new Error("The seed script only runs when NODE_ENV=development.");
}

const categories = [
  { name: "Data & Analytics", slug: "data-analytics", description: "Data analysis, engineering, and visualisation." },
  { name: "Design", slug: "design", description: "Product, user experience, and visual design." },
  { name: "Engineering", slug: "engineering", description: "Software and technical engineering skills." },
  { name: "Marketing", slug: "marketing", description: "Digital marketing, growth, and communications." },
];

const providers = [
  {
    name: "Northstar Learning College",
    slug: "northstar-learning-college",
    providerType: "independent-college" as const,
    location: "Manchester, UK",
    description: "Career-focused technical education with small cohorts and practical projects.",
    verified: true,
    foundedYear: 2012,
    learnerCount: 4200,
    completionRate: 91,
  },
  {
    name: "Foundry Skills Academy",
    slug: "foundry-skills-academy",
    providerType: "academy" as const,
    location: "London, UK",
    description: "Industry-led creative and digital skills training for career changers.",
    verified: true,
    foundedYear: 2016,
    learnerCount: 3100,
    completionRate: 88,
  },
  {
    name: "Civic Code Training Centre",
    slug: "civic-code-training-centre",
    providerType: "training-centre" as const,
    location: "Bristol, UK",
    description: "Accessible software and data programmes built around real-world briefs.",
    verified: true,
    foundedYear: 2018,
    learnerCount: 1850,
    completionRate: 86,
  },
  {
    name: "Brightpath Professional College",
    slug: "brightpath-professional-college",
    providerType: "independent-college" as const,
    location: "Edinburgh, UK",
    description: "Flexible professional learning with expert tutors and recognised awards.",
    verified: true,
    foundedYear: 2009,
    learnerCount: 5600,
    completionRate: 93,
  },
];

const programmes = [
  { title: "Data Analysis Foundations", slug: "data-analysis-foundations", provider: 0, category: 0, level: "beginner", tuitionFeeGBP: 299, format: "online", durationWeeks: 6, qualification: "Certificate in Data Analysis", learningMethods: ["Guided labs", "Weekly tutor sessions"] },
  { title: "Applied Business Intelligence", slug: "applied-business-intelligence", provider: 3, category: 0, level: "intermediate", tuitionFeeGBP: 1150, format: "hybrid", durationWeeks: 12, qualification: "Professional Certificate in Business Intelligence", learningMethods: ["Case studies", "Live workshops"] },
  { title: "UX Design Fundamentals", slug: "ux-design-fundamentals", provider: 1, category: 1, level: "beginner", tuitionFeeGBP: 450, format: "in-person", durationWeeks: 8, qualification: "Certificate in UX Design", learningMethods: ["Studio practice", "Portfolio reviews"] },
  { title: "Service Design for Digital Products", slug: "service-design-digital-products", provider: 3, category: 1, level: "advanced", tuitionFeeGBP: 1800, format: "online", durationWeeks: 16, qualification: "Advanced Diploma in Service Design", learningMethods: ["Research sprint", "Mentored project"] },
  { title: "Full-Stack Web Development", slug: "full-stack-web-development", provider: 2, category: 2, level: "intermediate", tuitionFeeGBP: 899, format: "hybrid", durationWeeks: 14, qualification: "Certificate in Full-Stack Development", learningMethods: ["Project work", "Pair programming"] },
  { title: "Python for Automation", slug: "python-for-automation", provider: 0, category: 2, level: "beginner", tuitionFeeGBP: 225, format: "online", durationWeeks: 5, qualification: "Certificate in Python Programming", learningMethods: ["Self-paced exercises", "Tutor clinics"] },
  { title: "Digital Marketing Essentials", slug: "digital-marketing-essentials", provider: 1, category: 3, level: "beginner", tuitionFeeGBP: 199, format: "online", durationWeeks: 4, qualification: "Certificate in Digital Marketing", learningMethods: ["Campaign simulations", "Peer critique"] },
  { title: "Growth Strategy and Analytics", slug: "growth-strategy-analytics", provider: 3, category: 3, level: "advanced", tuitionFeeGBP: 1450, format: "in-person", durationWeeks: 10, qualification: "Professional Diploma in Growth Strategy", learningMethods: ["Live casework", "Executive mentoring"] },
];

function richText(text: string) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: "ltr",
          format: "",
          indent: 0,
          children: [
            { type: "text", version: 1, text, detail: 0, format: 0, mode: "normal", style: "" },
          ],
        },
      ],
    },
  };
}

async function upsertBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "categories" | "providers" | "programmes",
  slug: string,
  data: Record<string, unknown>,
) {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    return payload.update({
      collection,
      id: found.docs[0].id,
      data,
      overrideAccess: true,
    });
  }
  return payload.create({ collection, data, overrideAccess: true });
}

const payload = await getPayload({ config });
try {
  const categoryDocs = [];
  for (const category of categories) {
    categoryDocs.push(
      await upsertBySlug(payload, "categories", category.slug, category),
    );
  }

  const providerDocs = [];
  for (const provider of providers) {
    providerDocs.push(await upsertBySlug(payload, "providers", provider.slug, provider));
  }

  for (const [index, programme] of programmes.entries()) {
    const category = categories[programme.category];
    const provider = providers[programme.provider];
    const fullDescription =
      `${programme.title} combines practical instruction with coached project work. ` +
      `Learners build skills in ${category.name.toLowerCase()} and finish with work they can use in their portfolio.`;
    await upsertBySlug(payload, "programmes", programme.slug, {
      title: programme.title,
      slug: programme.slug,
      summary: fullDescription,
      fullDescription: richText(fullDescription),
      provider: providerDocs[programme.provider].id,
      category: categoryDocs[programme.category].id,
      level: programme.level,
      tuitionFeeGBP: programme.tuitionFeeGBP,
      format: programme.format,
      durationWeeks: programme.durationWeeks,
      qualification: programme.qualification,
      entryRequirements: "No formal qualifications are required. Bring curiosity and a willingness to practise.",
      learningMethods: programme.learningMethods.map((method) => ({ method })),
      featured: index < 4,
      status: "published",
    });
  }

  console.info("Seeded 4 categories, 4 providers, and 8 programmes.");
} finally {
  await payload.destroy();
}
