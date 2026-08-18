import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEMO_DATA } from '../client/src/original/features/generator/cv-core';
import { CvClassicTemplate, CvModernTemplate, CvMinimalTemplate, CvCreativeTemplate, CvExecutiveTemplate, CvTechTemplate } from '../client/src/original/features/generator/cv-templates-1';
import { CvElegantTemplate, CvCompactTemplate, CvBoldTemplate, CvAcademicTemplate, CvTimelineTemplate, CvSidebarRightTemplate } from '../client/src/original/features/generator/cv-templates-2';
import { CvGradientTemplate, CvTwoColumnTemplate, CvCenteredTemplate, CvSlateTemplate, CvCosmicTemplate, CvSharpTemplate, CvNovaTemplate, CvBoxedTemplate } from '../client/src/original/features/generator/cv-templates-3';

const templates = [
  ['Classic', CvClassicTemplate], ['Modern', CvModernTemplate], ['Minimal', CvMinimalTemplate], ['Creative', CvCreativeTemplate], ['Executive', CvExecutiveTemplate], ['Tech', CvTechTemplate],
  ['Elegant', CvElegantTemplate], ['Compact', CvCompactTemplate], ['Bold', CvBoldTemplate], ['Academic', CvAcademicTemplate], ['Timeline', CvTimelineTemplate], ['SidebarRight', CvSidebarRightTemplate],
  ['Gradient', CvGradientTemplate], ['TwoColumn', CvTwoColumnTemplate], ['Centered', CvCenteredTemplate], ['Slate', CvSlateTemplate], ['Cosmic', CvCosmicTemplate], ['Sharp', CvSharpTemplate], ['Nova', CvNovaTemplate], ['Boxed', CvBoxedTemplate],
] as const;
const theme = { primary:'#2563eb', accent:'#0d9488', sidebar:'#1e3a8a', sidebarText:'#ffffff' };
const sizes = { name:26, titleLine:14, secHead:14, jobTitle:13, body:12, date:11, contact:11, tag:11 };
const shared = { theme, sizes, fontFamily:'Inter, Arial, sans-serif', headingFont:'Inter', bodyFont:'Inter', skillStyle:'plain' as const, atsMode:true };

for (const [name, Component] of templates) {
  const result = { name, sparse:'ok', populated:'ok', ats:'ok', sparseLength:0, populatedLength:0, error:'' };
  try { result.sparseLength = renderToStaticMarkup(<Component data={{ ...DEMO_DATA, summary:'', experience:[], education:[], skills:[], projects:[], certifications:[], languages:[], references:[], hobbies:[], custom:{title:'',body:''}, additionalExperience:[] } as any} {...shared} />).length; } catch (error) { result.sparse='error'; result.error=String(error); }
  try { result.populatedLength = renderToStaticMarkup(<Component data={DEMO_DATA as any} {...shared} />).length; } catch (error) { result.populated='error'; result.error=String(error); }
  try { renderToStaticMarkup(<Component data={DEMO_DATA as any} {...shared} atsMode={true} />); } catch (error) { result.ats='error'; result.error=String(error); }
  console.log(JSON.stringify(result));
}
