import fs from 'fs';
import path from 'path';

const DE_ROOT = 'C:\\Users\\MSI-1\\Desktop\\DE';
const OUT_DIR = path.resolve('src/data');

const MODULE_META = {
  '01-fundamentals': { num: '01', title: 'Foundations', icon: '📐', color: '#38bdf8', sim: 'pipeline' },
  '02-sql': { num: '02', title: 'SQL', icon: '🔎', color: '#22c55e', sim: 'sql' },
  '03-python': { num: '03', title: 'Python for DE', icon: '🐍', color: '#eab308', sim: 'python' },
  '04-etl-elt': { num: '04', title: 'ETL & ELT', icon: '🔄', color: '#f97316', sim: 'etl' },
  '05-databases': { num: '05', title: 'Databases', icon: '🗄️', color: '#3b82f6', sim: 'database' },
  '06-big-data': { num: '06', title: 'Big Data & Spark', icon: '⚡', color: '#f59e0b', sim: 'spark' },
  '07-cloud-platforms': { num: '07', title: 'Cloud Platforms', icon: '☁️', color: '#06b6d4', sim: 'cloud' },
  '08-orchestration': { num: '08', title: 'Orchestration', icon: '🎼', color: '#8b5cf6', sim: 'orchestration' },
  '09-visualization': { num: '09', title: 'Visualization & BI', icon: '📊', color: '#ec4899', sim: 'viz' },
  '10-devops': { num: '10', title: 'DevOps for DE', icon: '🔧', color: '#64748b', sim: 'devops' },
  '11-system-design': { num: '11', title: 'System Design', icon: '🏆', color: '#f43f5e', sim: 'system-design' },
  '12-interview-prep': { num: '12', title: 'Interview Prep', icon: '🎤', color: '#14b8a6', sim: 'interview' },
  '13-projects': { num: '13', title: 'End-to-End Projects', icon: '🏗️', color: '#6366f1', sim: 'pipeline' },
  '14-internal-tools': { num: '14', title: 'Internal Tools', icon: '🧰', color: '#84cc16', sim: 'devops' },
  '15-governance-quality-mlops': { num: '15', title: 'Governance & MLOps', icon: '🛡️', color: '#a855f7', sim: 'governance' },
  '16-ai-mcp-llm-pipelines': { num: '16', title: 'AI, MCP & Agents', icon: '🤖', color: '#10b981', sim: 'ai-rag' },
};

function stripFooter(md) {
  return md
    .replace(/\r\n/g, '\n')
    .replace(/\n---\s*\n\s*<div align="center">[\s\S]*$/i, '')
    .trim();
}

function classifyStepTag(heading) {
  const h = heading.toLowerCase();
  if (h.includes('trap') || h.includes('mistake') || h.includes('red flag')) {
    return { tag: 'INTERVIEW TRAP', tagType: 'red' };
  }
  if (h.includes('why') || h.includes('problem') || h.includes('fail') || h.includes('break') || h.includes('challenge')) {
    return { tag: 'PROBLEM', tagType: 'orange' };
  }
  if (h.includes('vs') || h.includes('legacy') || h.includes('history') || h.includes('evolution') || h.includes('then')) {
    return { tag: 'THEN VS NOW', tagType: 'purple' };
  }
  if (h.includes('what is') || h.includes('definition') || h.includes('simplest') || h.includes('core') || h.includes('overview')) {
    return { tag: 'KEY IDEA', tagType: 'blue' };
  }
  if (h.includes('company') || h.includes('real') || h.includes('case') || h.includes('day in')) {
    return { tag: 'REAL WORLD', tagType: 'blue' };
  }
  return { tag: 'TECHNIQUE', tagType: 'green' };
}

function shortLabel(heading) {
  const clean = heading
    .replace(/^\d+\.\s*/, '')
    .replace(/\(.*?\)/g, '')
    .replace(/—.*$/, '')
    .trim();
  const words = clean.split(/\s+/).slice(0, 2).join(' ');
  return words.length > 16 ? words.slice(0, 15) + '…' : words;
}

function extractCallout(markdownBody) {
  // Look for blockquote (> ...) or bold Rule of thumb / Interview trap
  const lines = markdownBody.split('\n');
  const quoteLines = [];
  const remainingLines = [];
  let inQuote = false;
  let captured = false;

  for (const line of lines) {
    if (!captured && line.trim().startsWith('>')) {
      inQuote = true;
      quoteLines.push(line.replace(/^>\s*/, ''));
    } else if (inQuote) {
      inQuote = false;
      captured = true;
      remainingLines.push(line);
    } else {
      remainingLines.push(line);
    }
  }

  if (quoteLines.length > 0) {
    const text = quoteLines.join(' ').trim();
    const isTrap = text.toLowerCase().includes('trap') || text.toLowerCase().includes('watch out');
    return {
      callout: {
        label: isTrap ? 'WATCH OUT' : 'GOOD TO KNOW',
        type: isTrap ? 'orange' : 'blue',
        text: text.replace(/^(Interview trap:|Note:|Tip:)\s*/i, ''),
      },
      body: remainingLines.join('\n').trim(),
    };
  }
  return { callout: null, body: markdownBody.trim() };
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(4, Math.min(20, Math.round(words / 180)));
  return `${mins} min`;
}

