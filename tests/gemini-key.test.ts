import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStory } from '../services/geminiService.ts';
// Prevent a regression from attempting machine credential discovery during tests.
process.env.GOOGLE_APPLICATION_CREDENTIALS = '/nonexistent/test-credentials-must-never-be-loaded.json';
process.env.API_KEY = 'TEST_ENVIRONMENT_KEY_NOT_A_CREDENTIAL';

test('missing visitor key rejects without using a deployment key', async () => {
  const old = process.env.API_KEY; const oldFetch = globalThis.fetch; let calls = 0;
  process.env.API_KEY = 'OWNER_KEY_MUST_NOT_BE_USED';
  globalThis.fetch = async () => {calls++; return new Response(JSON.stringify({candidates: [{content: {parts: [{text: 'A future story.'}]}}]}));};
  try {await assert.rejects(() => generateStory('Example'), /Add your Gemini API key/); assert.equal(calls, 0);}
  finally {globalThis.fetch = oldFetch; if(old === undefined) delete process.env.API_KEY; else process.env.API_KEY = old;}
});

test('visitor-key story generation calls Gemini directly with header credentials', async () => {
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++; const req = new Request(input,init);
    assert.equal(new URL(req.url).origin,'https://generativelanguage.googleapis.com');
    assert.equal(new URL(req.url).searchParams.has('key'),false);
    assert.equal(req.headers.get('x-goog-api-key'),'VISITOR_TEST_KEY');
    assert.match(await req.text(),/Example prompt/);
    return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'A future story.'}]}}]}));
  };
  try {assert.equal(await generateStory('Example prompt',' VISITOR_TEST_KEY '),'A future story.'); assert.equal(calls,1);}
  finally {globalThis.fetch = oldFetch;}
});

test('invalid keys produce a useful message without leaking the raw response', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({error:{message:'Invalid VISITOR_TEST_KEY',code:401}}),{status:401});
  try {await assert.rejects(() => generateStory('Example','VISITOR_TEST_KEY'), (error: Error) => {assert.match(error.message,/key/i); assert.doesNotMatch(error.message,/VISITOR_TEST_KEY/); return true;});}
  finally {globalThis.fetch = oldFetch;}
});
