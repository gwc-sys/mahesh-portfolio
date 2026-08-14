import { useEffect, useState } from 'react';
import { TbBrandGithub, TbExternalLink } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const profileReadmeUrl = 'https://raw.githubusercontent.com/gwc-sys/gwc-sys/main/README.md';
const profileRepositoryUrl = 'https://github.com/gwc-sys/gwc-sys';

export default function GitHubReadme() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadReadme() {
      try {
        const response = await fetch(profileReadmeUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        setMarkdown(await response.text());
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadReadme();
    return () => controller.abort();
  }, []);

  return <section className="github-readme" aria-label="GitHub profile README"><header><div><span className="eyebrow">LIVE FROM GITHUB</span><h2><TbBrandGithub /> Profile README</h2></div><a href={profileRepositoryUrl} target="_blank" rel="noreferrer">View source <TbExternalLink /></a></header>{loading && <div className="readme-status">Loading GitHub profile…</div>}{error && <div className="readme-status"><p>The live README is temporarily unavailable.</p><a href={profileRepositoryUrl} target="_blank" rel="noreferrer">Open it on GitHub</a></div>}{markdown && <article className="readme-content"><ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{markdown}</ReactMarkdown></article>}</section>;
}