function inferLevel(modNum, fileIdx) {
  const n = parseInt(modNum, 10);
  if (n <= 3 && fileIdx <= 3) return 'Beginner';
  if (n >= 11 || n === 15 || n === 16) return 'Advanced';
  if (n <= 5) return 'Beginner';
  return 'Intermediate';
}

function parseMarkdownLesson(filePath, modId, modMeta, fileIdx) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const content = stripFooter(raw);
  const lines = content.split('\n');

  let title = path.basename(filePath, '.md').replace(/^\d+-/, '').replace(/-/g, ' ');
  title = title.replace(/\b\w/g, (c) => c.toUpperCase());

  const h1Line = lines.find((l) => l.startsWith('# '));
  if (h1Line) {
    title = h1Line.replace(/^#\s*\d*\.?\s*/, '').trim();
  }

  // Split by ## headings
  const sections = [];
  let currentHeading = null;
  let currentLines = [];

  for (const line of lines) {
    if (line.startsWith('# ')) continue;
    if (line.startsWith('## ')) {
      if (currentHeading !== null || currentLines.join('').trim().length > 0) {
        sections.push({
          heading: currentHeading || 'Overview',
          rawBody: currentLines.join('\n').trim(),
        });
      }
      currentHeading = line.replace(/^##\s*/, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentHeading !== null || currentLines.join('').trim().length > 0) {
    sections.push({
      heading: currentHeading || 'Overview',
      rawBody: currentLines.join('\n').trim(),
    });
  }

  const validSections = sections.filter((s) => s.rawBody.length > 0);
  if (validSections.length === 0) {
    validSections.push({ heading: title, rawBody: content });
  }

  const steps = validSections.map((sec, idx) => {
    const { tag, tagType } = classifyStepTag(sec.heading);
    const { callout, body } = extractCallout(sec.rawBody);
    return {
      index: idx,
      shortLabel: shortLabel(sec.heading),
      tag,
      tagType,
      heading: sec.heading,
      body,
      callout,
    };
  });

  // Add a Recap step at the end
  steps.push({
    index: steps.length,
    shortLabel: 'Recap',
    tag: 'RECAP',
    tagType: 'green',
    heading: 'Recap',
    body: '',
    recapPoints: validSections.slice(0, 6).map((s) => s.heading),
    callout: null,
  });

  // First sentence for tagline
  const firstPara = validSections[0]?.rawBody
    .split('\n')
    .find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('|') && !l.startsWith('-'));
  const tagline = firstPara
    ? firstPara.replace(/\*\*/g, '').replace(/`/g, '').slice(0, 140) + (firstPara.length > 140 ? '…' : '')
    : `Master ${title} with step-by-step architecture & production patterns.`;

  const id = path.basename(filePath, '.md');
  return {
    id,
    slug: `${modId}/${id}`,
    moduleId: modId,
    title,
    tagline,
    readTime: estimateReadTime(content),
    level: inferLevel(modMeta.num, fileIdx),
    simType: modMeta.sim,
    learnItems: validSections.slice(0, 5).map((s) => s.heading),
    steps,
  };
}

function parseGlossary() {
  const glossaryPath = path.join(DE_ROOT, 'GLOSSARY.md');
  if (!fs.existsSync(glossaryPath)) return [];
  const raw = stripFooter(fs.readFileSync(glossaryPath, 'utf-8'));
  const terms = [];
  for (const line of raw.split('\n')) {
    // Match markdown table rows | **Term** | Definition |
    const m = line.match(/^\|\s*\*?\*?([^|*]+)\*?\*?\s*\|\s*([^|]+)\|/);
    if (m && !m[1].toLowerCase().includes('term') && !m[1].includes('---')) {
      terms.push({
        term: m[1].trim(),
        definition: m[2].trim(),
      });
    }
  }
  return terms;
}

function parseInterviewQuestions(modDirs) {
  const bank = [];
  for (const dir of modDirs) {
    const iqPath = path.join(DE_ROOT, dir, 'interview-questions.md');
    if (!fs.existsSync(iqPath)) continue;
    const raw = stripFooter(fs.readFileSync(iqPath, 'utf-8'));
    const modMeta = MODULE_META[dir];
    const sections = raw.split(/\n(?=###\s|\*\*Q\d+\.|\*\*\d+\.)/);
    for (const sec of sections) {
      const firstLine = sec.split('\n')[0].trim();
      if (
        firstLine.startsWith('### ') ||
        firstLine.match(/^\*\*Q?\d+\./)
      ) {
        const q = firstLine
          .replace(/^###\s*/, '')
          .replace(/^\*\*/, '')
          .replace(/\*\*$/, '')
          .trim();
        const a = sec.split('\n').slice(1).join('\n').trim();
        if (q && a) {
          bank.push({
            moduleId: dir,
            moduleTitle: `${modMeta.num}. ${modMeta.title}`,
            question: q,
            answer: a,
          });
        }
      }
    }
  }
  return bank;
}

function main() {
  if (!fs.existsSync(DE_ROOT)) {
    const existing = path.join(OUT_DIR, 'courseData.json');
    if (fs.existsSync(existing)) {
      console.log(`DE source folder not found (${DE_ROOT}); using existing courseData.json.`);
      return;
    }
    throw new Error(`DE source folder not found: ${DE_ROOT}`);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const modDirs = Object.keys(MODULE_META).filter((d) => fs.existsSync(path.join(DE_ROOT, d)));
  const modules = [];
  const lessonsBySlug = {};
  const caseStudies = [];

  for (const dir of modDirs) {
    const modPath = path.join(DE_ROOT, dir);
    const meta = MODULE_META[dir];
    const files = fs
      .readdirSync(modPath)
      .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'interview-questions.md' && f !== 'glossary.md')
      .sort();

    const lessonRefs = [];
    files.forEach((file, idx) => {
      const lesson = parseMarkdownLesson(path.join(modPath, file), dir, meta, idx);
      lessonsBySlug[lesson.slug] = lesson;
      lessonRefs.push({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        level: lesson.level,
        readTime: lesson.readTime,
        stepCount: lesson.steps.length,
      });
    });

    // Check case-studies subfolder
    const csDir = path.join(modPath, 'case-studies');
    if (fs.existsSync(csDir)) {
      const csFiles = fs.readdirSync(csDir).filter((f) => f.endsWith('.md')).sort();
      for (const csFile of csFiles) {
        const csLesson = parseMarkdownLesson(path.join(csDir, csFile), dir, meta, 99);
        csLesson.isCaseStudy = true;
        csLesson.slug = `${dir}/case-${csLesson.id}`;
        lessonsBySlug[csLesson.slug] = csLesson;
        caseStudies.push({
          slug: csLesson.slug,
          moduleId: dir,
          moduleTitle: `${meta.num}. ${meta.title}`,
          title: csLesson.title,
          tagline: csLesson.tagline,
          readTime: csLesson.readTime,
        });
      }
    }

    modules.push({
      id: dir,
      num: meta.num,
      title: meta.title,
      icon: meta.icon,
      color: meta.color,
      sim: meta.sim,
      lessons: lessonRefs,
    });
  }

  // Handle 13-projects sub-READMEs if 13-projects has no top-level numbered md files
  const projMod = modules.find((m) => m.id === '13-projects');
  if (projMod && projMod.lessons.length === 0) {
    const projDir = path.join(DE_ROOT, '13-projects');
    const subDirs = fs
      .readdirSync(projDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    subDirs.forEach((sub, idx) => {
      const readme = path.join(projDir, sub, 'README.md');
      if (fs.existsSync(readme)) {
        const lesson = parseMarkdownLesson(readme, '13-projects', MODULE_META['13-projects'], idx);
        lesson.id = sub;
        lesson.slug = `13-projects/${sub}`;
        lessonsBySlug[lesson.slug] = lesson;
        projMod.lessons.push({
          id: sub,
          slug: lesson.slug,
          title: lesson.title,
          level: 'Advanced',
          readTime: lesson.readTime,
          stepCount: lesson.steps.length,
        });
      }
    });
  }

  // Handle 14-internal-tools README
  const toolsMod = modules.find((m) => m.id === '14-internal-tools');
  if (toolsMod && toolsMod.lessons.length === 0) {
    const readme = path.join(DE_ROOT, '14-internal-tools', 'README.md');
    if (fs.existsSync(readme)) {
      const lesson = parseMarkdownLesson(readme, '14-internal-tools', MODULE_META['14-internal-tools'], 0);
      lesson.id = 'internal-tools';
      lesson.slug = '14-internal-tools/internal-tools';
      lessonsBySlug[lesson.slug] = lesson;
      toolsMod.lessons.push({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        level: 'Beginner',
        readTime: lesson.readTime,
        stepCount: lesson.steps.length,
      });
    }
  }

  const glossary = parseGlossary();
  const interviewQuestions = parseInterviewQuestions(modDirs);

  const output = {
    modules,
    lessonsBySlug,
    caseStudies,
    glossary,
    interviewQuestions,
    stats: {
      totalModules: modules.length,
      totalLessons: Object.values(modules).reduce((s, m) => s + m.lessons.length, 0),
      totalCaseStudies: caseStudies.length,
      totalQuestions: interviewQuestions.length,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, 'courseData.json'), JSON.stringify(output, null, 2));
  console.log('Generated courseData.json:', output.stats);
}

main();
