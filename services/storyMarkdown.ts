import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const renderStoryMarkdown = (text: string): string => DOMPurify.sanitize(
  marked.parse(text, {async: false}) as string,
  {USE_PROFILES: {html: true}, FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select', 'iframe', 'object', 'embed']}
);
